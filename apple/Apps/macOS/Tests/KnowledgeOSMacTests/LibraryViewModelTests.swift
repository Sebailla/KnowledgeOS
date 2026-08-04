#if canImport(SwiftUI)
import XCTest
import KnowledgeOSCoreBridge
@testable import KnowledgeOSMac

actor TestLibraryService:
LibraryService {
    func start() async throws {}
    func stop() async {}

    func list(
        query: LibraryQuery
    ) async throws -> LibraryPageDTO {
        LibraryPageDTO(
            items: [
                LibraryItemDTO(
                    id: "item:1",
                    title: "KnowledgeOS",
                    subtitle: nil,
                    authors: ["Team"],
                    kind: .document,
                    availability: .both,
                    favorite: true,
                    tags: ["knowledge"],
                    createdAt: "2026-08-01",
                    updatedAt: "2026-08-03",
                    coverURL: nil,
                    metadata: [:]
                )
            ],
            page: 1,
            pageSize: 24,
            total: 1,
            hasNextPage: false
        )
    }

    func item(
        id: String
    ) async throws -> LibraryItemDTO {
        try await list(
            query: .init()
        ).items[0]
    }

    func recent(
        limit: Int
    ) async throws -> [LibraryItemDTO] {
        try await list(
            query: .init()
        ).items
    }

    func favorites(
        limit: Int
    ) async throws -> [LibraryItemDTO] {
        try await recent(limit: limit)
    }
}

@MainActor
final class LibraryViewModelTests:
XCTestCase {
    func testLoadSelectsFirstItem()
    async {
        let viewModel =
            LibraryViewModel(
                service:
                    TestLibraryService()
            )

        await viewModel.load()

        XCTAssertEqual(
            viewModel.total,
            1
        )
        XCTAssertEqual(
            viewModel.selectedItemID,
            "item:1"
        )
    }
}
#endif
