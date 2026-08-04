import type { WorkspacePersistence } from "./contracts/WorkspacePersistence.js";
import { WorkspaceError } from "./errors/WorkspaceError.js";
import type { WorkspaceLayout } from "./model/WorkspaceLayout.js";
import type { WorkspaceState } from "./model/WorkspaceState.js";

export interface WorkspaceManagerDependencies {
  readonly persistence: WorkspacePersistence;
  readonly now: () => string;
}

export class WorkspaceManager {
  public constructor(
    private readonly dependencies:
      WorkspaceManagerDependencies,
  ) {}

  public async create(
    id: string,
    name: string,
    layout: WorkspaceLayout,
  ): Promise<WorkspaceState> {
    if (await this.dependencies.persistence.get(id)) {
      throw new WorkspaceError(
        `Workspace '${id}' already exists.`,
        "WORKSPACE_ALREADY_EXISTS",
      );
    }

    const timestamp = this.dependencies.now();

    const state: WorkspaceState = {
      id,
      name: validateName(name),
      layout,
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: {},
    };

    await this.dependencies.persistence.save(state);

    return state;
  }

  public async update(
    id: string,
    input: {
      readonly name?: string;
      readonly layout?: WorkspaceLayout;
      readonly metadata?: Readonly<Record<string, unknown>>;
    },
  ): Promise<WorkspaceState> {
    const existing = await this.require(id);

    const next: WorkspaceState = {
      ...existing,
      ...(input.name !== undefined
        ? { name: validateName(input.name) }
        : {}),
      ...(input.layout !== undefined
        ? { layout: input.layout }
        : {}),
      ...(input.metadata !== undefined
        ? { metadata: input.metadata }
        : {}),
      updatedAt: this.dependencies.now(),
    };

    await this.dependencies.persistence.save(next);

    return next;
  }

  public async get(
    id: string,
  ): Promise<WorkspaceState | undefined> {
    return this.dependencies.persistence.get(id);
  }

  public async list():
  Promise<readonly WorkspaceState[]> {
    return this.dependencies.persistence.list();
  }

  public async delete(
    id: string,
  ): Promise<boolean> {
    return this.dependencies.persistence.delete(id);
  }

  private async require(
    id: string,
  ): Promise<WorkspaceState> {
    const state = await this.dependencies.persistence.get(id);

    if (!state) {
      throw new WorkspaceError(
        `Workspace '${id}' does not exist.`,
        "WORKSPACE_NOT_FOUND",
      );
    }

    return state;
  }
}

function validateName(name: string): string {
  const normalized = name.trim();

  if (normalized.length === 0) {
    throw new WorkspaceError(
      "Workspace name cannot be empty.",
      "WORKSPACE_NAME_INVALID",
    );
  }

  return normalized;
}
