import type { DomainEvent } from "@knowledgeos/contracts";
import type { EventBus, ExecutionContext } from "@knowledgeos/kernel";
import type { CommittedEventPublisher } from "../ports/event-publisher.js";

export class EventBusCommittedPublisher implements CommittedEventPublisher {
  public constructor(private readonly bus: EventBus) {}
  async publish(events: readonly DomainEvent[], context: ExecutionContext): Promise<void> {
    await this.bus.publishMany(events, context);
  }
}

export class CollectingEventPublisher implements CommittedEventPublisher {
  readonly events: DomainEvent[] = [];
  async publish(events: readonly DomainEvent[]): Promise<void> {
    this.events.push(...events);
  }
}
