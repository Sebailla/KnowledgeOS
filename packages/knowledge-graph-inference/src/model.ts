export type InferenceRuleKind =
  | "transitive"
  | "inverse"
  | "symmetric"
  | "chain";

export interface KnowledgeGraphInferenceRule {
  readonly ruleId: string;
  readonly ontologyId: string;
  readonly kind: InferenceRuleKind;
  readonly sourceRelationshipTypeIds: readonly string[];
  readonly targetRelationshipTypeId: string;
  readonly enabled: boolean;
  readonly priority: number;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface KnowledgeGraphFact {
  readonly graphId: string;
  readonly edgeId: string;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly relationshipTypeId: string;
  readonly weight: number;
  readonly derived: boolean;
}

export interface KnowledgeGraphDerivedFact extends KnowledgeGraphFact {
  readonly derived: true;
  readonly provenance: KnowledgeGraphInferenceProvenance;
}

export interface KnowledgeGraphInferenceProvenance {
  readonly ruleId: string;
  readonly sourceEdgeIds: readonly string[];
  readonly generatedAt: string;
  readonly generation: number;
}

export interface KnowledgeGraphInferenceIssue {
  readonly code: string;
  readonly message: string;
  readonly subjectId: string;
}
