#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class LibraryViewModel:
ObservableObject {
    enum Presentation:
    String, CaseIterable {
        case grid
        case list
    }

    @Published private(set)
    var items: [LibraryItemDTO] = []

    @Published private(set)
    var total = 0

    @Published private(set)
    var isLoading = false

    @Published var errorMessage: String?
    @Published var selectedItemID: String?
    @Published var queryText = ""
    @Published var sort:
        LibrarySort = .updatedDescending
    @Published var availability:
        LibraryAvailability?
    @Published var presentation:
        Presentation = .grid

    private let service: LibraryService
    private var page = 1
    private let pageSize = 24

    init(service: LibraryService) {
        self.service = service
    }

    var selectedItem:
    LibraryItemDTO? {
        items.first {
            $0.id == selectedItemID
        }
    }

    func load(
        reset: Bool = true
    ) async {
        guard !isLoading else {
            return
        }

        if reset {
            page = 1
        }

        isLoading = true
        errorMessage = nil

        do {
            let result =
                try await service.list(
                    query: LibraryQuery(
                        text:
                            queryText.isEmpty
                                ? nil
                                : queryText,
                        page: page,
                        pageSize: pageSize,
                        sort: sort,
                        availability:
                            availability.map {
                                [$0]
                            } ?? []
                    )
                )

            items = result.items
            total = result.total

            if (
                selectedItemID == nil ||
                !items.contains {
                    $0.id ==
                        selectedItemID
                }
            ) {
                selectedItemID =
                    items.first?.id
            }
        } catch {
            errorMessage =
                error.localizedDescription
        }

        isLoading = false
    }

    func reloadForQuery() async {
        await load(reset: true)
    }
}
#endif
