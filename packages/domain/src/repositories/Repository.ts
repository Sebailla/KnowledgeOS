import type { AggregateRoot } from "../entities/AggregateRoot.js";
import type { EntityId } from "../identity/EntityId.js";

export interface Repository<
  TId extends EntityId,
  TAggregate extends AggregateRoot<TId>,
> {
  get(id: TId): Promise<TAggregate | undefined>;
  save(aggregate: TAggregate): Promise<void>;
  delete(id: TId): Promise<boolean>;
}
