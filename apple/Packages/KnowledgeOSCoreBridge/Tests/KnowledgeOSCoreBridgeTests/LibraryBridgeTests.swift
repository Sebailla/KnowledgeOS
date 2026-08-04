import XCTest
@testable import KnowledgeOSCoreBridge

actor LibraryMockTransport: CoreTransport {
    func start() async throws {}
    func stop() async {}

    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        CoreResponse(
            version: CoreProtocol.version,
            id: request.id,
            result: .object([
                "items": .array([
                    .object([
                        "id": .string("item:1"),
                        "title":
                            .string("KnowledgeOS"),
                        "subtitle": .null,
                        "authors":
                            .array([
                                .string("Team")
                            ]),
                        "kind":
                            .string("document"),
                        "availability":
                            .string("both"),
                        "favorite": .bool(true),
                        "tags":
                            .array([
                                .string("knowledge")
                            ]),
                        "createdAt":
                            .string("2026-08-01"),
                        "updatedAt":
                            .string("2026-08-03"),
                        "coverURL": .null,
                        "metadata": .object([:])
                    ])
                ]),
                "page": .number(1),
                "pageSize": .number(24),
                "total": .number(1),
                "hasNextPage": .bool(false)
            ]),
            error: nil
        )
    }
}

final class LibraryBridgeTests: XCTestCase {
    func testLibraryPageDecodes()
    async throws {
        let bridge = CoreBridge(
            transport: LibraryMockTransport()
        )

        let page =
            try await bridge.listLibrary()

        XCTAssertEqual(page.total, 1)
        XCTAssertEqual(
            page.items.first?.title,
            "KnowledgeOS"
        )
        XCTAssertEqual(
            page.items.first?.availability,
            .both
        )
    }
}
