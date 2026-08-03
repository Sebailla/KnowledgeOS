import { EntityId } from "@knowledgeos/domain";
export class CollectionId extends EntityId {
  public static create(value: string): CollectionId {
    return new CollectionId(value);
  }
}
