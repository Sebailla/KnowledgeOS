import type {
  UnifiedSearchRequest,
  UnifiedSearchResponse,
} from "@knowledgeos/search-api";

export interface McpToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema:
    Readonly<Record<string, unknown>>;
}

export const knowledgeOsSearchMcpTool:
  McpToolDefinition = {
  name:
    "knowledgeos_search",
  description:
    "Search the user's KnowledgeOS library using lexical, semantic, hybrid or graph retrieval.",
  inputSchema: {
    type:
      "object",
    properties: {
      query: {
        type:
          "string",
      },
      mode: {
        type:
          "string",
        enum: [
          "lexical",
          "semantic",
          "hybrid",
          "graph",
        ],
      },
      rankingProfile: {
        type:
          "string",
        enum: [
          "balanced",
          "precision",
          "recency",
          "personal",
        ],
      },
      limit: {
        type:
          "integer",
        minimum:
          1,
        maximum:
          200,
      },
      includeExplanation: {
        type:
          "boolean",
      },
    },
    required: [
      "query",
    ],
    additionalProperties:
      false,
  },
};

export class KnowledgeOsSearchMcpHandler {
  public constructor(
    private readonly executeSearch:
      (
        request:
          UnifiedSearchRequest,
      ) => Promise<
        UnifiedSearchResponse
      >,
  ) {}

  async invoke(
    input:
      Readonly<Record<string, unknown>>,
  ): Promise<
    UnifiedSearchResponse
  > {
    const query =
      String(
        input.query ?? "",
      ).trim();

    if (!query) {
      throw new Error(
        "query is required",
      );
    }

    return this.executeSearch({
      query,
      mode:
        (
          input.mode as
            UnifiedSearchRequest["mode"]
        ) ?? "hybrid",
      rankingProfile:
        (
          input.rankingProfile as
            UnifiedSearchRequest["rankingProfile"]
        ) ?? "balanced",
      limit:
        Number(input.limit ?? 20),
      offset:
        0,
      includeFacets:
        false,
      includeExplanation:
        Boolean(
          input.includeExplanation,
        ),
    });
  }
}
