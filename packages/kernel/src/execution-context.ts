import type { Cancellation } from "./cancellation.js";
import { CancellationNone } from "./cancellation.js";

export interface ExecutionContext {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly actorId?: string;
  readonly tenantId?: string;
  readonly cancellation: Cancellation;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface CreateExecutionContextInput {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly actorId?: string;
  readonly tenantId?: string;
  readonly cancellation?: Cancellation;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export function createExecutionContext(
  input: CreateExecutionContextInput,
): ExecutionContext {
  return {
    correlationId: input.correlationId,
    ...(input.causationId !== undefined
      ? { causationId: input.causationId }
      : {}),
    ...(input.actorId !== undefined
      ? { actorId: input.actorId }
      : {}),
    ...(input.tenantId !== undefined
      ? { tenantId: input.tenantId }
      : {}),
    cancellation: input.cancellation ?? CancellationNone,
    metadata: input.metadata ?? {},
  };
}

export function childExecutionContext(
  parent: ExecutionContext,
  input: Omit<CreateExecutionContextInput, "correlationId"> & {
    readonly correlationId?: string;
  } = {},
): ExecutionContext {
  const next: CreateExecutionContextInput = {
    correlationId: input.correlationId ?? parent.correlationId,
    cancellation: input.cancellation ?? parent.cancellation,
    metadata: {
      ...parent.metadata,
      ...(input.metadata ?? {}),
    },
    ...(input.causationId !== undefined
      ? { causationId: input.causationId }
      : parent.causationId !== undefined
        ? { causationId: parent.causationId }
        : {}),
    ...(input.actorId !== undefined
      ? { actorId: input.actorId }
      : parent.actorId !== undefined
        ? { actorId: parent.actorId }
        : {}),
    ...(input.tenantId !== undefined
      ? { tenantId: input.tenantId }
      : parent.tenantId !== undefined
        ? { tenantId: parent.tenantId }
        : {}),
  };

  return createExecutionContext(next);
}
