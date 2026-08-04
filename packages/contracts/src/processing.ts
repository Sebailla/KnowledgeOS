import type {
  KnowledgeObjectId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export interface ProcessPublicationPayload {
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly sourceItemId: SourceItemId;
  readonly sourceVersionId: VersionId;
  readonly processingProfile: string;
}

export type ProcessPublicationCommand = Command<
  "processing.process-publication",
  ProcessPublicationPayload
>;

export type GetProcessingStatusQuery = Query<
  "processing.get-status",
  { readonly knowledgeObjectId: KnowledgeObjectId }
>;
