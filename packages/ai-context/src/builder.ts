import type {
  AiContextBundle,
  AiContextItem,
} from "./model.js";

export class AiContextBuilder {
  build(
    items: readonly AiContextItem[],
    maximumTokens: number,
  ): AiContextBundle {
    if (
      !Number.isInteger(maximumTokens) ||
      maximumTokens < 1
    ) {
      throw new Error(
        "maximumTokens must be positive",
      );
    }

    const ordered =
      [...items].sort(
        (a, b) =>
          (
            b.relevance *
            b.confidence
          ) -
          (
            a.relevance *
            a.confidence
          ) ||
          a.contextItemId.localeCompare(
            b.contextItemId,
          ),
      );

    const selected:
      AiContextItem[] = [];
    const omitted:
      string[] = [];
    let total = 0;

    for (const item of ordered) {
      if (
        total +
          item.tokenEstimate <=
        maximumTokens
      ) {
        selected.push(item);
        total += item.tokenEstimate;
      } else {
        omitted.push(
          item.contextItemId,
        );
      }
    }

    return {
      items:
        selected,
      totalTokenEstimate:
        total,
      omittedItemIds:
        omitted.sort(),
    };
  }
}
