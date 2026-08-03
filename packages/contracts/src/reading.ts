import type {
  AnchorId,
  KnowledgeObjectId,
  PersonalKnowledgeId,
  UdmNodeId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export interface OpenPublicationParameters {
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly preferredVersionId?: VersionId;
  readonly initialAnchorId?: AnchorId;
}

export type OpenPublicationQuery = Query<
  "reading.open-publication",
  OpenPublicationParameters
>;

export interface ReadingPlan {
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly sourceVersionId: VersionId;
  readonly udmVersionId: VersionId;
  readonly dpmVersionId?: VersionId;
  readonly initialNodeId?: UdmNodeId;
  readonly availableModes: readonly ("semantic" | "source-faithful" | "reflowed")[];
}

export interface SaveReadingPositionPayload {
  readonly readingStateId: PersonalKnowledgeId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly anchorId: AnchorId;
  readonly progress?: number;
}

export type SaveReadingPositionCommand = Command<
  "reading.save-position",
  SaveReadingPositionPayload
>;
