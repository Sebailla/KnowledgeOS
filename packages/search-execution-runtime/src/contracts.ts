import type { ProgressiveSearchBatch, SearchEngineStage, SearchExecutionRequest, SearchTelemetryEvent } from "./model.js";

export interface SearchCancellationSignal { readonly cancelled: boolean; throwIfCancelled(): void; }
export interface SearchExecutionEngine { readonly stage: SearchEngineStage; execute(request: SearchExecutionRequest, signal: SearchCancellationSignal): Promise<readonly { readonly id:string; readonly score:number }[]>; }
export interface SearchTelemetrySink { append(event: SearchTelemetryEvent): Promise<void>; }
export interface SearchRuntimeClock { nowIso(): string; nowMilliseconds(): number; }
export interface ProgressiveSearchConsumer { publish(batch: ProgressiveSearchBatch): Promise<void>; }
