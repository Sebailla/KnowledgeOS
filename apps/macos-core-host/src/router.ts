import type { InMemoryCore } from "@knowledgeos/core";

export class HostError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class CoreRouter {
  public constructor(
    private readonly core: InMemoryCore,
  ) {}

  public async dispatch(
    method: string,
    params: unknown,
  ): Promise<unknown> {
    const record = asRecord(params);

    switch (method) {
      case "core.health":
        return {
          status: "ok",
          runtimeState:
            this.core.runtime.currentState,
          engines:
            this.core.runtime.listEngines()
              .map((engine) => ({
                id: engine.id,
                name: engine.name,
                version: engine.version,
              })),
        };

      case "library.list":
        return { items: [] };

      case "search.query":
        return this.core.search.search(
          stringParam(record, "query"),
        );

      case "workspace.list":
        return {
          workspaces:
            await this.core.workspace.manager.list(),
        };

      case "ai.generate":
        return this.core.ai.generate({
          messages: [{
            role: "user",
            content:
              stringParam(record, "prompt"),
          }],
        });

      default:
        throw new HostError(
          "METHOD_NOT_FOUND",
          `Unknown method '${method}'.`,
        );
    }
  }
}

function asRecord(
  value: unknown,
): Record<string, unknown> {
  if (value == null) return {};

  if (
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new HostError(
      "INVALID_PARAMS",
      "Params must be an object.",
    );
  }

  return value as Record<string, unknown>;
}

function stringParam(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = record[key];

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new HostError(
      "INVALID_PARAMS",
      `'${key}' must be a string.`,
    );
  }

  return value;
}
