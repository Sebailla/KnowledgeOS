import XCTest
@testable import KnowledgeOSCoreBridge

actor LocalSearchMock: CoreTransport {
    func start() async throws {}
    func stop() async {}

    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        CoreResponse(
            version: CoreProtocol.version,
            id: request.id,
            result: .object([
                "items": .array([]),
                "page": .number(1),
                "pageSize": .number(20),
                "total": .number(0),
                "hasNextPage": .bool(false)
            ]),
            error: nil
        )
    }
}

final class LocalSearchBridgeTests:
XCTestCase {
    func testSearchPageDecodes()
    async throws {
        let bridge = CoreBridge(
            transport: LocalSearchMock()
        )

        let page =
            try await bridge.localSearch(
                query: "knowledge"
            )

        XCTAssertEqual(page.total, 0)
        XCTAssertEqual(page.page, 1)
    }
}
