import assert from "node:assert/strict";
import {
  InMemoryUnifiedSearchEngine,
  ScopeSearchAuthorizationPolicy,
  UnifiedSearchService,
} from "../dist/index.js";

const service =
  new UnifiedSearchService(
    new InMemoryUnifiedSearchEngine(
      async (request) => ({
        query:
          request.query,
        mode:
          request.mode,
        results: [{
          searchDocumentId:
            "search:1",
          title:
            "Acute Coronary Syndrome",
          kind:
            "publication",
          finalScore:
            3.5,
          lexicalScore:
            1.2,
          semanticScore:
            0.9,
          graphScore:
            1.4,
        }],
        total:
          1,
        durationMilliseconds:
          12,
      }),
    ),
    new ScopeSearchAuthorizationPolicy(),
  );

const response =
  await service.execute(
    {
      ownerId:
        "owner:1",
      subjectId:
        "user:1",
      scopes: [
        "search:read",
      ],
    },
    {
      query:
        "acute coronary syndrome",
      mode:
        "hybrid",
      rankingProfile:
        "precision",
      limit:
        20,
      offset:
        0,
      includeFacets:
        true,
      includeExplanation:
        true,
    },
  );

assert.equal(
  response.total,
  1,
);
assert.equal(
  response.results[0].graphScore,
  1.4,
);

console.log(JSON.stringify({
  flow:
    "unified-search-api-authorization-validation",
  status:
    "passed",
}));
