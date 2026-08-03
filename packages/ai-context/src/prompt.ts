import type {
  AiContextBundle,
} from "./model.js";

export function renderContextPrompt(
  bundle: AiContextBundle,
): string {
  return bundle.items
    .map(
      (item, index) =>
        [
          `[Context ${index + 1}]`,
          `Source: ${item.sourceKind}:${item.sourceId}`,
          `Title: ${item.title}`,
          item.content,
        ].join("\n"),
    )
    .join("\n\n");
}
