import type { IsoTimestamp } from "@knowledgeos/domain-types";

export interface Clock {
  now(): Date;
  nowIso(): IsoTimestamp;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }

  nowIso(): IsoTimestamp {
    return this.now().toISOString() as IsoTimestamp;
  }
}

export class FixedClock implements Clock {
  public constructor(private readonly value: Date) {}

  now(): Date {
    return new Date(this.value);
  }

  nowIso(): IsoTimestamp {
    return this.value.toISOString() as IsoTimestamp;
  }
}
