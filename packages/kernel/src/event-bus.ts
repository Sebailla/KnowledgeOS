import type { ExecutionContext } from "./execution-context.js";

export interface DomainEvent {
  readonly type: string;
  readonly occurredAt: string;
}

export interface EventHandler<TEvent extends DomainEvent> {
  handle(
    event: TEvent,
    context: ExecutionContext,
  ): Promise<void>;
}

export interface PublishOptions {
  readonly failFast?: boolean;
}

export interface PublishResult {
  readonly handledBy: number;
  readonly errors: readonly unknown[];
}

export class EventBus {
  private readonly handlers =
    new Map<string, Set<EventHandler<DomainEvent>>>();

  public subscribe<TEvent extends DomainEvent>(
    type: TEvent["type"],
    handler: EventHandler<TEvent>,
  ): () => void {
    const current =
      this.handlers.get(type) ??
      new Set<EventHandler<DomainEvent>>();

    current.add(
      handler as EventHandler<DomainEvent>,
    );
    this.handlers.set(type, current);

    return () => {
      current.delete(
        handler as EventHandler<DomainEvent>,
      );

      if (current.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  public async publish<TEvent extends DomainEvent>(
    event: TEvent,
    context: ExecutionContext,
    options: PublishOptions = {},
  ): Promise<PublishResult> {
    context.cancellation.throwIfCancellationRequested();

    const matching = [
      ...(this.handlers.get(event.type) ?? []),
    ];

    const errors: unknown[] = [];

    for (const handler of matching) {
      try {
        await handler.handle(event, context);
      } catch (error) {
        if (options.failFast) {
          throw error;
        }

        errors.push(error);
      }
    }

    return {
      handledBy: matching.length,
      errors,
    };
  }
}
