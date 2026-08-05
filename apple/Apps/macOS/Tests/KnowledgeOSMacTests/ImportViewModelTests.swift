#if canImport(SwiftUI)
import XCTest
import KnowledgeOSCoreBridge
@testable import KnowledgeOSMac

actor ImportViewMockTransport:
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

@MainActor
final class ImportViewModelTests:
XCTestCase {
    func testPreviewLoads()
    async {
        let viewModel =
            ImportViewModel(
                bridge: CoreBridge(
                    transport:
                        ImportViewMockTransport()
                )
            )

        await viewModel.previewFile(
            name: "notes.md",
            content: "# Notes"
        )

        XCTAssertEqual(
            viewModel.preview?.format,
            .markdown
        )
    }
}
#endif
