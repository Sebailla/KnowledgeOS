import type { KnowledgeOSError } from "@knowledgeos/domain-types";

export function libraryNotFound(id: string): KnowledgeOSError {
  return {
    code: "library.local-library-not-found",
    category: "not-found",
    safeMessage: `Local Library was not found: ${id}`,
    retryable: false,
  };
}

export function publicationNotFound(id: string): KnowledgeOSError {
  return {
    code: "library.publication-not-found",
    category: "not-found",
    safeMessage: `Publication was not found: ${id}`,
    retryable: false,
  };
}
