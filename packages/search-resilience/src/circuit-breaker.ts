export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitBreakerOptions {
  readonly failureThreshold: number;
  readonly recoveryTimeoutMilliseconds: number;
}

export class SearchCircuitBreaker {
  private state: CircuitState = "closed";
  private failures = 0;
  private openedAt = 0;

  public constructor(
    private readonly options: CircuitBreakerOptions,
    private readonly now: () => number = Date.now,
  ) {}

  currentState(): CircuitState {
    if (
      this.state === "open" &&
      this.now() - this.openedAt >=
        this.options.recoveryTimeoutMilliseconds
    ) {
      this.state = "half-open";
    }

    return this.state;
  }

  async execute<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    if (this.currentState() === "open") {
      throw new Error("Search circuit is open");
    }

    try {
      const result = await operation();
      this.failures = 0;
      this.state = "closed";
      return result;
    } catch (error) {
      this.failures += 1;

      if (
        this.failures >=
        this.options.failureThreshold
      ) {
        this.state = "open";
        this.openedAt = this.now();
      }

      throw error;
    }
  }
}
