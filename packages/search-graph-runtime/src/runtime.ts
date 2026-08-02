import type {
  SearchGraphExplanation,
  SearchGraphRepository,
} from "@knowledgeos/search-graph";
import {
  SearchGraphCentralityService,
  SearchGraphTraversalService,
} from "@knowledgeos/search-graph";

export interface BaseSearchCandidate {
  readonly searchDocumentId: string;
  readonly lexicalScore: number;
  readonly semanticScore: number;
}

export interface GraphAwareSearchResult
extends BaseSearchCandidate {
  readonly graphScore: number;
  readonly finalScore: number;
  readonly explanation?:
    SearchGraphExplanation;
}

export interface SearchDocumentNodeResolver {
  nodeIdForSearchDocument(
    searchDocumentId: string,
  ): Promise<string | undefined>;

  searchDocumentIdForNode(
    nodeId: string,
  ): Promise<string | undefined>;
}

export class GraphAwareSearchRuntime {
  public constructor(
    private readonly graph:
      SearchGraphRepository,
    private readonly resolver:
      SearchDocumentNodeResolver,
  ) {}

  async expand(
    baseCandidates:
      readonly BaseSearchCandidate[],
    options?: {
      readonly maximumDepth?: number;
      readonly graphWeight?: number;
      readonly lexicalWeight?: number;
      readonly semanticWeight?: number;
    },
  ): Promise<
    readonly GraphAwareSearchResult[]
  > {
    const maximumDepth =
      options?.maximumDepth ?? 2;
    const graphWeight =
      options?.graphWeight ?? 1;
    const lexicalWeight =
      options?.lexicalWeight ?? 1;
    const semanticWeight =
      options?.semanticWeight ?? 1;

    const seedNodeIds =
      (
        await Promise.all(
          baseCandidates.map(
            (candidate) =>
              this.resolver.nodeIdForSearchDocument(
                candidate.searchDocumentId,
              ),
          ),
        )
      ).filter(
        (value): value is string =>
          Boolean(value),
      );

    const traversal =
      await new SearchGraphTraversalService(
        this.graph,
      ).traverse(
        seedNodeIds,
        {
          maximumDepth,
          minimumScore: 0.05,
          decayPerDepth: 0.75,
        },
      );

    const centrality =
      await new SearchGraphCentralityService(
        this.graph,
      ).calculate();

    const centralityByNode =
      new Map(
        centrality.map(
          (value) => [
            value.nodeId,
            value.weightedDegree,
          ],
        ),
      );

    const values =
      new Map<
        string,
        GraphAwareSearchResult
      >();

    for (const candidate of baseCandidates) {
      values.set(
        candidate.searchDocumentId,
        {
          ...candidate,
          graphScore: 0,
          finalScore:
            candidate.lexicalScore *
              lexicalWeight +
            candidate.semanticScore *
              semanticWeight,
        },
      );
    }

    for (const step of traversal) {
      const searchDocumentId =
        await this.resolver.searchDocumentIdForNode(
          step.nodeId,
        );

      if (!searchDocumentId) {
        continue;
      }

      const existing =
        values.get(
          searchDocumentId,
        );

      const centralityBoost =
        Math.log1p(
          centralityByNode.get(
            step.nodeId,
          ) ?? 0,
        ) * 0.1;

      const graphScore =
        step.score +
        centralityBoost;

      const reason =
        step.viaRelationship &&
        step.parentNodeId
          ? [{
              nodeId:
                step.nodeId,
              relationship:
                step.viaRelationship,
              relatedNodeId:
                step.parentNodeId,
              depth:
                step.depth,
              contribution:
                graphScore,
            }]
          : [];

      values.set(
        searchDocumentId,
        {
          searchDocumentId,
          lexicalScore:
            existing?.lexicalScore ?? 0,
          semanticScore:
            existing?.semanticScore ?? 0,
          graphScore:
            Math.max(
              existing?.graphScore ?? 0,
              graphScore,
            ),
          finalScore:
            (existing?.lexicalScore ?? 0) *
              lexicalWeight +
            (existing?.semanticScore ?? 0) *
              semanticWeight +
            graphScore *
              graphWeight,
          ...(reason.length > 0
            ? {
                explanation: {
                  searchDocumentId,
                  reasons:
                    reason,
                },
              }
            : {}),
        },
      );
    }

    return [
      ...values.values(),
    ].sort(
      (a, b) =>
        b.finalScore -
          a.finalScore ||
        b.graphScore -
          a.graphScore ||
        a.searchDocumentId.localeCompare(
          b.searchDocumentId,
        ),
    );
  }
}
