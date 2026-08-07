import {
  createHash,
  randomUUID,
} from "node:crypto";

export type SupportedImportFormat =
  | "pdf"
  | "epub"
  | "markdown"
  | "html"
  | "text";

export type ImportJobState =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface ImportInput {
  readonly name: string;
  readonly content: string;
  readonly mediaType?: string;
  readonly extension?: string;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
  readonly runOCR?: boolean;
}

export interface ImportPreview {
  readonly name: string;
  readonly format: SupportedImportFormat;
  readonly mediaType: string;
  readonly title: string;
  readonly checksum: string;
  readonly size: number;
  readonly duplicate: boolean;
  readonly requiresOCR: boolean;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface ImportJob {
  readonly id: string;
  readonly input: ImportInput;
  readonly preview: ImportPreview;
  readonly state: ImportJobState;
  readonly progress: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly result?: {
    readonly documentId: string;
    readonly title: string;
    readonly format: SupportedImportFormat;
    readonly checksum: string;
  };
  readonly error?: string;
}

export interface StagedImportLease {
  readonly leaseId: string;
  readonly capability: string;
}

export interface QueuedStagedImport {
  readonly operationId: string;
  readonly leaseId: string;
  readonly state: "ProcessingQueued";
}

export class ImportJobManager {
  private readonly jobs =
    new Map<string, ImportJob>();

  private readonly checksums =
    new Set<string>();

  public queueStaged(
    operationId: string,
    lease: StagedImportLease,
  ): QueuedStagedImport {
    return {
      operationId,
      leaseId: lease.leaseId,
      state: "ProcessingQueued",
    };
  }

  public detect(
    input: ImportInput,
  ): ImportPreview {
    const format = detectFormat(input);
    const checksum = createHash("sha256")
      .update(input.content)
      .digest("hex");

    return {
      name: input.name,
      format,
      mediaType:
        input.mediaType ??
        mediaTypeFor(format),
      title:
        titleFrom(input, format),
      checksum,
      size:
        Buffer.byteLength(
          input.content,
          "utf8",
        ),
      duplicate:
        this.checksums.has(checksum),
      requiresOCR:
        format === "pdf" &&
        input.content.trim().length === 0,
      metadata: {
        ...(input.metadata ?? {}),
        originalName: input.name,
      },
    };
  }

  public start(
    input: ImportInput,
  ): ImportJob {
    const preview = this.detect(input);
    const now = new Date().toISOString();
    const id = randomUUID();

    const queued: ImportJob = {
      id,
      input,
      preview,
      state: "queued",
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(id, queued);

    if (preview.duplicate) {
      const failed: ImportJob = {
        ...queued,
        state: "failed",
        progress: 1,
        updatedAt:
          new Date().toISOString(),
        error:
          "A document with the same checksum already exists.",
      };

      this.jobs.set(id, failed);
      return failed;
    }

    const running: ImportJob = {
      ...queued,
      state: "running",
      progress: 0.35,
      updatedAt:
        new Date().toISOString(),
    };

    this.jobs.set(id, running);

    const completed: ImportJob = {
      ...running,
      state: "completed",
      progress: 1,
      updatedAt:
        new Date().toISOString(),
      result: {
        documentId:
          `imported:${preview.checksum.slice(0, 20)}`,
        title: preview.title,
        format: preview.format,
        checksum: preview.checksum,
      },
    };

    this.checksums.add(
      preview.checksum,
    );
    this.jobs.set(id, completed);

    return completed;
  }

  public status(
    id: string,
  ): ImportJob | undefined {
    return this.jobs.get(id);
  }

  public cancel(
    id: string,
  ): ImportJob | undefined {
    const job = this.jobs.get(id);

    if (
      !job ||
      job.state === "completed" ||
      job.state === "failed"
    ) {
      return job;
    }

    const cancelled: ImportJob = {
      ...job,
      state: "cancelled",
      updatedAt:
        new Date().toISOString(),
    };

    this.jobs.set(id, cancelled);
    return cancelled;
  }

  public retry(
    id: string,
  ): ImportJob | undefined {
    const job = this.jobs.get(id);

    if (!job) {
      return undefined;
    }

    this.jobs.delete(id);

    if (
      job.preview.duplicate &&
      job.result === undefined
    ) {
      this.checksums.delete(
        job.preview.checksum,
      );
    }

    return this.start(job.input);
  }

  public history():
  readonly ImportJob[] {
    return [...this.jobs.values()]
      .sort(
        (left, right) =>
          right.createdAt.localeCompare(
            left.createdAt,
          ),
      );
  }
}

export function detectFormat(
  input: ImportInput,
): SupportedImportFormat {
  const extension = (
    input.extension ??
    input.name.split(".").at(-1) ??
    ""
  ).toLocaleLowerCase();

  const mediaType =
    input.mediaType?.toLocaleLowerCase();

  if (
    extension === "pdf" ||
    mediaType === "application/pdf"
  ) {
    return "pdf";
  }

  if (
    extension === "epub" ||
    mediaType === "application/epub+zip"
  ) {
    return "epub";
  }

  if (
    ["md", "markdown"].includes(extension) ||
    mediaType === "text/markdown"
  ) {
    return "markdown";
  }

  if (
    ["html", "htm"].includes(extension) ||
    mediaType === "text/html"
  ) {
    return "html";
  }

  if (
    ["txt", "text"].includes(extension) ||
    mediaType === "text/plain"
  ) {
    return "text";
  }

  throw new Error(
    `Unsupported import format for '${input.name}'.`,
  );
}

function mediaTypeFor(
  format: SupportedImportFormat,
): string {
  switch (format) {
    case "pdf":
      return "application/pdf";
    case "epub":
      return "application/epub+zip";
    case "markdown":
      return "text/markdown";
    case "html":
      return "text/html";
    case "text":
      return "text/plain";
  }
}

function titleFrom(
  input: ImportInput,
  format: SupportedImportFormat,
): string {
  const metadataTitle =
    input.metadata?.title;

  if (
    typeof metadataTitle === "string" &&
    metadataTitle.trim().length > 0
  ) {
    return metadataTitle.trim();
  }

  if (format === "markdown") {
    const heading =
      input.content.match(
        /^#\s+(.+)$/m,
      )?.[1];

    if (heading) {
      return heading.trim();
    }
  }

  if (format === "html") {
    const title =
      input.content.match(
        /<title[^>]*>(.*?)<\/title>/is,
      )?.[1];

    if (title) {
      return title
        .replace(/<[^>]+>/g, "")
        .trim();
    }
  }

  return input.name.replace(
    /\.[^.]+$/,
    "",
  );
}
