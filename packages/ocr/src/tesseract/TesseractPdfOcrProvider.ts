import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface LocalOcrCommand {
  readonly executable: "/usr/bin/pdfinfo" | "/usr/bin/pdftoppm" | "/usr/bin/tesseract";
  readonly args: readonly string[];
  readonly stdin?: Uint8Array;
  readonly timeoutMs: number;
  readonly signal?: AbortSignal;
}

export interface LocalOcrCommandResult {
  readonly exitCode: number;
  readonly stdout: Uint8Array;
  readonly stderr: string;
}

export type LocalOcrCommandRunner = (command: LocalOcrCommand) => Promise<LocalOcrCommandResult>;

export class OcrProcessError extends Error {
  public constructor(public readonly code: "ocr.cancelled" | "ocr.limited" | "ocr.unavailable" | "ocr.failed", stage?: "pdf-info" | "rasterize" | "recognize") {
    super(code === "ocr.cancelled" ? "Local OCR was cancelled." : code === "ocr.limited" ? "Local OCR exceeded a configured limit." : code === "ocr.unavailable" ? "Local OCR is unavailable." : `Local OCR failed${stage ? ` during ${stage}` : ""}.`);
    this.name = "OcrProcessError";
  }
}

export interface TesseractPdfOcrOptions {
  readonly sourceId: string;
  readonly content: Uint8Array;
  readonly signal?: AbortSignal;
}

export interface TesseractPdfOcrResult {
  readonly text: string;
  readonly pages: number;
}

export interface TesseractPdfOcrProviderOptions {
  readonly temporaryRoot?: string;
  readonly maxBytes?: number;
  readonly maxPages?: number;
  readonly timeoutMs?: number;
  readonly runner?: LocalOcrCommandRunner;
  readonly readRaster?: (path: string) => Promise<Uint8Array>;
}

const PDFINFO = "/usr/bin/pdfinfo" as const;
const PDFTOPPM = "/usr/bin/pdftoppm" as const;
const TESSERACT = "/usr/bin/tesseract" as const;

export class TesseractPdfOcrProvider {
  private readonly temporaryRoot: string;
  private readonly maxBytes: number;
  private readonly maxPages: number;
  private readonly timeoutMs: number;
  private readonly runner: LocalOcrCommandRunner;
  private readonly readRaster: (path: string) => Promise<Uint8Array>;

  public constructor(options: TesseractPdfOcrProviderOptions = {}) {
    this.temporaryRoot = options.temporaryRoot ?? "/tmp";
    this.maxBytes = options.maxBytes ?? 1_048_576;
    this.maxPages = options.maxPages ?? 3;
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.runner = options.runner ?? runLocalOcrCommand;
    this.readRaster = options.readRaster ?? readFile;
  }

  public async recognizePdf(options: TesseractPdfOcrOptions): Promise<TesseractPdfOcrResult> {
    this.throwIfCancelled(options.signal);
    if (options.content.byteLength > this.maxBytes) throw new OcrProcessError("ocr.limited");
    await mkdir(this.temporaryRoot, { recursive: true });
    const directory = await mkdtemp(join(this.temporaryRoot, "knowledgeos-ocr-"));
    const sourcePath = join(directory, "ocr-source.pdf");
    try {
      await writeFile(sourcePath, options.content);
      const pageInfo = await this.run(command(PDFINFO, [sourcePath], this.timeoutMs, options.signal), "pdf-info");
      const pages = readPages(pageInfo.stdout);
      if (!pages || pages > this.maxPages) throw new OcrProcessError("ocr.limited");
      const text: string[] = [];
      for (let page = 1; page <= pages; page += 1) {
        this.throwIfCancelled(options.signal);
        const outputRoot = join(directory, `ocr-page-${page}`);
        await this.run(command(PDFTOPPM, ["-f", String(page), "-l", String(page), "-singlefile", "-r", "150", "-png", sourcePath, outputRoot], this.timeoutMs, options.signal), "rasterize");
        const rasterPath = `${outputRoot}.png`;
        const recognized = await this.run(command(TESSERACT, [rasterPath, "stdout", "-l", "eng+spa", "--psm", "6"], this.timeoutMs, options.signal), "recognize");
        const value = new TextDecoder().decode(recognized.stdout).trim();
        if (value) text.push(value);
      }
      return { text: text.join("\n"), pages };
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }

  private async run(command: LocalOcrCommand, stage?: "pdf-info" | "rasterize" | "recognize"): Promise<LocalOcrCommandResult> {
    this.throwIfCancelled(command.signal);
    let result: LocalOcrCommandResult;
    try {
      result = await this.runner(command);
    } catch (error) {
      if (error instanceof OcrProcessError) throw error;
      throw new OcrProcessError(command.signal?.aborted ? "ocr.cancelled" : "ocr.unavailable");
    }
    if (command.signal?.aborted) throw new OcrProcessError("ocr.cancelled");
    if (result.exitCode !== 0) throw new OcrProcessError("ocr.failed", stage);
    return result;
  }

  private throwIfCancelled(signal: AbortSignal | undefined): void {
    if (signal?.aborted) throw new OcrProcessError("ocr.cancelled");
  }
}

function readPages(stdout: Uint8Array): number | undefined {
  const matched = /^Pages:\s*(\d+)\s*$/m.exec(new TextDecoder().decode(stdout));
  const pages = matched ? Number(matched[1]) : Number.NaN;
  return Number.isSafeInteger(pages) && pages > 0 ? pages : undefined;
}

function command(
  executable: LocalOcrCommand["executable"],
  args: readonly string[],
  timeoutMs: number,
  signal: AbortSignal | undefined,
  stdin?: Uint8Array,
): LocalOcrCommand {
  return {
    executable,
    args,
    timeoutMs,
    ...(signal ? { signal } : {}),
    ...(stdin ? { stdin } : {}),
  };
}

export const runLocalOcrCommand: LocalOcrCommandRunner = (command) => new Promise((resolve, reject) => {
  if (command.signal?.aborted) { reject(new OcrProcessError("ocr.cancelled")); return; }
  const child = spawn(command.executable, command.args, { shell: false, stdio: ["pipe", "pipe", "pipe"] });
  const stdout: Uint8Array[] = [];
  const stderr: Uint8Array[] = [];
  let settled = false;
  const finish = (callback: () => void) => { if (!settled) { settled = true; callback(); } };
  const timeout = setTimeout(() => finish(() => { child.kill("SIGKILL"); reject(new OcrProcessError("ocr.limited")); }), command.timeoutMs);
  const cancelled = () => finish(() => { clearTimeout(timeout); child.kill("SIGKILL"); reject(new OcrProcessError("ocr.cancelled")); });
  command.signal?.addEventListener?.("abort", cancelled, { once: true });
  child.stdout?.on("data", (chunk) => stdout.push(chunk));
  child.stderr?.on("data", (chunk) => stderr.push(chunk));
  child.on("error", () => finish(() => { clearTimeout(timeout); reject(new OcrProcessError("ocr.unavailable")); }));
  child.on("close", (exitCode) => finish(() => {
    clearTimeout(timeout);
    command.signal?.removeEventListener?.("abort", cancelled);
    resolve({ exitCode: exitCode ?? 1, stdout: concat(stdout), stderr: new TextDecoder().decode(concat(stderr)) });
  }));
  child.stdin?.end(command.stdin ?? new Uint8Array());
});

/** Checks only packaged local executables and language data; it never performs network I/O. */
export async function verifyLocalOcrRuntime(runner: LocalOcrCommandRunner = runLocalOcrCommand): Promise<boolean> {
  try {
    const [tesseract, poppler] = await Promise.all([
      runner({ executable: TESSERACT, args: ["--list-langs"], timeoutMs: 2_000 }),
      runner({ executable: PDFTOPPM, args: ["-v"], timeoutMs: 2_000 }),
    ]);
    if (tesseract.exitCode !== 0 || poppler.exitCode !== 0) return false;
    const languages = new TextDecoder().decode(tesseract.stdout).split(/\r?\n/).map((entry) => entry.trim());
    return languages.includes("eng") && languages.includes("spa");
  } catch {
    return false;
  }
}

function concat(chunks: readonly Uint8Array[]): Uint8Array {
  const length = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return output;
}
