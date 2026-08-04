import { EntityId } from "@knowledgeos/domain";
export class LibraryId extends EntityId {
  public static create(value: string): LibraryId {
    return new LibraryId(value);
  }
}
