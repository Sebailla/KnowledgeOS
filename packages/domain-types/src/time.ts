import type { Brand } from "./brand.js";

export type IsoTimestamp = Brand<string, "IsoTimestamp">;
export type DurationMilliseconds = Brand<number, "DurationMilliseconds">;

const ISO_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;

export function isIsoTimestamp(value: string): value is IsoTimestamp {
  return ISO_PATTERN.test(value);
}

export function toIsoTimestamp(date: Date): IsoTimestamp {
  return date.toISOString() as IsoTimestamp;
}
