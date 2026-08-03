import type { DomainEvent } from "../events/DomainEvent.js";
import { DomainInvariantError } from "../errors/DomainInvariantError.js";
import type { EntityId } from "../identity/EntityId.js";
import { Entity } from "./Entity.js";

export abstract class AggregateRoot<
  TId extends EntityId,
> extends Entity<TId> {
  private readonly pendingEvents: DomainEvent[] = [];
  private currentVersion: number;

  protected constructor(
    id: TId,
    version = 0,
  ) {
    super(id);

    if (!Number.isInteger(version) || version < 0) {
      throw new DomainInvariantError(
        "Aggregate version must be a non-negative integer.",
      );
    }

    this.currentVersion = version;
  }

  public get version(): number {
    return this.currentVersion;
  }

  public get uncommittedEvents(): readonly DomainEvent[] {
    return [...this.pendingEvents];
  }

  public clearUncommittedEvents(): void {
    this.pendingEvents.length = 0;
  }

  protected record(event: DomainEvent): void {
    if (event.aggregateId !== this.id.value) {
      throw new DomainInvariantError(
        "Event aggregate id does not match aggregate root.",
      );
    }

    if (event.aggregateVersion !== this.currentVersion + 1) {
      throw new DomainInvariantError(
        "Event version must advance aggregate version by one.",
      );
    }

    this.currentVersion = event.aggregateVersion;
    this.pendingEvents.push(event);
  }
}
