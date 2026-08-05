#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class LocalSearchViewModel:
ObservableObject {
    @Published private(set)
    var results: [LocalSearchHitDTO] = []
    @Published private(set)
    var suggestions: [String] = []
    @Published private(set)
    var total = 0
    @Published private(set)
    var isLoading = false
    @Published var query = ""
    @Published var errorMessage: String?

    private let bridge: CoreBridge

    init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    func search() async {
        guard !query.trimmingCharacters(
            in: .whitespacesAndNewlines
        ).isEmpty else {
            results = []
            total = 0
            suggestions = []
            return
        }

        isLoading = true
        errorMessage = nil

        do {
            async let page =
                bridge.localSearch(
                    query: query
                )
            async let suggestions =
                bridge.searchSuggestions(
                    query: query
                )

            let resolved =
                try await (
                    page,
                    suggestions
                )

            results =
                resolved.0.items
            total =
                resolved.0.total
            self.suggestions =
                resolved.1
        } catch {
            errorMessage =
                error.localizedDescription
        }

        isLoading = false
    }
}
#endif
