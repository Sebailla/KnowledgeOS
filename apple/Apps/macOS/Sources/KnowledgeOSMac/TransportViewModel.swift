#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class TransportViewModel:
ObservableObject {
    @Published var baseURL =
        "http://127.0.0.1:8787"
    @Published var token = ""
    @Published private(set)
    var health: TransportHealthDTO?
    @Published private(set)
    var isTesting = false
    @Published var errorMessage: String?

    private let bridge: CoreBridge

    init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    func load() async {
        do {
            let configuration =
                try await bridge
                    .transportConfiguration()
            baseURL =
                configuration.baseURL
            token =
                configuration.token ?? ""
        } catch {
            errorMessage =
                error.localizedDescription
        }
    }

    func saveAndTest() async {
        isTesting = true
        errorMessage = nil

        do {
            _ = try await bridge
                .saveTransportConfiguration(
                    TransportConfigurationDTO(
                        baseURL: baseURL,
                        token:
                            token.isEmpty
                                ? nil
                                : token
                    )
                )

            health =
                try await bridge
                    .testTransport()
        } catch {
            health = nil
            errorMessage =
                error.localizedDescription
        }

        isTesting = false
    }
}
#endif
