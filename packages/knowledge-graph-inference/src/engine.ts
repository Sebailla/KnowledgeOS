import type {
  KnowledgeGraphDerivedFact,
  KnowledgeGraphFact,
  KnowledgeGraphInferenceRule,
} from "./model.js";

export interface InferenceClock {
  nowIso(): string;
}

export class KnowledgeGraphInferenceEngine {
  public constructor(
    private readonly clock: InferenceClock,
  ) {}

  infer(
    facts: readonly KnowledgeGraphFact[],
    rules: readonly KnowledgeGraphInferenceRule[],
  ): readonly KnowledgeGraphDerivedFact[] {
    const enabled = [...rules]
      .filter((rule) => rule.enabled)
      .sort(
        (a, b) =>
          b.priority - a.priority ||
          a.ruleId.localeCompare(b.ruleId),
      );

    const derived = new Map<string, KnowledgeGraphDerivedFact>();

    for (const rule of enabled) {
      const candidates =
        rule.kind === "transitive"
          ? this.transitive(facts, rule)
          : rule.kind === "inverse"
            ? this.inverse(facts, rule)
            : rule.kind === "symmetric"
              ? this.symmetric(facts, rule)
              : this.chain(facts, rule);

      for (const candidate of candidates) {
        const key = [
          candidate.graphId,
          candidate.fromNodeId,
          candidate.toNodeId,
          candidate.relationshipTypeId,
        ].join("::");

        const existing = derived.get(key);

        if (
          !existing ||
          candidate.weight > existing.weight
        ) {
          derived.set(key, candidate);
        }
      }
    }

    return [...derived.values()].sort(
      (a, b) =>
        a.relationshipTypeId.localeCompare(b.relationshipTypeId) ||
        a.fromNodeId.localeCompare(b.fromNodeId) ||
        a.toNodeId.localeCompare(b.toNodeId),
    );
  }

  private transitive(
    facts: readonly KnowledgeGraphFact[],
    rule: KnowledgeGraphInferenceRule,
  ): KnowledgeGraphDerivedFact[] {
    const [sourceType] = rule.sourceRelationshipTypeIds;
    const source = facts.filter(
      (fact) => fact.relationshipTypeId === sourceType,
    );
    const output: KnowledgeGraphDerivedFact[] = [];

    for (const left of source) {
      for (const right of source) {
        if (
          left.graphId !== right.graphId ||
          left.toNodeId !== right.fromNodeId ||
          left.fromNodeId === right.toNodeId
        ) {
          continue;
        }

        output.push(
          this.create(
            rule,
            left.graphId,
            left.fromNodeId,
            right.toNodeId,
            Math.min(left.weight, right.weight),
            [left.edgeId, right.edgeId],
            2,
          ),
        );
      }
    }

    return output;
  }

  private inverse(
    facts: readonly KnowledgeGraphFact[],
    rule: KnowledgeGraphInferenceRule,
  ): KnowledgeGraphDerivedFact[] {
    const [sourceType] = rule.sourceRelationshipTypeIds;

    return facts
      .filter((fact) => fact.relationshipTypeId === sourceType)
      .map((fact) =>
        this.create(
          rule,
          fact.graphId,
          fact.toNodeId,
          fact.fromNodeId,
          fact.weight,
          [fact.edgeId],
          1,
        ),
      );
  }

  private symmetric(
    facts: readonly KnowledgeGraphFact[],
    rule: KnowledgeGraphInferenceRule,
  ): KnowledgeGraphDerivedFact[] {
    return this.inverse(facts, rule);
  }

  private chain(
    facts: readonly KnowledgeGraphFact[],
    rule: KnowledgeGraphInferenceRule,
  ): KnowledgeGraphDerivedFact[] {
    const [leftType, rightType] =
      rule.sourceRelationshipTypeIds;

    const leftFacts = facts.filter(
      (fact) => fact.relationshipTypeId === leftType,
    );
    const rightFacts = facts.filter(
      (fact) => fact.relationshipTypeId === rightType,
    );

    const output: KnowledgeGraphDerivedFact[] = [];

    for (const left of leftFacts) {
      for (const right of rightFacts) {
        if (
          left.graphId !== right.graphId ||
          left.toNodeId !== right.fromNodeId
        ) {
          continue;
        }

        output.push(
          this.create(
            rule,
            left.graphId,
            left.fromNodeId,
            right.toNodeId,
            Math.min(left.weight, right.weight),
            [left.edgeId, right.edgeId],
            1,
          ),
        );
      }
    }

    return output;
  }

  private create(
    rule: KnowledgeGraphInferenceRule,
    graphId: string,
    fromNodeId: string,
    toNodeId: string,
    weight: number,
    sourceEdgeIds: readonly string[],
    generation: number,
  ): KnowledgeGraphDerivedFact {
    const edgeId =
      `derived:${rule.ruleId}:${fromNodeId}:${toNodeId}`;

    return {
      graphId,
      edgeId,
      fromNodeId,
      toNodeId,
      relationshipTypeId:
        rule.targetRelationshipTypeId,
      weight,
      derived: true,
      provenance: {
        ruleId: rule.ruleId,
        sourceEdgeIds: [...sourceEdgeIds].sort(),
        generatedAt: this.clock.nowIso(),
        generation,
      },
    };
  }
}
