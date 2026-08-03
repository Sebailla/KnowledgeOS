import type { DurationMilliseconds } from "@knowledgeos/domain-types";
import type { Cancellation } from "./cancellation.js";

export interface Sleeper {
  sleep(
    duration: DurationMilliseconds,
    cancellation: Cancellation,
  ): Promise<void>;
}

export class ImmediateSleeper implements Sleeper {
  async sleep(
    _duration: DurationMilliseconds,
    cancellation: Cancellation,
  ): Promise<void> {
    cancellation.throwIfCancelled();
  }
}

export interface RetryPolicy {
  readonly maximumAttempts: number;
  delayForAttempt(attempt: number): DurationMilliseconds;
  shouldRetry(error: unknown, attempt: number): boolean;
}

export class ExponentialRetryPolicy implements RetryPolicy {
  public constructor(
    public readonly maximumAttempts = 3,
    private readonly initialDelayMs = 100,
    private readonly maximumDelayMs = 5_000,
  ) {}

  delayForAttempt(attempt: number): DurationMilliseconds {
    const value = Math.min(
      this.initialDelayMs * 2 ** Math.max(0, attempt - 1),
      this.maximumDelayMs,
    );
    return value as DurationMilliseconds;
  }

  shouldRetry(_error: unknown, attempt: number): boolean {
    return attempt < this.maximumAttempts;
  }
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  policy: RetryPolicy,
  cancellation: Cancellation,
  sleeper: Sleeper = new ImmediateSleeper(),
): Promise<T> {
  let attempt = 1;

  for (;;) {
    cancellation.throwIfCancelled();
    try {
      return await operation();
    } catch (error) {
      if (!policy.shouldRetry(error, attempt)) throw error;
      await sleeper.sleep(
        policy.delayForAttempt(attempt),
        cancellation,
      );
      attempt += 1;
    }
  }
}
