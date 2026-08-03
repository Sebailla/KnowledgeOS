import type {
  DomainEvent,
  IntegrationEvent,
} from "@knowledgeos/contracts";
import type { ExecutionContext } from "./execution-context.js";

export type Event = DomainEvent | IntegrationEvent;

export interface EventHandler<TEvent extends Event = Event> {
  handle(
    event: TEvent,
    context: ExecutionContext,
  ): Promise<void>;
}

export interface EventBus {
  publish(
    event: Event,
    context: ExecutionContext,
  ): Promise<void>;
  publishMany(
    events: readonly Event[],
    context: ExecutionContext,
  ): Promise<void>;
}

export class InMemoryEventBus implements EventBus {
  private readonly handlers =
    new Map<string, EventHandler[]>();

  subscribe<TEvent extends Event>(
    type: TEvent["type"],
    handler: EventHandler<TEvent>,
  ): () => void {
    const current = this.handlers.get(type) ?? [];
    current.push(handler as EventHandler);
    this.handlers.set(type, current);

    return () => {
      const handlers = this.handlers.get(type);
      if (!handlers) return;
      const index = handlers.indexOf(handler as EventHandler);
      if (index >= 0) handlers.splice(index, 1);
    };
  }

  async publish(
    event: Event,
    context: ExecutionContext,
  ): Promise<void> {
    context.cancellation.throwIfCancelled();
    const handlers = [...(this.handlers.get(event.type) ?? [])];
    await Promise.all(
      handlers.map((handler) => handler.handle(event, context)),
    );
  }

  async publishMany(
    events: readonly Event[],
    context: ExecutionContext,
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event, context);
    }
  }
}
