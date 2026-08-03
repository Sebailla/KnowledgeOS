import type {
  ContractVersion,
  ExpectedVersion,
  OperationId,
} from "@knowledgeos/domain-types";
import type { RequestContext } from "./context.js";

export interface Command<
  Type extends string = string,
  Payload = unknown,
> extends ExpectedVersion {
  readonly type: Type;
  readonly commandId: OperationId;
  readonly contractVersion: ContractVersion;
  readonly context: RequestContext;
  readonly payload: Payload;
  readonly idempotencyKey?: string;
}

export interface CommandReceipt {
  readonly commandId: OperationId;
  readonly accepted: boolean;
  readonly workflowId?: string;
  readonly jobId?: string;
}
