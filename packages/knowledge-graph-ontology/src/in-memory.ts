import type {
  KnowledgeGraphOntologyRepository,
} from "./contracts.js";
import type {
  OntologyNodeType,
  OntologyRelationshipType,
  OntologyTaxonomyTerm,
} from "./model.js";

export class InMemoryKnowledgeGraphOntologyRepository
implements KnowledgeGraphOntologyRepository {
  private readonly nodeTypes =
    new Map<string, OntologyNodeType>();
  private readonly relationshipTypes =
    new Map<string, OntologyRelationshipType>();
  private readonly terms =
    new Map<string, OntologyTaxonomyTerm>();

  private key(
    ontologyId: string,
    id: string,
  ): string {
    return `${ontologyId}::${id}`;
  }

  async getNodeType(
    ontologyId: string,
    typeId: string,
  ) {
    return this.nodeTypes.get(
      this.key(
        ontologyId,
        typeId,
      ),
    );
  }

  async saveNodeType(
    ontologyId: string,
    type: OntologyNodeType,
  ): Promise<void> {
    this.nodeTypes.set(
      this.key(
        ontologyId,
        type.typeId,
      ),
      type,
    );
  }

  async listNodeTypes(
    ontologyId: string,
  ) {
    return [
      ...this.nodeTypes.entries(),
    ]
      .filter(
        ([key]) =>
          key.startsWith(
            `${ontologyId}::`,
          ),
      )
      .map(([, value]) => value)
      .sort(
        (a, b) =>
          a.typeId.localeCompare(
            b.typeId,
          ),
      );
  }

  async getRelationshipType(
    ontologyId: string,
    relationshipTypeId: string,
  ) {
    return this.relationshipTypes.get(
      this.key(
        ontologyId,
        relationshipTypeId,
      ),
    );
  }

  async saveRelationshipType(
    ontologyId: string,
    type: OntologyRelationshipType,
  ): Promise<void> {
    this.relationshipTypes.set(
      this.key(
        ontologyId,
        type.relationshipTypeId,
      ),
      type,
    );
  }

  async listRelationshipTypes(
    ontologyId: string,
  ) {
    return [
      ...this.relationshipTypes.entries(),
    ]
      .filter(
        ([key]) =>
          key.startsWith(
            `${ontologyId}::`,
          ),
      )
      .map(([, value]) => value)
      .sort(
        (a, b) =>
          a.relationshipTypeId.localeCompare(
            b.relationshipTypeId,
          ),
      );
  }

  async saveTaxonomyTerm(
    ontologyId: string,
    term: OntologyTaxonomyTerm,
  ): Promise<void> {
    this.terms.set(
      this.key(
        ontologyId,
        `${term.taxonomyId}::${term.termId}`,
      ),
      term,
    );
  }

  async listTaxonomyTerms(
    ontologyId: string,
    taxonomyId: string,
  ) {
    return [
      ...this.terms.entries(),
    ]
      .filter(
        ([key]) =>
          key.startsWith(
            `${ontologyId}::${taxonomyId}::`,
          ),
      )
      .map(([, value]) => value)
      .sort(
        (a, b) =>
          a.termId.localeCompare(
            b.termId,
          ),
      );
  }
}
