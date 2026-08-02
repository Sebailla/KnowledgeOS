import type {
  KnowledgeGraphInferenceRepository,
} from "./contracts.js";
import type {
  KnowledgeGraphDerivedFact,
  KnowledgeGraphFact,
  KnowledgeGraphInferenceRule,
} from "./model.js";

export class InMemoryKnowledgeGraphInferenceRepository
implements KnowledgeGraphInferenceRepository {
  private readonly rules =
    new Map<string, KnowledgeGraphInferenceRule>();
  private readonly facts =
    new Map<string, KnowledgeGraphFact>();
  private readonly derived =
    new Map<string, KnowledgeGraphDerivedFact>();

  async saveRule(
    rule: KnowledgeGraphInferenceRule,
  ): Promise<void> {
    this.rules.set(rule.ruleId, rule);
  }

  async listRules(ontologyId: string) {
    return [...this.rules.values()]
      .filter((rule) => rule.ontologyId === ontologyId)
      .sort(
        (a, b) =>
          b.priority - a.priority ||
          a.ruleId.localeCompare(b.ruleId),
      );
  }

  seedFact(fact: KnowledgeGraphFact): void {
    this.facts.set(fact.edgeId, fact);
  }

  async listFacts(
    graphId: string,
    relationshipTypeIds?: readonly string[],
  ) {
    return [...this.facts.values()].filter(
      (fact) =>
        fact.graphId === graphId &&
        (
          !relationshipTypeIds ||
          relationshipTypeIds.includes(
            fact.relationshipTypeId,
          )
        ),
    );
  }

  async upsertDerivedFact(
    fact: KnowledgeGraphDerivedFact,
  ): Promise<void> {
    this.derived.set(fact.edgeId, fact);
  }

  async deleteDerivedFactsByRule(
    graphId: string,
    ruleId: string,
  ): Promise<number> {
    let removed = 0;

    for (const [key, fact] of this.derived) {
      if (
        fact.graphId === graphId &&
        fact.provenance.ruleId === ruleId
      ) {
        this.derived.delete(key);
        removed += 1;
      }
    }

    return removed;
  }

  async listDerivedFacts(graphId: string) {
    return [...this.derived.values()]
      .filter((fact) => fact.graphId === graphId)
      .sort(
        (a, b) => a.edgeId.localeCompare(b.edgeId),
      );
  }
}
