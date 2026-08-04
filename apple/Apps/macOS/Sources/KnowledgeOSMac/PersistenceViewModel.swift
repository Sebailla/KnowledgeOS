#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class PersistenceViewModel: ObservableObject {
    @Published private(set)
    var health: PersistenceHealthDTO?

    @Published
    var message: String?

    private let bridge: CoreBridge

    init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    func refresh() async {
        do {
            health = try await bridge.persistenceHealth()
            message = nil
        } catch {
            message = error.localizedDescription
        }
    }

    func backup(to directory: String) async {
        do {
            _ = try await bridge.backupPersistence(
                directory: directory
            )
            message = "Backup completed."
        } catch {
            message = error.localizedDescription
        }
    }
}
#endif
