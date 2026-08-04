import type { WorkspaceManager } from "./WorkspaceManager.js";
import { WorkspaceHistory } from "./model/WorkspaceHistory.js";
import type { WorkspaceLayout } from "./model/WorkspaceLayout.js";
import type { WorkspaceState } from "./model/WorkspaceState.js";

export class WorkspaceSession {
  private currentState: WorkspaceState | undefined;
  private readonly history = new WorkspaceHistory();

  public constructor(
    private readonly manager: WorkspaceManager,
  ) {}

  public get state(): WorkspaceState | undefined {
    return this.currentState;
  }

  public async open(
    id: string,
  ): Promise<WorkspaceState> {
    const state = await this.manager.get(id);

    if (!state) {
      throw new Error(
        `Workspace '${id}' does not exist.`,
      );
    }

    this.currentState = state;
    this.history.clear();

    return state;
  }

  public async updateLayout(
    layout: WorkspaceLayout,
  ): Promise<WorkspaceState> {
    const current = this.requireState();
    this.history.push(current);

    const next = await this.manager.update(
      current.id,
      { layout },
    );

    this.currentState = next;
    return next;
  }

  public async rename(
    name: string,
  ): Promise<WorkspaceState> {
    const current = this.requireState();
    this.history.push(current);

    const next = await this.manager.update(
      current.id,
      { name },
    );

    this.currentState = next;
    return next;
  }

  public async undo():
  Promise<WorkspaceState | undefined> {
    const current = this.requireState();
    const previous = this.history.undo(current);

    if (!previous) {
      return undefined;
    }

    const restored = await this.manager.update(
      current.id,
      {
        name: previous.name,
        layout: previous.layout,
        metadata: previous.metadata,
      },
    );

    this.currentState = restored;
    return restored;
  }

  public async redo():
  Promise<WorkspaceState | undefined> {
    const current = this.requireState();
    const next = this.history.redo(current);

    if (!next) {
      return undefined;
    }

    const restored = await this.manager.update(
      current.id,
      {
        name: next.name,
        layout: next.layout,
        metadata: next.metadata,
      },
    );

    this.currentState = restored;
    return restored;
  }

  private requireState(): WorkspaceState {
    if (!this.currentState) {
      throw new Error(
        "Workspace session is not open.",
      );
    }

    return this.currentState;
  }
}
