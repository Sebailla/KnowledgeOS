import type {
  SearchResultDelta,
} from "./model.js";

export function calculateSearchResultDelta(
  input: {
    readonly subscriptionId: string;
    readonly fromSequence: number;
    readonly toSequence: number;
    readonly previous:
      readonly string[];
    readonly current:
      readonly string[];
  },
): SearchResultDelta {
  const before =
    new Set(input.previous);
  const after =
    new Set(input.current);

  return {
    subscriptionId:
      input.subscriptionId,
    fromSequence:
      input.fromSequence,
    toSequence:
      input.toSequence,
    added:
      [...after]
        .filter(
          (value) =>
            !before.has(value),
        )
        .sort(),
    removed:
      [...before]
        .filter(
          (value) =>
            !after.has(value),
        )
        .sort(),
    retained:
      [...after]
        .filter(
          (value) =>
            before.has(value),
        )
        .sort(),
  };
}
