import { EntityId } from "@knowledgeos/domain";
export class WorkspaceId extends EntityId {
  public static create(value: string): WorkspaceId {
    return new WorkspaceId(value);
  }
}
