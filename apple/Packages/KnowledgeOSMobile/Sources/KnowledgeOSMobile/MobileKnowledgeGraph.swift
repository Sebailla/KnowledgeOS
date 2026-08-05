import Foundation

public struct MobileKnowledgeGraph: Sendable {
    public private(set) var nodes: [MobileGraphNode]
    public private(set) var edges: [MobileGraphEdge]

    public init(nodes: [MobileGraphNode] = [], edges: [MobileGraphEdge] = []) { self.nodes = nodes; self.edges = edges }

    public mutating func rebuild(from library: [MobileLibraryItem]) {
        nodes = library.map { MobileGraphNode(id: $0.id, type: "document", label: $0.title, documentId: $0.id, properties: ["availability": $0.availability.rawValue]) }
        edges = []
    }

    public func search(_ query: String) -> [MobileGraphNode] {
        guard !query.isEmpty else { return nodes }
        return nodes.filter { $0.label.localizedCaseInsensitiveContains(query) || $0.type.localizedCaseInsensitiveContains(query) }
    }

    public func neighbors(of nodeId: String) -> MobileGraphSubgraph {
        let selected = edges.filter { $0.sourceId == nodeId || $0.targetId == nodeId }
        let ids = Set(selected.flatMap { [$0.sourceId, $0.targetId] } + [nodeId])
        return MobileGraphSubgraph(nodes: nodes.filter { ids.contains($0.id) }, edges: selected)
    }

    public func expand(from nodeId: String, depth: Int) -> MobileGraphSubgraph {
        var ids: Set<String> = [nodeId]; var selected: [MobileGraphEdge] = []; var frontier = [nodeId]
        for _ in 0..<max(0, depth) {
            var next: [String] = []
            for id in frontier {
                for edge in edges where edge.sourceId == id || edge.targetId == id {
                    if !selected.contains(edge) { selected.append(edge) }
                    let other = edge.sourceId == id ? edge.targetId : edge.sourceId
                    if ids.insert(other).inserted { next.append(other) }
                }
            }
            frontier = next
        }
        return MobileGraphSubgraph(nodes: nodes.filter { ids.contains($0.id) }, edges: selected)
    }
}
