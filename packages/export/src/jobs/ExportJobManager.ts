import {
  createHash,
  randomUUID,
} from "node:crypto";

export type ManagedExportFormat =
  | "markdown"
  | "html"
  | "pdf"
  | "epub"
  | "text"
  | "knowledge-package";

export type ManagedExportJobState =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface ExportSelection {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly annotations?: readonly string[];
  readonly bookmarks?: readonly string[];
  readonly assets?: readonly string[];
  readonly graphRelations?: readonly string[];
  readonly provenance?: readonly string[];
}

export interface ExportOptions {
  readonly includeMetadata?: boolean;
  readonly includeAnnotations?: boolean;
  readonly includeBookmarks?: boolean;
  readonly includeAssets?: boolean;
  readonly includeGraph?: boolean;
  readonly includeProvenance?: boolean;
}

export interface ExportPreview {
  readonly format: ManagedExportFormat;
  readonly sourceCount: number;
  readonly estimatedSize: number;
  readonly fileName: string;
  readonly mediaType: string;
  readonly includedSections: readonly string[];
}

export interface ExportManifest {
  readonly version: 1;
  readonly format: ManagedExportFormat;
  readonly createdAt: string;
  readonly sourceIds: readonly string[];
  readonly checksum: string;
  readonly options: ExportOptions;
}

export interface ManagedExportJob {
  readonly id: string;
  readonly format: ManagedExportFormat;
  readonly sources: readonly ExportSelection[];
  readonly options: ExportOptions;
  readonly state: ManagedExportJobState;
  readonly progress: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly preview: ExportPreview;
  readonly result?: {
    readonly fileName: string;
    readonly mediaType: string;
    readonly content: string;
    readonly checksum: string;
    readonly manifest: ExportManifest;
  };
  readonly error?: string;
}

export class ExportJobManager {
  private readonly jobs = new Map<string, ManagedExportJob>();

  public formats(): readonly {
    readonly id: ManagedExportFormat;
    readonly name: string;
    readonly mediaType: string;
  }[] {
    return [
      { id: "markdown", name: "Markdown", mediaType: "text/markdown" },
      { id: "html", name: "HTML", mediaType: "text/html" },
      { id: "pdf", name: "PDF", mediaType: "application/pdf" },
      { id: "epub", name: "EPUB", mediaType: "application/epub+zip" },
      { id: "text", name: "Plain Text", mediaType: "text/plain" },
      { id: "knowledge-package", name: "KnowledgeOS Package", mediaType: "application/vnd.knowledgeos.package+json" },
    ];
  }

  public preview(format: ManagedExportFormat, sources: readonly ExportSelection[], options: ExportOptions = {}): ExportPreview {
    const includedSections = [
      ...(options.includeMetadata ? ["metadata"] : []),
      ...(options.includeAnnotations ? ["annotations"] : []),
      ...(options.includeBookmarks ? ["bookmarks"] : []),
      ...(options.includeAssets ? ["assets"] : []),
      ...(options.includeGraph ? ["knowledge-graph"] : []),
      ...(options.includeProvenance ? ["provenance"] : []),
    ];
    const baseName = sources.length === 1 ? sanitize(sources[0]?.title ?? "export") : "knowledgeos-export";
    return {
      format,
      sourceCount: sources.length,
      estimatedSize: Buffer.byteLength(render(format, sources, options), "utf8"),
      fileName: `${baseName}.${extension(format)}`,
      mediaType: mediaType(format),
      includedSections,
    };
  }

  public start(format: ManagedExportFormat, sources: readonly ExportSelection[], options: ExportOptions = {}): ManagedExportJob {
    const now = new Date().toISOString();
    const preview = this.preview(format, sources, options);
    const id = randomUUID();
    const queued: ManagedExportJob = { id, format, sources, options, state: "queued", progress: 0, createdAt: now, updatedAt: now, preview };
    this.jobs.set(id, queued);
    try {
      if (sources.length === 0) throw new Error("At least one export source is required.");
      const content = render(format, sources, options);
      const checksum = createHash("sha256").update(content).digest("hex");
      const manifest: ExportManifest = { version: 1, format, createdAt: new Date().toISOString(), sourceIds: sources.map((source) => source.id), checksum, options };
      const completed: ManagedExportJob = {
        ...queued,
        state: "completed",
        progress: 1,
        updatedAt: new Date().toISOString(),
        result: { fileName: preview.fileName, mediaType: preview.mediaType, content, checksum, manifest },
      };
      this.jobs.set(id, completed);
      return completed;
    } catch (error) {
      const failed: ManagedExportJob = { ...queued, state: "failed", progress: 1, updatedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) };
      this.jobs.set(id, failed);
      return failed;
    }
  }

  public status(id: string): ManagedExportJob | undefined { return this.jobs.get(id); }
  public result(id: string): ManagedExportJob["result"] | undefined { return this.jobs.get(id)?.result; }
  public history(): readonly ManagedExportJob[] { return [...this.jobs.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); }
  public cancel(id: string): ManagedExportJob | undefined {
    const job=this.jobs.get(id); if(!job || ["completed","failed"].includes(job.state)) return job;
    const cancelled={...job,state:"cancelled" as const,updatedAt:new Date().toISOString()}; this.jobs.set(id,cancelled); return cancelled;
  }
  public retry(id: string): ManagedExportJob | undefined { const job=this.jobs.get(id); return job ? this.start(job.format,job.sources,job.options) : undefined; }
}

function render(format: ManagedExportFormat, sources: readonly ExportSelection[], options: ExportOptions): string {
  const documents=sources.map((source)=>renderSource(source,options));
  switch(format){
    case "markdown": return documents.map((doc)=>`# ${doc.title}\n\n${doc.body}${doc.appendix}`).join("\n\n---\n\n");
    case "html": return `<!doctype html><html><head><meta charset="utf-8"><title>KnowledgeOS Export</title></head><body>${documents.map((doc)=>`<article><h1>${escapeHTML(doc.title)}</h1><pre>${escapeHTML(doc.body+doc.appendix)}</pre></article>`).join("")}</body></html>`;
    case "text": return documents.map((doc)=>`${doc.title}\n${"=".repeat(doc.title.length)}\n\n${doc.body}${doc.appendix}`).join("\n\n");
    case "pdf": return `%PDF-KNOWLEDGEOS-1.0\n${documents.map((doc)=>`${doc.title}\n${doc.body}${doc.appendix}`).join("\n\f\n")}`;
    case "epub": return JSON.stringify({ type:"epub-manifest", version:1, documents },null,2);
    case "knowledge-package": return JSON.stringify({ type:"knowledgeos-package", version:1, documents:sources, options },null,2);
  }
}

function renderSource(source: ExportSelection, options: ExportOptions){
  const sections:string[]=[];
  if(options.includeMetadata) sections.push(`\n\nMetadata\n${JSON.stringify(source.metadata ?? {},null,2)}`);
  if(options.includeAnnotations) sections.push(`\n\nAnnotations\n${(source.annotations ?? []).join("\n")}`);
  if(options.includeBookmarks) sections.push(`\n\nBookmarks\n${(source.bookmarks ?? []).join("\n")}`);
  if(options.includeAssets) sections.push(`\n\nAssets\n${(source.assets ?? []).join("\n")}`);
  if(options.includeGraph) sections.push(`\n\nKnowledge Graph\n${(source.graphRelations ?? []).join("\n")}`);
  if(options.includeProvenance) sections.push(`\n\nProvenance\n${(source.provenance ?? []).join("\n")}`);
  return { title:source.title, body:source.body, appendix:sections.join("") };
}
function extension(format: ManagedExportFormat):string { return ({markdown:"md",html:"html",pdf:"pdf",epub:"epub",text:"txt","knowledge-package":"knowledgeos.json"})[format]; }
function mediaType(format: ManagedExportFormat):string { return ({markdown:"text/markdown",html:"text/html",pdf:"application/pdf",epub:"application/epub+zip",text:"text/plain","knowledge-package":"application/vnd.knowledgeos.package+json"})[format]; }
function sanitize(value:string):string { return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "export"; }
function escapeHTML(value:string):string { return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
