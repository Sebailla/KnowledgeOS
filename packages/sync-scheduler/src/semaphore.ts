export class AsyncSemaphore {
  private active = 0;
  private readonly queue:
    Array<() => void> = [];

  public constructor(
    private readonly limit: number,
  ) {
    if (
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      throw new Error(
        "Semaphore limit must be positive",
      );
    }
  }

  async acquire(): Promise<
    () => void
  > {
    if (
      this.active < this.limit
    ) {
      this.active += 1;
      return () =>
        this.release();
    }

    await new Promise<void>(
      (resolve) => {
        this.queue.push(resolve);
      },
    );

    this.active += 1;
    return () =>
      this.release();
  }

  private release(): void {
    this.active -= 1;
    const next =
      this.queue.shift();
    if (next) {
      next();
    }
  }
}
