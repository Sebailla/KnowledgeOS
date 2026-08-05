import XCTest
@testable import KnowledgeOSCoreBridge

actor ImportMockTransport:
CoreTransport {
    func start() async throws {}
    func stop() async {}

    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        CoreResponse(
            version: CoreProtocol.version,
            id: request.id,
            result: .object([
                "name":
                    .string("notes.md"),
                "format":
                    .string("markdown"),
                "mediaType":
                    .string("text/markdown"),
                "title":
                    .string("Notes"),
                "checksum":
                    .string(
                        String(
                            repeating: "a",
                            count: 64
                        )
                    ),
                "size": .number(10),
                "duplicate": .bool(false),
                "requiresOCR": .bool(false),
                "metadata": .object([:])
            ]),
            error: nil
        )
    }
}

final class ImportBridgeTests:
XCTestCase {
    func testImportPreviewDecodes()
    async throws {
        let bridge = CoreBridge(
            transport:
                ImportMockTransport()
        )

        let preview =
            try await bridge.importPreview(
                name: "notes.md",
                content: "# Notes"
            )

        XCTAssertEqual(
            preview.format,
            .markdown
        )
        XCTAssertEqual(
            preview.title,
            "Notes"
        )
    }
}
