import type { DomainEvent } from "@knowledgeos/domain";

export function createLibraryEvent(
  type: string,
  eventId: string,
  aggregateId: string,
  aggregateVersion: number,
  occurredAt: string,
  payload: Readonly<Record<string, unknown>>,
): DomainEvent {
  return {
    eventId,
    type,
    aggregateId,
    aggregateVersion,
    occurredAt,
    payload,
    metadata: {},
  };
}
