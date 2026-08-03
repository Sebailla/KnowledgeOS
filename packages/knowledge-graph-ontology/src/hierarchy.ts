import type {
  OntologyNodeType,
} from "./model.js";

export class OntologyHierarchy {
  public constructor(
    private readonly types:
      readonly OntologyNodeType[],
  ) {}

  ancestors(
    typeId: string,
  ): readonly string[] {
    const byId =
      new Map(
        this.types.map(
          (type) => [
            type.typeId,
            type,
          ],
        ),
      );

    const result:
      string[] = [];
    const visited =
      new Set<string>();
    const queue = [
      typeId,
    ];

    while (queue.length > 0) {
      const current =
        queue.shift()!;
      const type =
        byId.get(current);

      if (!type) continue;

      for (const parent of type.parentTypeIds) {
        if (visited.has(parent)) {
          continue;
        }

        visited.add(parent);
        result.push(parent);
        queue.push(parent);
      }
    }

    return result;
  }

  descendants(
    typeId: string,
  ): readonly string[] {
    const result:
      string[] = [];
    const visited =
      new Set<string>();
    const queue = [
      typeId,
    ];

    while (queue.length > 0) {
      const current =
        queue.shift()!;

      for (const type of this.types) {
        if (
          type.parentTypeIds.includes(
            current,
          ) &&
          !visited.has(type.typeId)
        ) {
          visited.add(type.typeId);
          result.push(type.typeId);
          queue.push(type.typeId);
        }
      }
    }

    return result;
  }

  isAssignable(
    candidateTypeId: string,
    expectedTypeId: string,
  ): boolean {
    return (
      candidateTypeId ===
        expectedTypeId ||
      this.ancestors(
        candidateTypeId,
      ).includes(
        expectedTypeId,
      )
    );
  }

  detectCycles(): readonly string[] {
    const byId =
      new Map(
        this.types.map(
          (type) => [
            type.typeId,
            type,
          ],
        ),
      );

    const visiting =
      new Set<string>();
    const visited =
      new Set<string>();
    const cycles:
      string[] = [];

    const visit = (
      typeId: string,
      path: readonly string[],
    ): void => {
      if (visiting.has(typeId)) {
        cycles.push(
          [...path, typeId].join(" -> "),
        );
        return;
      }

      if (visited.has(typeId)) {
        return;
      }

      visiting.add(typeId);
      const type =
        byId.get(typeId);

      for (
        const parent of
        type?.parentTypeIds ?? []
      ) {
        visit(
          parent,
          [...path, typeId],
        );
      }

      visiting.delete(typeId);
      visited.add(typeId);
    };

    for (const type of this.types) {
      visit(type.typeId, []);
    }

    return cycles.sort();
  }
}
