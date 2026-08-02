export type OntologyPropertyValueType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "identifier";

export interface OntologyPropertyDefinition {
  readonly propertyId: string;
  readonly valueType: OntologyPropertyValueType;
  readonly required: boolean;
  readonly multiple: boolean;
  readonly inherited: boolean;
}

export interface OntologyNodeType {
  readonly typeId: string;
  readonly label: string;
  readonly description?: string;
  readonly abstract: boolean;
  readonly parentTypeIds: readonly string[];
  readonly properties:
    readonly OntologyPropertyDefinition[];
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OntologyRelationshipType {
  readonly relationshipTypeId: string;
  readonly label: string;
  readonly description?: string;
  readonly directed: boolean;
  readonly symmetric: boolean;
  readonly transitive: boolean;
  readonly inverseRelationshipTypeId?: string;
  readonly allowedFromTypeIds: readonly string[];
  readonly allowedToTypeIds: readonly string[];
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OntologyTaxonomyTerm {
  readonly taxonomyId: string;
  readonly termId: string;
  readonly label: string;
  readonly parentTermId?: string;
  readonly synonyms: readonly string[];
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface OntologySnapshot {
  readonly ontologyId: string;
  readonly nodeTypes:
    readonly OntologyNodeType[];
  readonly relationshipTypes:
    readonly OntologyRelationshipType[];
  readonly taxonomyTerms:
    readonly OntologyTaxonomyTerm[];
  readonly version: number;
  readonly createdAt: string;
}
