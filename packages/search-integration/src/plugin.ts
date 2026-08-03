import type {
  UnifiedSearchRequest,
  UnifiedSearchResponse,
} from "@knowledgeos/search-api";

export interface SearchPluginCapability {
  readonly capabilityId:
    "knowledgeos.search";
  readonly version:
    "1.0";
  readonly modes:
    readonly (
      | "lexical"
      | "semantic"
      | "hybrid"
      | "graph"
    )[];

  execute(
    request:
      UnifiedSearchRequest,
  ): Promise<
    UnifiedSearchResponse
  >;
}

export class DefaultSearchPluginCapability
implements SearchPluginCapability {
  public readonly capabilityId =
    "knowledgeos.search" as const;
  public readonly version =
    "1.0" as const;
  public readonly modes = [
    "lexical",
    "semantic",
    "hybrid",
    "graph",
  ] as const;

  public constructor(
    private readonly executeSearch:
      (
        request:
          UnifiedSearchRequest,
      ) => Promise<
        UnifiedSearchResponse
      >,
  ) {}

  async execute(
    request:
      UnifiedSearchRequest,
  ) {
    return this.executeSearch(
      request,
    );
  }
}
