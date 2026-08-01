import type {
  ActorId,
  CorrelationId,
  OperationId,
  PrivacyClass,
} from "@knowledgeos/domain-types";
import type { Cancellation } from "./cancellation.js";
import type { Clock } from "./clock.js";

export interface ExecutionContext {
  readonly operationId: OperationId;
  readonly correlationId: CorrelationId;
  readonly actorId?: ActorId;
  readonly privacyClass: PrivacyClass;
  readonly clock: Clock;
  readonly cancellation: Cancellation;
  readonly metadata: Readonly<Record<string, string>>;
}
