export interface Transaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface UnitOfWork {
  begin(): Promise<Transaction>;
  run<T>(work: () => Promise<T>): Promise<T>;
}

export class PassthroughUnitOfWork implements UnitOfWork {
  async begin(): Promise<Transaction> {
    return {
      async commit(): Promise<void> {
        return;
      },
      async rollback(): Promise<void> {
        return;
      },
    };
  }

  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}
