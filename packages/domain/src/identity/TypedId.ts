import { EntityId } from "./EntityId.js";

export class TypedId<TBrand extends string> extends EntityId {
  public static create<TBrand extends string>(
    value: string,
  ): TypedId<TBrand> {
    return new TypedId<TBrand>(value);
  }
}
