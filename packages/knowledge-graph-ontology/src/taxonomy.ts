import type {
  OntologyTaxonomyTerm,
} from "./model.js";

export class OntologyTaxonomy {
  public constructor(
    private readonly terms:
      readonly OntologyTaxonomyTerm[],
  ) {}

  children(
    taxonomyId: string,
    parentTermId:
      string | undefined,
  ) {
    return this.terms
      .filter(
        (term) =>
          term.taxonomyId ===
            taxonomyId &&
          term.parentTermId ===
            parentTermId,
      )
      .sort(
        (a, b) =>
          a.label.localeCompare(
            b.label,
          ),
      );
  }

  resolve(
    taxonomyId: string,
    value: string,
  ): OntologyTaxonomyTerm | undefined {
    const normalized =
      value
        .normalize("NFKC")
        .toLowerCase()
        .trim();

    return this.terms.find(
      (term) =>
        term.taxonomyId ===
          taxonomyId &&
        (
          term.label
            .normalize("NFKC")
            .toLowerCase() ===
            normalized ||
          term.synonyms.some(
            (synonym) =>
              synonym
                .normalize("NFKC")
                .toLowerCase() ===
              normalized,
          )
        ),
    );
  }
}
