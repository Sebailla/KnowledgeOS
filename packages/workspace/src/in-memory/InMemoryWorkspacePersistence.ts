import type { WorkspacePersistence } from "../contracts/WorkspacePersistence.js";
import type { WorkspaceState } from "../model/WorkspaceState.js";

export class InMemoryWorkspacePersistence
implements WorkspacePersistence {
  private readonly states =
    new Map<string, WorkspaceState>();

  public async get(
    id: string,
  ): Promise<WorkspaceState | undefined> {
    return this.states.get(id);
  }

  public async save(
    state: WorkspaceState,
  ): Promise<void> {
    this.states.set(state.id, state);
  }

  public async delete(
    id: string,
  ): Promise<boolean> {
    return this.states.delete(id);
  }

  public async list():
  Promise<readonly WorkspaceState[]> {
    return [...this.states.values()]
      .sort((left, right) =>
        left.name.localeCompare(right.name),
      );
  }
}
