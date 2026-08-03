export interface Cancellation {
  readonly isCancellationRequested: boolean;
  readonly reason: unknown;
  throwIfCancellationRequested(): void;
  onCancellationRequested(listener: (reason: unknown) => void): () => void;
}

class CancellationToken implements Cancellation {
  private cancelled = false;
  private cancellationReason: unknown;
  private readonly listeners = new Set<(reason: unknown) => void>();

  public get isCancellationRequested(): boolean {
    return this.cancelled;
  }

  public get reason(): unknown {
    return this.cancellationReason;
  }

  public cancel(reason: unknown = new Error("Operation cancelled")): void {
    if (this.cancelled) {
      return;
    }

    this.cancelled = true;
    this.cancellationReason = reason;

    for (const listener of [...this.listeners]) {
      listener(reason);
    }

    this.listeners.clear();
  }

  public throwIfCancellationRequested(): void {
    if (!this.cancelled) {
      return;
    }

    if (this.cancellationReason instanceof Error) {
      throw this.cancellationReason;
    }

    throw new Error("Operation cancelled", {
      cause: this.cancellationReason,
    });
  }

  public onCancellationRequested(
    listener: (reason: unknown) => void,
  ): () => void {
    if (this.cancelled) {
      listener(this.cancellationReason);
      return () => undefined;
    }

    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export class CancellationSource {
  private readonly internalToken = new CancellationToken();

  public get token(): Cancellation {
    return this.internalToken;
  }

  public cancel(reason?: unknown): void {
    this.internalToken.cancel(reason);
  }
}

export const CancellationNone: Cancellation = {
  isCancellationRequested: false,
  reason: undefined,
  throwIfCancellationRequested(): void {},
  onCancellationRequested(): () => void {
    return () => undefined;
  },
};
