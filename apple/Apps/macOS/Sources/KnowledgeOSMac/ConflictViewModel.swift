#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge
@MainActor final class ConflictViewModel: ObservableObject { @Published private(set) var conflicts:[ConflictDTO]=[]; @Published private(set) var statistics:ConflictStatisticsDTO?; @Published var errorMessage:String?; private let bridge:CoreBridge; init(bridge:CoreBridge){self.bridge=bridge} ; func refresh() async { do { conflicts=try await bridge.listConflicts(); statistics=try await bridge.conflictStatistics() } catch { errorMessage=error.localizedDescription } } ; func resolve(_ conflict:ConflictDTO, strategy:ConflictResolutionStrategyDTO) async { do { _=try await bridge.resolveConflict(id:conflict.id,strategy:strategy); await refresh() } catch { errorMessage=error.localizedDescription } } }
#endif
