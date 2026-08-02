export type HealthState = "healthy" | "degraded" | "unhealthy";

export interface HealthCheckResult {
  readonly name: string;
  readonly state: HealthState;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface HealthCheck {
  readonly name: string;
  execute(): Promise<HealthCheckResult>;
}

export class HealthService {
  public constructor(
    private readonly checks: readonly HealthCheck[],
  ) {}

  async check(): Promise<{
    readonly state: HealthState;
    readonly checks: readonly HealthCheckResult[];
  }> {
    const results = await Promise.all(
      this.checks.map((check) => check.execute()),
    );

    const state: HealthState = results.some(
      (result) => result.state === "unhealthy",
    )
      ? "unhealthy"
      : results.some((result) => result.state === "degraded")
        ? "degraded"
        : "healthy";

    return { state, checks: results };
  }
}
