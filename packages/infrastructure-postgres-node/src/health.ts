import type {
  SqlDatabase,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";

export interface PostgresHealthResult {
  readonly state: "healthy" | "unhealthy";
  readonly latencyMilliseconds: number;
  readonly serverTime?: string;
  readonly error?: string;
}

export class PostgresHealthCheck {
  public constructor(
    private readonly database: SqlDatabase,
    private readonly now: () => number = () => Date.now(),
  ) {}

  async execute(): Promise<PostgresHealthResult> {
    const started = this.now();

    try {
      const result = await this.database.query<
        SqlRow & { readonly server_time: string }
      >(
        "select now()::text as server_time",
      );

      const row = result.rows[0];

      return {
        state: "healthy",
        latencyMilliseconds: this.now() - started,
        ...(row?.server_time === undefined
          ? {}
          : { serverTime: row.server_time }),
      };
    } catch (error) {
      return {
        state: "unhealthy",
        latencyMilliseconds: this.now() - started,
        error:
          error instanceof Error
            ? error.message
            : "Unknown PostgreSQL error",
      };
    }
  }
}
