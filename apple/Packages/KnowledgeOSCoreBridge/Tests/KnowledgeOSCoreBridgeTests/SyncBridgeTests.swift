import XCTest
@testable import KnowledgeOSCoreBridge
actor SyncMockTransport:CoreTransport { func start() async throws{}; func stop() async{}; func send(_ request:CoreRequest) async throws -> CoreResponse { CoreResponse(version:CoreProtocol.version,id:request.id,result:.object(["phase":.string("idle"),"cursor":.string("4"),"pending":.number(0),"uploaded":.number(4),"downloaded":.number(2),"retryCount":.number(0),"lastSyncAt":.null,"lastError":.null,"conflicts":.array([])]),error:nil) } }
final class SyncBridgeTests:XCTestCase { func testStatusDecodes() async throws { let bridge=CoreBridge(transport:SyncMockTransport()); let status=try await bridge.syncStatus(); XCTAssertEqual(status.phase,.idle); XCTAssertEqual(status.uploaded,4) } }
