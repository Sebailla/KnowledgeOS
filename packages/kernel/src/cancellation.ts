export interface Cancellation {
  readonly cancelled: boolean;
  readonly reason?: unknown;
  throwIfCancelled(): void;
  onCancel(listener: (reason?: unknown) => void): () => void;
}

export class CancellationSource {
  private isCancelled = false;
  private cancellationReason?: unknown;
  private readonly listeners = new Set<(reason?: unknown) => void>();
  readonly token: Cancellation;

  public constructor() {
    const source = this;
    this.token = {
      get cancelled(): boolean {
        return source.isCancelled;
      },
      get reason(): unknown {
        return source.cancellationReason;
      },
      throwIfCancelled(): void {
        if (!source.isCancelled) return;
        throw source.cancellationReason instanceof Error
          ? source.cancellationReason
          : new Error("Operation cancelled");
      },
      onCancel(listener: (reason?: unknown) => void): () => void {
        if (source.isCancelled) {
          listener(source.cancellationReason);
          return () => undefined;
        }
        source.listeners.add(listener);
        return () => {
          source.listeners.delete(listener);
        };
      },
    };
  }

  cancel(reason?: unknown): void {
    if (this.isCancelled) return;
    this.isCancelled = true;
    this.cancellationReason = reason;
    for (const listener of [...this.listeners]) {
      listener(reason);
    }
    this.listeners.clear();
  }

  static none(): Cancellation {
    return new CancellationSource().token;
  }
}
