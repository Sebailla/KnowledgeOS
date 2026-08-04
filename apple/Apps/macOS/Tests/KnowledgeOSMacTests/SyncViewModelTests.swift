#if canImport(SwiftUI)
import XCTest
import KnowledgeOSCoreBridge
@testable import KnowledgeOSMac
actor SyncVMTransport:CoreTransport { func start() async throws{}; func stop() async{}; func send(_ request:CoreRequest) async throws -> CoreResponse { CoreResponse(version:CoreProtocol.version,id:request.id,result:.object(["phase":.string("idle"),"cursor":.string("0"),"pending":.number(0),"uploaded":.number(1),"downloaded":.number(0),"retryCount":.number(0),"lastSyncAt":.null,"lastError":.null,"conflicts":.array([])]),error:nil) } }
@MainActor final class SyncViewModelTests:XCTestCase { func testRefresh() async { let vm=SyncViewModel(bridge:CoreBridge(transport:SyncVMTransport())); await vm.refresh(); XCTAssertEqual(vm.status?.uploaded,1) } }
#endif
