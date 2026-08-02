import type {
  KnowledgeGraphOntologyRepository,
  OntologyNodeType,
  OntologyRelationshipType,
  OntologyTaxonomyTerm,
} from "@knowledgeos/knowledge-graph-ontology";
import {
  KnowledgeGraphOntologyValidator,
  OntologyHierarchy,
  OntologyInheritanceResolver,
  OntologyTaxonomy,
} from "@knowledgeos/knowledge-graph-ontology";

export class KnowledgeGraphOntologyRuntime {
  private readonly validator =
    new KnowledgeGraphOntologyValidator();

  public constructor(
    private readonly repository:
      KnowledgeGraphOntologyRepository,
  ) {}

  async saveNodeType(
    ontologyId: string,
    type: OntologyNodeType,
  ): Promise<void> {
    const existing =
      await this.repository.listNodeTypes(
        ontologyId,
      );

    const candidate = [
      ...existing.filter(
        (value) =>
          value.typeId !==
          type.typeId,
      ),
      type,
    ];

    const issues =
      this.validator.validateNodeTypes(
        candidate,
      );

    if (issues.length > 0) {
      throw new Error(
        issues
          .map(
            (issue) =>
              `${issue.code}: ${issue.message}`,
          )
          .join("; "),
      );
    }

    await this.repository.saveNodeType(
      ontologyId,
      type,
    );
  }

  async saveRelationshipType(
    ontologyId: string,
    type: OntologyRelationshipType,
  ): Promise<void> {
    const nodeTypes =
      await this.repository.listNodeTypes(
        ontologyId,
      );
    const existing =
      await this.repository.listRelationshipTypes(
        ontologyId,
      );

    const candidate = [
      ...existing.filter(
        (value) =>
          value.relationshipTypeId !==
          type.relationshipTypeId,
      ),
      type,
    ];

    const issues =
      this.validator.validateRelationshipTypes(
        candidate,
        nodeTypes,
      );

    if (issues.length > 0) {
      throw new Error(
        issues
          .map(
            (issue) =>
              `${issue.code}: ${issue.message}`,
          )
          .join("; "),
      );
    }

    await this.repository.saveRelationshipType(
      ontologyId,
      type,
    );
  }

  async saveTaxonomyTerm(
    ontologyId: string,
    term: OntologyTaxonomyTerm,
  ): Promise<void> {
    const existing =
      await this.repository.listTaxonomyTerms(
        ontologyId,
        term.taxonomyId,
      );

    const candidate = [
      ...existing.filter(
        (value) =>
          value.termId !==
          term.termId,
      ),
      term,
    ];

    const issues =
      this.validator.validateTaxonomy(
        candidate,
      );

    if (issues.length > 0) {
      throw new Error(
        issues
          .map(
            (issue) =>
              `${issue.code}: ${issue.message}`,
          )
          .join("; "),
      );
    }

    await this.repository.saveTaxonomyTerm(
      ontologyId,
      term,
    );
  }

  async isAssignable(
    ontologyId: string,
    candidateTypeId: string,
    expectedTypeId: string,
  ): Promise<boolean> {
    const types =
      await this.repository.listNodeTypes(
        ontologyId,
      );

    return new OntologyHierarchy(
      types,
    ).isAssignable(
      candidateTypeId,
      expectedTypeId,
    );
  }

  async effectiveProperties(
    ontologyId: string,
    typeId: string,
  ) {
    const types =
      await this.repository.listNodeTypes(
        ontologyId,
      );

    return new OntologyInheritanceResolver(
      types,
    ).effectiveProperties(
      typeId,
    );
  }

  async resolveTaxonomyTerm(
    ontologyId: string,
    taxonomyId: string,
    value: string,
  ) {
    const terms =
      await this.repository.listTaxonomyTerms(
        ontologyId,
        taxonomyId,
      );

    return new OntologyTaxonomy(
      terms,
    ).resolve(
      taxonomyId,
      value,
    );
  }
}
