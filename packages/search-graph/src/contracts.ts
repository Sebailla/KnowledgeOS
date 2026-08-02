import type {
  SearchGraphEdge,
  SearchGraphNode,
  SearchGraphRelationshipType,
} from "./model.js";

export interface SearchGraphRepository {
  upsertNode(
    node: SearchGraphNode,
  ): Promise<void>;

  upsertEdge(
    edge: SearchGraphEdge,
  ): Promise<void>;

  getNode(
    nodeId: string,
  ): Promise<SearchGraphNode | undefined>;

  neighbors(
    nodeId: string,
    relationshipTypes?:
      readonly SearchGraphRelationshipType[],
  ): Promise<
    readonly {
      readonly node: SearchGraphNode;
      readonly edge: SearchGraphEdge;
    }[]
  >;

  allNodes(): Promise<
    readonly SearchGraphNode[]
  >;

  allEdges(): Promise<
    readonly SearchGraphEdge[]
  >;
}
