import type {
  OntologyNodeType,
  OntologyPropertyDefinition,
} from "./model.js";
import {
  OntologyHierarchy,
} from "./hierarchy.js";

export class OntologyInheritanceResolver {
  private readonly hierarchy;
  private readonly byId;

  public constructor(
    private readonly types:
      readonly OntologyNodeType[],
  ) {
    this.hierarchy =
      new OntologyHierarchy(types);
    this.byId =
      new Map(
        types.map(
          (type) => [
            type.typeId,
            type,
          ],
        ),
      );
  }

  effectiveProperties(
    typeId: string,
  ): readonly OntologyPropertyDefinition[] {
    const order = [
      ...[
        ...this.hierarchy.ancestors(
          typeId,
        ),
      ].reverse(),
      typeId,
    ];

    const properties =
      new Map<
        string,
        OntologyPropertyDefinition
      >();

    for (const current of order) {
      const type =
        this.byId.get(current);
      if (!type) continue;

      for (const property of type.properties) {
        if (
          current !== typeId &&
          !property.inherited
        ) {
          continue;
        }

        properties.set(
          property.propertyId,
          property,
        );
      }
    }

    return [
      ...properties.values(),
    ].sort(
      (a, b) =>
        a.propertyId.localeCompare(
          b.propertyId,
        ),
    );
  }
}
