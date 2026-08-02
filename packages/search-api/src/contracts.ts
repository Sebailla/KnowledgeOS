import type {
  UnifiedSearchHealth,
  UnifiedSearchRequest,
  UnifiedSearchResponse,
} from "./model.js";

export interface UnifiedSearchEngine {
  search(
    request: UnifiedSearchRequest,
  ): Promise<UnifiedSearchResponse>;

  health(): Promise<UnifiedSearchHealth>;
}

export interface SearchAuthorizationContext {
  readonly ownerId: string;
  readonly subjectId: string;
  readonly scopes: readonly string[];
}

export interface SearchAuthorizationPolicy {
  authorize(
    context: SearchAuthorizationContext,
    action:
      | "search:read"
      | "search:saved:write"
      | "search:live:read",
  ): Promise<void>;
}
