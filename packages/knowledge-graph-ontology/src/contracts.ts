import type {
  OntologyNodeType,
  OntologyRelationshipType,
  OntologyTaxonomyTerm,
} from "./model.js";

export interface KnowledgeGraphOntologyRepository {
  getNodeType(
    ontologyId: string,
    typeId: string,
  ): Promise<OntologyNodeType | undefined>;

  saveNodeType(
    ontologyId: string,
    type: OntologyNodeType,
  ): Promise<void>;

  listNodeTypes(
    ontologyId: string,
  ): Promise<readonly OntologyNodeType[]>;

  getRelationshipType(
    ontologyId: string,
    relationshipTypeId: string,
  ): Promise<OntologyRelationshipType | undefined>;

  saveRelationshipType(
    ontologyId: string,
    type: OntologyRelationshipType,
  ): Promise<void>;

  listRelationshipTypes(
    ontologyId: string,
  ): Promise<readonly OntologyRelationshipType[]>;

  saveTaxonomyTerm(
    ontologyId: string,
    term: OntologyTaxonomyTerm,
  ): Promise<void>;

  listTaxonomyTerms(
    ontologyId: string,
    taxonomyId: string,
  ): Promise<readonly OntologyTaxonomyTerm[]>;
}
