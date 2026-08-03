export type AiContextSourceKind =
  | "search"
  | "knowledge-graph"
  | "personal-knowledge"
  | "conversation"
  | "manual";

export interface AiContextItem {
  readonly contextItemId: string;
  readonly sourceKind:
    AiContextSourceKind;
  readonly sourceId: string;
  readonly title: string;
  readonly content: string;
  readonly relevance: number;
  readonly confidence: number;
  readonly tokenEstimate: number;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface AiContextBundle {
  readonly items:
    readonly AiContextItem[];
  readonly totalTokenEstimate: number;
  readonly omittedItemIds:
    readonly string[];
}
