import type {
  SearchAuthorizationContext,
  SearchAuthorizationPolicy,
  UnifiedSearchEngine,
} from "./contracts.js";
import type {
  UnifiedSearchRequest,
} from "./model.js";

export class UnifiedSearchService {
  public constructor(
    private readonly engine:
      UnifiedSearchEngine,
    private readonly authorization:
      SearchAuthorizationPolicy,
  ) {}

  async execute(
    context:
      SearchAuthorizationContext,
    request:
      UnifiedSearchRequest,
  ) {
    await this.authorization.authorize(
      context,
      "search:read",
    );

    if (!request.query.trim()) {
      throw new Error(
        "Search query is required",
      );
    }

    if (
      !Number.isInteger(
        request.limit,
      ) ||
      request.limit < 1 ||
      request.limit > 200
    ) {
      throw new Error(
        "limit must be between 1 and 200",
      );
    }

    if (
      !Number.isInteger(
        request.offset,
      ) ||
      request.offset < 0
    ) {
      throw new Error(
        "offset must be a non-negative integer",
      );
    }

    return this.engine.search(
      request,
    );
  }

  async health(
    context:
      SearchAuthorizationContext,
  ) {
    await this.authorization.authorize(
      context,
      "search:read",
    );

    return this.engine.health();
  }
}
