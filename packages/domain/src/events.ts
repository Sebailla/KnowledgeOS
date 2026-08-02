import type { DomainEvent } from "@knowledgeos/contracts";
import type { ContractVersion, CorrelationId, EventId, IsoTimestamp, VersionId } from "@knowledgeos/domain-types";
export interface EventFactoryDeps{eventId():EventId; now():IsoTimestamp; contractVersion:ContractVersion;}
export class DomainEventFactory{constructor(private readonly deps:EventFactoryDeps){} create<T>(type:string,aggregateId:string,aggregateVersionId:VersionId,correlationId:CorrelationId,payload:T):DomainEvent<string,T>{return {type,eventId:this.deps.eventId(),contractVersion:this.deps.contractVersion,aggregateId,aggregateVersionId,correlationId,occurredAt:this.deps.now(),payload};}}
