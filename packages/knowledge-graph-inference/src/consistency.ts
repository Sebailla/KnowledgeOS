import type {
  KnowledgeGraphFact,
  KnowledgeGraphInferenceIssue,
} from "./model.js";

export class KnowledgeGraphInferenceConsistencyChecker {
  check(
    asserted: readonly KnowledgeGraphFact[],
    derived: readonly KnowledgeGraphFact[],
  ): readonly KnowledgeGraphInferenceIssue[] {
    const issues: KnowledgeGraphInferenceIssue[] = [];

    const assertedKeys = new Set(
      asserted.map((fact) =>
        [
          fact.graphId,
          fact.fromNodeId,
          fact.toNodeId,
          fact.relationshipTypeId,
        ].join("::"),
      ),
    );

    const derivedIds = new Set<string>();

    for (const fact of derived) {
      if (derivedIds.has(fact.edgeId)) {
        issues.push({
          code: "derived-edge-id-duplicate",
          message: `Duplicate derived edge ID: ${fact.edgeId}`,
          subjectId: fact.edgeId,
        });
      }
      derivedIds.add(fact.edgeId);

      if (fact.fromNodeId === fact.toNodeId) {
        issues.push({
          code: "derived-self-loop",
          message: "Derived self-loop detected",
          subjectId: fact.edgeId,
        });
      }

      const key = [
        fact.graphId,
        fact.fromNodeId,
        fact.toNodeId,
        fact.relationshipTypeId,
      ].join("::");

      if (assertedKeys.has(key)) {
        issues.push({
          code: "derived-duplicates-asserted",
          message: "Derived fact duplicates an asserted fact",
          subjectId: fact.edgeId,
        });
      }
    }

    return issues;
  }
}
