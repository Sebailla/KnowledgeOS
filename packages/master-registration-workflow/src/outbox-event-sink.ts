import type {
  IsoTimestamp,
} from "@knowledgeos/domain-types";
import type {
  SqlExecutor,
} from "@knowledgeos/infrastructure-postgres";

export interface OutboxClock {
  nowIso(): IsoTimestamp;
}

export interface OutboxIdGenerator {
  eventId(): string;
}

export class PostgresMasterRegistrationEventSink {
  public constructor(
    private readonly sql: SqlExecutor,
    private readonly clock: OutboxClock,
    private readonly ids: OutboxIdGenerator,
  ) {}

  async append(
    event: {
      readonly type: string;
      readonly payload: Readonly<Record<string, unknown>>;
    },
  ): Promise<void> {
    await this.sql.query(
      `
        insert into knowledgeos_outbox (
          event_id,
          event_type,
          payload,
          occurred_at
        ) values ($1, $2, $3::jsonb, $4)
      `,
      [
        this.ids.eventId(),
        event.type,
        JSON.stringify(event.payload),
        this.clock.nowIso(),
      ],
    );
  }
}
