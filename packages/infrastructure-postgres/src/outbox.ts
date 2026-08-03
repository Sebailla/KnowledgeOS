import type { DomainEvent, IntegrationEvent } from "@knowledgeos/contracts";
import type { IsoTimestamp } from "@knowledgeos/domain-types";
import { encodeJson } from "./json.js";
import type { SqlExecutor } from "./sql.js";

export type OutboxEvent = DomainEvent | IntegrationEvent;

export interface OutboxRecord {
  readonly eventId: string;
  readonly eventType: string;
  readonly payload: string;
  readonly occurredAt: IsoTimestamp;
  readonly publishedAt?: IsoTimestamp;
}

export class PostgresOutbox {
  public constructor(private readonly sql: SqlExecutor) {}

  async append(events: readonly OutboxEvent[]): Promise<void> {
    for (const event of events) {
      await this.sql.query(
        `
          insert into knowledgeos_outbox (
            event_id,
            event_type,
            payload,
            occurred_at
          ) values ($1, $2, $3::jsonb, $4)
          on conflict (event_id) do nothing
        `,
        [
          event.eventId,
          event.type,
          encodeJson(event),
          event.occurredAt,
        ],
      );
    }
  }

  async markPublished(
    eventId: string,
    publishedAt: IsoTimestamp,
  ): Promise<void> {
    await this.sql.query(
      `
        update knowledgeos_outbox
        set published_at = $2
        where event_id = $1
      `,
      [eventId, publishedAt],
    );
  }
}
