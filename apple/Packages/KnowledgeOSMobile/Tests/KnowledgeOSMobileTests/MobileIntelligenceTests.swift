import XCTest
@testable import KnowledgeOSMobile

final class MobileIntelligenceTests: XCTestCase {
    func testSearchRanksTitleMatches() {
        var index = MobileSearchIndex()
        index.rebuild(from: [
            .init(id: "1", title: "Knowledge Graph", summary: "semantic relations", availability: .local),
            .init(id: "2", title: "Other", summary: "knowledge graph", availability: .local),
        ])
        XCTAssertEqual(index.search("knowledge graph").first?.id, "1")
    }

    func testGraphExpansion() {
        let graph = MobileKnowledgeGraph(
            nodes: [.init(id: "a", type: "document", label: "A", documentId: "a", properties: [:]), .init(id: "b", type: "concept", label: "B", documentId: nil, properties: [:])],
            edges: [.init(id: "e", type: "relatedTo", sourceId: "a", targetId: "b")]
        )
        XCTAssertEqual(graph.expand(from: "a", depth: 1).nodes.count, 2)
    }
}
