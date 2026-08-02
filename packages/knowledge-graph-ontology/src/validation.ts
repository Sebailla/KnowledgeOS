import type {
  OntologyNodeType,
  OntologyRelationshipType,
  OntologyTaxonomyTerm,
} from "./model.js";
import {
  OntologyHierarchy,
} from "./hierarchy.js";

export interface OntologyValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly subjectId: string;
}

export class KnowledgeGraphOntologyValidator {
  validateNodeTypes(
    types:
      readonly OntologyNodeType[],
  ): readonly OntologyValidationIssue[] {
    const issues:
      OntologyValidationIssue[] = [];
    const ids =
      new Set(
        types.map(
          (type) => type.typeId,
        ),
      );

    for (const type of types) {
      if (!type.typeId.trim()) {
        issues.push({
          code:
            "node-type-id-empty",
          message:
            "Node type ID is required",
          subjectId:
            type.typeId,
        });
      }

      for (const parent of type.parentTypeIds) {
        if (!ids.has(parent)) {
          issues.push({
            code:
              "node-type-parent-missing",
            message:
              `Parent type does not exist: ${parent}`,
            subjectId:
              type.typeId,
          });
        }
      }

      const propertyIds =
        type.properties.map(
          (property) =>
            property.propertyId,
        );

      if (
        new Set(propertyIds).size !==
        propertyIds.length
      ) {
        issues.push({
          code:
            "node-type-property-duplicate",
          message:
            "Property IDs must be unique inside a type",
          subjectId:
            type.typeId,
        });
      }
    }

    for (
      const cycle of
      new OntologyHierarchy(
        types,
      ).detectCycles()
    ) {
      issues.push({
        code:
          "node-type-cycle",
        message:
          cycle,
        subjectId:
          cycle,
      });
    }

    return issues;
  }

  validateRelationshipTypes(
    types:
      readonly OntologyRelationshipType[],
    nodeTypes:
      readonly OntologyNodeType[],
  ): readonly OntologyValidationIssue[] {
    const issues:
      OntologyValidationIssue[] = [];
    const nodeTypeIds =
      new Set(
        nodeTypes.map(
          (type) => type.typeId,
        ),
      );
    const relationshipIds =
      new Set(
        types.map(
          (type) =>
            type.relationshipTypeId,
        ),
      );

    for (const type of types) {
      if (
        type.symmetric &&
        type.directed
      ) {
        issues.push({
          code:
            "relationship-symmetric-directed",
          message:
            "A symmetric relationship cannot be directed",
          subjectId:
            type.relationshipTypeId,
        });
      }

      if (
        type.inverseRelationshipTypeId &&
        !relationshipIds.has(
          type.inverseRelationshipTypeId,
        )
      ) {
        issues.push({
          code:
            "relationship-inverse-missing",
          message:
            `Inverse relationship does not exist: ${type.inverseRelationshipTypeId}`,
          subjectId:
            type.relationshipTypeId,
        });
      }

      for (
        const nodeTypeId of [
          ...type.allowedFromTypeIds,
          ...type.allowedToTypeIds,
        ]
      ) {
        if (!nodeTypeIds.has(nodeTypeId)) {
          issues.push({
            code:
              "relationship-node-type-missing",
            message:
              `Referenced node type does not exist: ${nodeTypeId}`,
            subjectId:
              type.relationshipTypeId,
          });
        }
      }
    }

    return issues;
  }

  validateTaxonomy(
    terms:
      readonly OntologyTaxonomyTerm[],
  ): readonly OntologyValidationIssue[] {
    const issues:
      OntologyValidationIssue[] = [];
    const byTaxonomy =
      new Map<
        string,
        Set<string>
      >();

    for (const term of terms) {
      const values =
        byTaxonomy.get(
          term.taxonomyId,
        ) ?? new Set<string>();
      values.add(term.termId);
      byTaxonomy.set(
        term.taxonomyId,
        values,
      );
    }

    for (const term of terms) {
      if (
        term.parentTermId &&
        !byTaxonomy
          .get(term.taxonomyId)
          ?.has(term.parentTermId)
      ) {
        issues.push({
          code:
            "taxonomy-parent-missing",
          message:
            `Parent taxonomy term does not exist: ${term.parentTermId}`,
          subjectId:
            term.termId,
        });
      }
    }

    return issues;
  }
}
