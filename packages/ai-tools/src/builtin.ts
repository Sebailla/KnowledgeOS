import type {
  AiTool,
} from "./model.js";

export class KnowledgeSearchAiTool
implements AiTool {
  public readonly requiredScope =
    "search:read";

  public readonly definition = {
    name:
      "knowledge_search",
    description:
      "Search the user's KnowledgeOS library.",
    inputSchema: {
      type:
        "object",
      properties: {
        query: {
          type:
            "string",
        },
      },
      required: [
        "query",
      ],
      additionalProperties:
        false,
    },
  } as const;

  public constructor(
    private readonly search:
      (
        ownerId: string,
        query: string,
      ) => Promise<unknown>,
  ) {}

  async execute(
    context: {
      readonly ownerId: string;
    },
    input:
      Readonly<Record<string, unknown>>,
  ) {
    const query =
      String(input.query ?? "")
        .trim();

    if (!query) {
      throw new Error(
        "query is required",
      );
    }

    return this.search(
      context.ownerId,
      query,
    );
  }
}
