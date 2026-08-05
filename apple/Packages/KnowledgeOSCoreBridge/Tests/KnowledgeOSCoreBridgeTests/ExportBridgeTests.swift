import XCTest
@testable import KnowledgeOSCoreBridge

actor ExportMock: CoreTransport {
    func start() async throws {}
    func stop() async {}

    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        CoreResponse(
            version: CoreProtocol.version,
            id: request.id,
            result: .object([
                "formats": .array([
                    .object([
                        "id": .string("markdown"),
                        "name": .string("Markdown"),
                        "mediaType": .string("text/markdown")
                    ])
                ])
            ]),
            error: nil
        )
    }
}

final class ExportBridgeTests: XCTestCase {
    func testFormatsDecode() async throws {
        let bridge = CoreBridge(
            transport: ExportMock()
        )

        let formats = try await bridge.exportFormats()

        XCTAssertEqual(
            formats.first?.id,
            .markdown
        )
    }
}
