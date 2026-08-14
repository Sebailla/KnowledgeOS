import type {
  InspectPublicationResultV1,
  MetadataCandidate,
  MetadataEvidence,
  MetadataSuggestion,
} from "@knowledgeos/contracts";
import { unzipSync, strFromU8 } from "fflate";
import { XMLParser } from "fast-xml-parser";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface InspectPublicationInput {
  readonly metadata: {
    readonly originalFilename: string;
    readonly declaredMediaType: "application/pdf" | "application/epub+zip";
    readonly byteLength: number;
  };
  readonly source: Uint8Array | AsyncIterable<Uint8Array>;
  /** Optional local-only adapter. Import owns ranking; the runtime owns OCR. */
  readonly ocr?: {
    recognizePdf(request: { readonly sourceId: string; readonly content: Uint8Array }): Promise<{ readonly text: string; readonly pages: number }>;
  };
}

export class InspectionValidationError extends Error {
  public constructor() { super("Inspection input is invalid."); this.name = "InspectionValidationError"; }
}

const suggestion = (value: string | undefined, evidence: MetadataEvidence, confidence: MetadataSuggestion["confidence"]): MetadataSuggestion | undefined => {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized ? { value: normalized, evidence, confidence } : undefined;
};

const pdfMetadataValues = (value: unknown): readonly string[] => Array.isArray(value) ? value.flatMap(pdfMetadataValues) : [usablePdfMetadata(value)].filter((entry): entry is string => Boolean(entry));
const authors = (value: unknown) => pdfMetadataValues(value).flatMap(entry => entry.split(/\s*(?:;|\band\b)\s*/i)).map(entry => entry.trim()).filter(Boolean);
const filenameTitle = (filename: string) => filename.replace(/\.[^.]+$/, "").replace(/[_.-]+/g, " ").replace(/\s+/g, " ").trim();
const firstPageCandidates = (text: string) => text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length >= 3 && line.length <= 200);
const firstPageAuthors = (lines: readonly string[]) => {
  const line = lines.find(entry => /^(?:by\s+)?[A-Z][\p{L}'-]+\s+[A-Z][\p{L}'-]+(?:\s+(?:and|,|&)\s+[A-Z][\p{L}'-]+\s+[A-Z][\p{L}'-]+)+$/u.test(entry))
    ?? lines.find(entry => /^by\s+[A-Z][\p{L}'-]+\s+[A-Z][\p{L}'-]+$/iu.test(entry));
  return authors(line?.replace(/^by\s+/i, ""));
};

async function sourceBytes(source: InspectPublicationInput["source"]): Promise<Uint8Array> {
  if (source instanceof Uint8Array) return source;
  const chunks: Uint8Array[] = [];
  let length = 0;
  for await (const chunk of source) { chunks.push(chunk); length += chunk.byteLength; }
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return output;
}

function result(
  title: MetadataSuggestion | undefined,
  authorValues: readonly MetadataSuggestion[],
  candidates: readonly MetadataCandidate[],
  outcome: InspectPublicationResultV1["outcome"] = title && authorValues.length ? "completed" : "partial",
): InspectPublicationResultV1 {
  return {
    ...(title ? { title } : {}),
    ...(authorValues.length ? { authors: authorValues } : {}),
    candidates,
    correlationId: "correlation:inspection-local",
    outcome,
  };
}

const candidatesFor = (
  field: MetadataCandidate["field"],
  suggestions: readonly MetadataSuggestion[],
  selected: readonly MetadataSuggestion[],
): readonly MetadataCandidate[] => {
  const selectedValues = new Set(selected.map(({ value }) => value));
  const seen = new Set<string>();
  return suggestions.flatMap((suggestion) => {
    if (selectedValues.has(suggestion.value) || seen.has(suggestion.value)) return [];
    seen.add(suggestion.value);
    return [{ ...suggestion, field }];
  });
};

const usablePdfMetadata = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized || /[\u0000-\u001f\u007f]/.test(normalized)) return undefined;
  if (/^<unknown>(?:\s*\[[^\]]*\])?$/i.test(normalized)) return undefined;
  if (/^\d{6,}\s+\d{5}\s+[nf]$/i.test(normalized)) return undefined;
  return normalized;
};

async function inspectPdf(input: InspectPublicationInput, data: Uint8Array): Promise<InspectPublicationResultV1> {
  if (data[0] !== 0x25 || data[1] !== 0x50 || data[2] !== 0x44 || data[3] !== 0x46 || data[4] !== 0x2d) throw new InspectionValidationError();
  // PDF.js transfers/detaches the supplied ArrayBuffer. Preserve a separate,
  // ephemeral copy before deterministic parsing in case local OCR is needed.
  const ocrData = input.ocr ? data.slice() : undefined;
  let document;
  try {
    document = await getDocument({ data, disableWorker: true, useSystemFonts: true }).promise;
    const metadata = await document.getMetadata();
    const info = metadata.info as Readonly<Record<string, unknown>>;
    const infoTitle = suggestion(usablePdfMetadata(info.Title), "pdf-info", "high");
    const infoAuthors = authors(info.Author).map(value => suggestion(value, "pdf-info", "high")).filter((value): value is MetadataSuggestion => Boolean(value));
    const xmpTitle = suggestion(pdfMetadataValues(metadata.metadata?.get("dc:title"))[0], "pdf-xmp", "high");
    const xmpAuthors = authors(metadata.metadata?.get("dc:creator")).map(value => suggestion(value, "pdf-xmp", "high")).filter((value): value is MetadataSuggestion => Boolean(value));
    const firstPage = await document.getPage(1);
    const textContent = await firstPage.getTextContent();
    const lines = firstPageCandidates(textContent.items.flatMap(item => "str" in item ? [item.str] : []).join("\n"));
    const textTitle = suggestion(usablePdfMetadata(lines.find(line => !line.startsWith("%PDF") && !line.includes("obj") && !line.includes("stream"))), "first-page-text", "medium");
  const textAuthors = firstPageAuthors(lines).map(value => suggestion(value, "first-page-text", "medium")).filter((value): value is MetadataSuggestion => Boolean(value));
  const fallback = suggestion(filenameTitle(input.metadata.originalFilename), "filename", "low");
  let title = infoTitle ?? xmpTitle ?? textTitle ?? fallback;
  let authorValues = infoAuthors.length ? infoAuthors : xmpAuthors.length ? xmpAuthors : textAuthors;
  let outcome: InspectPublicationResultV1["outcome"] | undefined;
  const ocrTitleCandidates: MetadataSuggestion[] = [];
  const ocrAuthorCandidates: MetadataSuggestion[] = [];
  if ((!title || authorValues.length === 0) && input.ocr) {
    try {
      const local = await input.ocr.recognizePdf({ sourceId: "inspection-source", content: ocrData! });
      const lines = firstPageCandidates(local.text);
      const ocrTitle = suggestion(usablePdfMetadata(lines[0]), "local-ocr", "medium");
      const ocrAuthors = firstPageAuthors(lines).map(value => suggestion(value, "local-ocr", "medium")).filter((value): value is MetadataSuggestion => Boolean(value));
      if (!title) title = ocrTitle;
      if (authorValues.length === 0) authorValues = ocrAuthors;
      if (ocrTitle && ocrTitle !== title) ocrTitleCandidates.push(ocrTitle);
      ocrAuthorCandidates.push(...ocrAuthors.filter(candidate => !authorValues.includes(candidate)));
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
      outcome = code === "ocr.limited" ? "ocr-limited" : "ocr-unavailable";
    }
  }
  const titleCandidates = [infoTitle, xmpTitle, textTitle, fallback, ...ocrTitleCandidates].filter((value): value is MetadataSuggestion => Boolean(value));
  const authorCandidates = [...infoAuthors, ...xmpAuthors, ...textAuthors, ...ocrAuthorCandidates];
  const candidates = [
    ...candidatesFor("title", titleCandidates, title ? [title] : []),
    ...candidatesFor("authors", authorCandidates, authorValues),
  ];
  return result(title, authorValues, candidates, outcome ?? (title && authorValues.length ? "completed" : "partial"));
  } catch (error) {
    if (error instanceof InspectionValidationError) throw error;
    throw new InspectionValidationError();
  } finally {
    await document?.destroy();
  }
}

function values(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.flatMap(values) : typeof value === "string" ? [value] : typeof value === "object" && value !== null && "#text" in value && typeof value["#text"] === "string" ? [value["#text"]] : [];
}

function inspectEpub(input: InspectPublicationInput, data: Uint8Array): InspectPublicationResultV1 {
  let archive: Record<string, Uint8Array>;
  try { archive = unzipSync(data); } catch { throw new InspectionValidationError(); }
  const container = archive["META-INF/container.xml"];
  if (!container) throw new InspectionValidationError();
  const parser = new XMLParser({ ignoreAttributes: false, textNodeName: "#text" });
  const rootfile = parser.parse(strFromU8(container))["container"]?.["rootfiles"]?.["rootfile"];
  const fullPath = typeof rootfile?.["@_full-path"] === "string" ? rootfile["@_full-path"] : undefined;
  const opf = fullPath ? archive[fullPath] : undefined;
  if (!opf) throw new InspectionValidationError();
  const metadata = parser.parse(strFromU8(opf))["package"]?.["metadata"] ?? {};
  const title = suggestion(values(metadata["dc:title"])[0], "epub-opf", "high") ?? suggestion(filenameTitle(input.metadata.originalFilename), "filename", "low");
  const authorValues = values(metadata["dc:creator"]).map(value => suggestion(value, "epub-opf", "high")).filter((value): value is MetadataSuggestion => Boolean(value));
  const fallback = suggestion(filenameTitle(input.metadata.originalFilename), "filename", "low");
  return result(title, authorValues, candidatesFor("title", [fallback].filter((value): value is MetadataSuggestion => Boolean(value)), title ? [title] : []));
}

export async function inspectPublication(input: InspectPublicationInput): Promise<InspectPublicationResultV1> {
  if (!input.metadata.originalFilename || input.metadata.byteLength < 0) throw new InspectionValidationError();
  const data = await sourceBytes(input.source);
  if (data.byteLength !== input.metadata.byteLength) throw new InspectionValidationError();
  return input.metadata.declaredMediaType === "application/pdf" ? inspectPdf(input, data) : inspectEpub(input, data);
}
