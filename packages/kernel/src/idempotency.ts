export interface IdempotencyStore {
  get<TResult>(key: string): Promise<TResult | undefined>;
  set<TResult>(
    key: string,
    result: TResult,
  ): Promise<void>;
}

export class InMemoryIdempotencyStore
implements IdempotencyStore {
  private readonly results = new Map<string, unknown>();

  public async get<TResult>(
    key: string,
  ): Promise<TResult | undefined> {
    return this.results.get(key) as TResult | undefined;
  }

  public async set<TResult>(
    key: string,
    result: TResult,
  ): Promise<void> {
    this.results.set(key, result);
  }
}

export class IdempotencyCoordinator {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  public async execute<TResult>(
    key: string,
    store: IdempotencyStore,
    operation: () => Promise<TResult>,
  ): Promise<TResult> {
    const existing = await store.get<TResult>(key);
    if (existing !== undefined) {
      return existing;
    }

    const current = this.inFlight.get(key);
    if (current) {
      return current as Promise<TResult>;
    }

    const pending = operation()
      .then(async (result) => {
        await store.set(key, result);
        return result;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, pending);

    return pending;
  }
}

const defaultCoordinator = new IdempotencyCoordinator();

export async function executeIdempotently<TResult>(
  key: string,
  store: IdempotencyStore,
  operation: () => Promise<TResult>,
): Promise<TResult> {
  return defaultCoordinator.execute(key, store, operation);
}
