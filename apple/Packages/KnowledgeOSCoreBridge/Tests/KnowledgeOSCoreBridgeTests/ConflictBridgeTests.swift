import XCTest
@testable import KnowledgeOSCoreBridge
actor ConflictMock: CoreTransport { func start() async throws {} ; func stop() async {} ; func send(_ request:CoreRequest) async throws -> CoreResponse { CoreResponse(version:CoreProtocol.version,id:request.id,result:.object(["conflicts":.array([])]),error:nil) } }
final class ConflictBridgeTests:XCTestCase { func testListDecodes() async throws { let bridge=CoreBridge(transport:ConflictMock()); let values=try await bridge.listConflicts(); XCTAssertTrue(values.isEmpty) } }
