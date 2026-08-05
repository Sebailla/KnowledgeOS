#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class ApplicationStatusViewModel:
ObservableObject {
    @Published private(set)
    var status: ApplicationStatusDTO?

    @Published private(set)
    var diagnostics:
        ApplicationDiagnosticsDTO?

    @Published private(set)
    var about: ApplicationAboutDTO?

    @Published private(set)
    var isRefreshing = false

    @Published var errorMessage: String?

    private let bridge: CoreBridge

    init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    func refresh() async {
        isRefreshing = true
        errorMessage = nil

        do {
            async let status =
                bridge.applicationStatus()
            async let diagnostics =
                bridge.applicationDiagnostics()
            async let about =
                bridge.applicationAbout()

            let values = try await (
                status,
                diagnostics,
                about
            )

            self.status = values.0
            self.diagnostics = values.1
            self.about = values.2
        } catch {
            errorMessage =
                error.localizedDescription
        }

        isRefreshing = false
    }
}
#endif
