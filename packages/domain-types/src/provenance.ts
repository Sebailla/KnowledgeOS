import type { ProviderId, SourceItemId } from "./identity.js";
import type { IsoTimestamp } from "./time.js";
import type { VersionId } from "./version.js";

export type ProvenanceKind =
  | "source"
  | "user"
  | "processor"
  | "provider"
  | "external";

export interface ProvenanceRecord {
  readonly kind: ProvenanceKind;
  readonly sourceItemId?: SourceItemId;
  readonly sourceVersionId?: VersionId;
  readonly providerId?: ProviderId;
  readonly processor?: string;
  readonly processorVersion?: string;
  readonly occurredAt: IsoTimestamp;
  readonly evidence?: Readonly<Record<string, string>>;
}
