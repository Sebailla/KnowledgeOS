export type SearchEngineStage = "lexical" | "semantic" | "graph";
export type SearchSessionState = "queued" | "running" | "completed" | "cancelled" | "failed";

export interface SearchExecutionRequest {
  readonly sessionId: string;
  readonly query: string;
  readonly limit: number;
  readonly priority: number;
  readonly budgets: Readonly<Record<SearchEngineStage, number>>;
}

export interface ProgressiveSearchBatch {
  readonly sessionId: string;
  readonly stage: SearchEngineStage;
  readonly results: readonly { readonly id: string; readonly score: number }[];
  readonly elapsedMilliseconds: number;
  readonly timedOut: boolean;
  readonly final: boolean;
}

export interface SearchTelemetryEvent {
  readonly sessionId: string;
  readonly event: "queued"|"started"|"stage-completed"|"stage-timeout"|"cancelled"|"completed"|"failed";
  readonly stage?: SearchEngineStage;
  readonly occurredAt: string;
  readonly durationMilliseconds?: number;
  readonly metadata?: Readonly<Record<string,string|number|boolean>>;
}
