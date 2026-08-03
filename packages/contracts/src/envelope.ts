import type {
  ContractVersion,
  IsoTimestamp,
  KnowledgeOSError,
  Result,
} from "@knowledgeos/domain-types";
import type { RequestContext } from "./context.js";

export interface ContractEnvelope<T> {
  readonly contract: string;
  readonly contractVersion: ContractVersion;
  readonly context: RequestContext;
  readonly payload: T;
}

export interface ResponseMetadata {
  readonly completedAt: IsoTimestamp;
  readonly warnings?: readonly KnowledgeOSError[];
}

export type ContractResponse<T> = Result<
  {
    readonly data: T;
    readonly metadata: ResponseMetadata;
  },
  KnowledgeOSError
>;
