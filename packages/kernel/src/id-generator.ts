export interface IdGenerator {
  next(): string;
}

export class MonotonicIdGenerator implements IdGenerator {
  private sequence = 0;

  public constructor(
    private readonly prefix = "id",
    private readonly now: () => number = Date.now,
  ) {}

  public next(): string {
    this.sequence += 1;

    return [
      this.prefix,
      this.now().toString(36),
      this.sequence.toString(36).padStart(4, "0"),
    ].join(":");
  }
}
