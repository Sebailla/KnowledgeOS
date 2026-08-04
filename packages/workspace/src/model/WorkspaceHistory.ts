import type { WorkspaceState } from "./WorkspaceState.js";

export class WorkspaceHistory {
  private readonly past: WorkspaceState[] = [];
  private readonly future: WorkspaceState[] = [];

  public push(state: WorkspaceState): void {
    this.past.push(state);
    this.future.length = 0;
  }

  public undo(
    current: WorkspaceState,
  ): WorkspaceState | undefined {
    const previous = this.past.pop();

    if (!previous) {
      return undefined;
    }

    this.future.push(current);
    return previous;
  }

  public redo(
    current: WorkspaceState,
  ): WorkspaceState | undefined {
    const next = this.future.pop();

    if (!next) {
      return undefined;
    }

    this.past.push(current);
    return next;
  }

  public clear(): void {
    this.past.length = 0;
    this.future.length = 0;
  }
}
