import { DomainInvariantError, Entity } from "@knowledgeos/domain";
import type { WorkspaceId } from "../identity/WorkspaceId.js";

export interface WorkspaceLayout {
  readonly panels: readonly string[];
  readonly activeDocumentId?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export class Workspace extends Entity<WorkspaceId> {
  private currentName: string;
  private currentLayout: WorkspaceLayout;

  public constructor(
    id: WorkspaceId,
    name: string,
    layout: WorkspaceLayout = { panels: [], metadata: {} },
  ) {
    super(id);
    this.currentName = Workspace.validateName(name);
    this.currentLayout = layout;
  }

  public get name(): string { return this.currentName; }
  public get layout(): WorkspaceLayout { return this.currentLayout; }

  public rename(name: string): void {
    this.currentName = Workspace.validateName(name);
  }

  public updateLayout(layout: WorkspaceLayout): void {
    this.currentLayout = layout;
  }

  private static validateName(name: string): string {
    const normalized = name.trim();
    if (normalized.length === 0) {
      throw new DomainInvariantError("Workspace name cannot be empty.");
    }
    return normalized;
  }
}
