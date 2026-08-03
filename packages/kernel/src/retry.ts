import type { Cancellation } from "./cancellation.js";

export interface DelayScheduler {
  delay(
    milliseconds: number,
    cancellation: Cancellation,
  ): Promise<void>;
}

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly delayMilliseconds: (
    attempt: number,
    error: unknown,
  ) => number;
  readonly shouldRetry?: (
    error: unknown,
    attempt: number,
  ) => boolean;
  readonly scheduler?: DelayScheduler;
}

export async function retry<T>(
  operation: (attempt: number) => Promise<T>,
  policy: RetryPolicy,
  cancellation: Cancellation,
): Promise<T> {
  if (!Number.isInteger(policy.maxAttempts) || policy.maxAttempts < 1) {
    throw new RangeError("maxAttempts must be a positive integer.");
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    cancellation.throwIfCancellationRequested();

    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;

      if (
        attempt >= policy.maxAttempts ||
        policy.shouldRetry?.(error, attempt) === false
      ) {
        throw error;
      }

      const delay = policy.delayMilliseconds(attempt, error);
      if (delay > 0) {
        const scheduler = policy.scheduler;
        if (!scheduler) {
          throw new Error(
            "Retry delay requires an explicit DelayScheduler.",
          );
        }

        await scheduler.delay(delay, cancellation);
      }
    }
  }

  throw lastError;
}
