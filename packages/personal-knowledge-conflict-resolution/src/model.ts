import type {
  PersonalKnowledgeItem,
} from "@knowledgeos/personal-knowledge";

export type ConflictResolutionStrategy =
  | "use-local"
  | "use-remote"
  | "manual-merge";

export interface ResolveConflictCommand {
  readonly conflictId: string;
  readonly strategy: ConflictResolutionStrategy;
  readonly resolvedBy: string;
  readonly expectedLocalRevision: number;
  readonly expectedRemoteRevision: number;
  readonly manualItem?: PersonalKnowledgeItem;
}

export interface ResolvedConflict {
  readonly conflictId: string;
  readonly item: PersonalKnowledgeItem;
  readonly strategy: ConflictResolutionStrategy;
  readonly resolvedBy: string;
  readonly resolvedAt: string;
}
