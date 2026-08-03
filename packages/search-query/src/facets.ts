import type {
  SearchFacetResult,
} from "./model.js";

export function normalizeFacetResults(
  values:
    readonly SearchFacetResult[],
): readonly SearchFacetResult[] {
  return values.map(
    (facet) => ({
      ...facet,
      buckets:
        [...facet.buckets]
          .filter(
            (bucket) =>
              bucket.count > 0,
          )
          .sort(
            (a, b) =>
              b.count - a.count ||
              a.value.localeCompare(
                b.value,
              ),
          ),
    }),
  );
}
