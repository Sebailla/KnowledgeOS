import type {
  SearchAuthorizationPolicy,
  UnifiedSearchEngine,
} from "./contracts.js";
import type {
  UnifiedSearchRequest,
} from "./model.js";

export class InMemoryUnifiedSearchEngine
implements UnifiedSearchEngine {
  public constructor(
    private readonly handler:
      (
        request: UnifiedSearchRequest,
      ) => Promise<any>,
  ) {}

  async search(
    request: UnifiedSearchRequest,
  ) {
    return this.handler(request);
  }

  async health() {
    return {
      lexical:
        "available" as const,
      semantic:
        "available" as const,
      graph:
        "available" as const,
      live:
        "available" as const,
    };
  }
}

export class ScopeSearchAuthorizationPolicy
implements SearchAuthorizationPolicy {
  async authorize(
    context: {
      readonly scopes:
        readonly string[];
    },
    action:
      | "search:read"
      | "search:saved:write"
      | "search:live:read",
  ): Promise<void> {
    if (
      !context.scopes.includes(
        action,
      )
    ) {
      throw new Error(
        `Missing scope: ${action}`,
      );
    }
  }
}
