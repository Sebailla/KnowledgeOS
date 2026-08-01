import type {
  CausationId,
  ContractVersion,
  CorrelationId,
  EventId,
  IsoTimestamp,
  VersionId,
} from "@knowledgeos/domain-types";

export interface DomainEvent<
  Type extends string = string,
  Payload = unknown,
> {
  readonly type: Type;
  readonly eventId: EventId;
  readonly contractVersion: ContractVersion;
  readonly aggregateId: string;
  readonly aggregateVersionId: VersionId;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly occurredAt: IsoTimestamp;
  readonly payload: Payload;
}

export interface IntegrationEvent<
  Type extends string = string,
  Payload = unknown,
> {
  readonly type: Type;
  readonly eventId: EventId;
  readonly contractVersion: ContractVersion;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly occurredAt: IsoTimestamp;
  readonly payload: Payload;
}
