import type { Brand } from "./brand.js";

export type PageCursor = Brand<string, "PageCursor">;

export interface PageRequest {
  readonly limit: number;
  readonly cursor?: PageCursor;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly nextCursor?: PageCursor;
  readonly totalEstimate?: number;
}

export function validatePageLimit(
  limit: number,
  maximum = 200,
): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > maximum) {
    throw new RangeError(`Page limit must be between 1 and ${maximum}`);
  }
}
