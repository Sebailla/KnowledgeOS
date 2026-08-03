import type {
  KnowledgeGraphDerivedFact,
  KnowledgeGraphFact,
  KnowledgeGraphInferenceRule,
} from "./model.js";

export interface KnowledgeGraphInferenceRepository {
  saveRule(
    rule: KnowledgeGraphInferenceRule,
  ): Promise<void>;

  listRules(
    ontologyId: string,
  ): Promise<readonly KnowledgeGraphInferenceRule[]>;

  listFacts(
    graphId: string,
    relationshipTypeIds?: readonly string[],
  ): Promise<readonly KnowledgeGraphFact[]>;

  upsertDerivedFact(
    fact: KnowledgeGraphDerivedFact,
  ): Promise<void>;

  deleteDerivedFactsByRule(
    graphId: string,
    ruleId: string,
  ): Promise<number>;

  listDerivedFacts(
    graphId: string,
  ): Promise<readonly KnowledgeGraphDerivedFact[]>;
}
