export type SearchChangeKind =
  | "document-upserted"
  | "document-deleted"
  | "embedding-updated"
  | "graph-updated"
  | "personal-knowledge-updated";

export interface SearchChangeEvent {
  readonly sequence: number;
  readonly kind: SearchChangeKind;
  readonly searchDocumentId?: string;
  readonly knowledgeObjectId?: string;
  readonly occurredAt: string;
}

export interface SearchLiveSubscription {
  readonly subscriptionId: string;
  readonly ownerId: string;
  readonly savedSearchId: string;
  readonly lastSequence: number;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SearchResultSnapshot {
  readonly subscriptionId: string;
  readonly sequence: number;
  readonly resultIds: readonly string[];
  readonly createdAt: string;
}

export interface SearchResultDelta {
  readonly subscriptionId: string;
  readonly fromSequence: number;
  readonly toSequence: number;
  readonly added: readonly string[];
  readonly removed: readonly string[];
  readonly retained: readonly string[];
}
