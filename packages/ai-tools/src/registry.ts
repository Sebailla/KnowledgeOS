import type {
  AiTool,
  AiToolExecutionContext,
} from "./model.js";

export class AiToolRegistry {
  private readonly tools =
    new Map<string, AiTool>();

  register(tool: AiTool): void {
    if (
      this.tools.has(
        tool.definition.name,
      )
    ) {
      throw new Error(
        `AI tool already registered: ${tool.definition.name}`,
      );
    }

    this.tools.set(
      tool.definition.name,
      tool,
    );
  }

  definitions() {
    return [...this.tools.values()]
      .map((tool) => tool.definition)
      .sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
          ),
      );
  }

  async execute(
    context:
      AiToolExecutionContext,
    toolName: string,
    input:
      Readonly<Record<string, unknown>>,
  ): Promise<unknown> {
    const tool =
      this.tools.get(toolName);

    if (!tool) {
      throw new Error(
        `AI tool not found: ${toolName}`,
      );
    }

    if (
      !context.scopes.includes(
        tool.requiredScope,
      )
    ) {
      throw new Error(
        `Missing tool scope: ${tool.requiredScope}`,
      );
    }

    return tool.execute(
      context,
      input,
    );
  }
}
