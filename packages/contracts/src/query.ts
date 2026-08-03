import type {
  ContractVersion,
  OperationId,
} from "@knowledgeos/domain-types";
import type { RequestContext } from "./context.js";

export interface Query<
  Type extends string = string,
  Parameters = unknown,
> {
  readonly type: Type;
  readonly queryId: OperationId;
  readonly contractVersion: ContractVersion;
  readonly context: RequestContext;
  readonly parameters: Parameters;
}
