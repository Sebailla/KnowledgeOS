import XCTest
@testable import KnowledgeOSCoreBridge
actor GraphMock: CoreTransport { func start() async throws{}; func stop() async{}; func send(_ request:CoreRequest) async throws -> CoreResponse { CoreResponse(version:CoreProtocol.version,id:request.id,result:.object(["nodes":.array([]),"edges":.array([])]),error:nil) } }
final class KnowledgeGraphBridgeTests:XCTestCase { func testSubgraphDecodes() async throws { let bridge=CoreBridge(transport:GraphMock()); let graph=try await bridge.graphExpand(nodeID:"node:1"); XCTAssertEqual(graph.nodes.count,0) } }
