import type { KnowledgeOSError } from "@knowledgeos/domain-types";
import type { HttpResponse } from "./http.js";

export function toHttpError(
  error: KnowledgeOSError | Error,
): HttpResponse {
  if ("category" in error && "code" in error) {
    const status = {
      validation: 400,
      authentication: 401,
      authorization: 403,
      "not-found": 404,
      conflict: 409,
      compatibility: 409,
      policy: 403,
      "rate-limit": 429,
      "transient-infrastructure": 503,
      "permanent-infrastructure": 500,
      integrity: 422,
      capacity: 507,
      cancelled: 499,
      timeout: 504,
      unknown: 500,
    }[error.category];

    return {
      status,
      body: {
        error: {
          code: error.code,
          message: error.safeMessage,
          retryable: error.retryable,
        },
      },
    };
  }

  return {
    status: 500,
    body: {
      error: {
        code: "server.unexpected-error",
        message: "Unexpected server error",
      },
    },
  };
}
