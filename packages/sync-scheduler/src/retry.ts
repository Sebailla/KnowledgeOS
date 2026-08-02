import type {
  RetryDecision,
  RetryPolicy,
} from "./model.js";

export class ExponentialBackoffPolicy {
  public decide(
    attempt: number,
    policy: RetryPolicy,
    randomUnit: number,
  ): RetryDecision {
    if (
      attempt >=
      policy.maximumAttempts
    ) {
      return {
        retry: false,
        delayMilliseconds: 0,
      };
    }

    const base =
      Math.min(
        policy.maximumDelayMilliseconds,
        Math.round(
          policy.initialDelayMilliseconds *
          Math.pow(
            policy.multiplier,
            Math.max(0, attempt - 1),
          ),
        ),
      );

    const jitter =
      Math.round(
        base *
        0.2 *
        Math.max(
          0,
          Math.min(1, randomUnit),
        ),
      );

    return {
      retry: true,
      delayMilliseconds:
        Math.min(
          policy.maximumDelayMilliseconds,
          base + jitter,
        ),
    };
  }
}
