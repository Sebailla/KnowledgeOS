import type {
  CorrelationId,
  OperationId,
  PrivacyClass,
} from "@knowledgeos/domain-types";
import {
  CancellationSource,
  SystemClock,
  MonotonicIdGenerator,
  type ExecutionContext,
} from "@knowledgeos/kernel";
import type { HttpRequest } from "./http.js";

const clock = new SystemClock();
const ids = new MonotonicIdGenerator(clock, "server");

export function createExecutionContext(
  request: HttpRequest,
  privacyClass: PrivacyClass = "publication",
): ExecutionContext {
  const correlationHeader = request.headers["x-correlation-id"];

  return {
    operationId: ids.operationId() as OperationId,
    correlationId: (
      correlationHeader
        ? correlationHeader
        : ids.correlationId()
    ) as CorrelationId,
    privacyClass,
    clock,
    cancellation: CancellationSource.none(),
    metadata: Object.freeze({
      method: request.method,
      path: request.path,
    }),
  };
}
