import type {
  ActorId,
  CausationId,
  CorrelationId,
  IsoTimestamp,
  OperationId,
  PrivacyClass,
} from "@knowledgeos/domain-types";

export interface RequestContext {
  readonly operationId: OperationId;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly actorId?: ActorId;
  readonly requestedAt: IsoTimestamp;
  readonly deadline?: IsoTimestamp;
  readonly privacyClass: PrivacyClass;
  readonly locale?: string;
  readonly traceparent?: string;
}
