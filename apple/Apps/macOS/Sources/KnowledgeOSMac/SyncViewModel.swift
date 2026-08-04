#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge
@MainActor final class SyncViewModel:ObservableObject { @Published private(set) var status:SyncStatusDTO?; @Published private(set) var isWorking=false; @Published var errorMessage:String?; private let bridge:CoreBridge; init(bridge:CoreBridge){self.bridge=bridge}
func refresh() async { await perform{ try await bridge.syncStatus() } }
func synchronize() async { await perform{ try await bridge.startSync() } }
func pause() async { await perform{ try await bridge.pauseSync() } }
func resume() async { await perform{ try await bridge.resumeSync() } }
private func perform(_ operation:() async throws -> SyncStatusDTO) async { isWorking=true; errorMessage=nil; do{status=try await operation()}catch{errorMessage=error.localizedDescription};isWorking=false }
}
#endif
