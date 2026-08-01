import type {
  IdentityReference,
  PersonalKnowledgeId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export type ExportFormat =
  | "markdown"
  | "html"
  | "pdf"
  | "epub"
  | "docx"
  | "latex"
  | "canonical-json"
  | "exchange-package"
  | "plain-text";

export interface ExportKnowledgeObjectPayload {
  readonly source: IdentityReference;
  readonly format: ExportFormat;
  readonly profileId: string;
  readonly includedPersonalKnowledgeIds?: readonly PersonalKnowledgeId[];
}

export type ExportKnowledgeObjectCommand = Command<
  "export.knowledge-object",
  ExportKnowledgeObjectPayload
>;

export type GetExportCapabilitiesQuery = Query<
  "export.get-capabilities",
  { readonly format?: ExportFormat }
>;
