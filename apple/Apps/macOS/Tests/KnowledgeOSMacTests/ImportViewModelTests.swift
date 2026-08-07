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

actor StagedImportHarnessTransport: CoreTransport {
    private var stagedCapability: String?

    func start() async throws {}
    func stop() async {}

    func send(_ request: CoreRequest) async throws -> CoreResponse {
        guard case let .object(parameters)? = request.params,
              case let .object(source)? = parameters["source"],
              case let .string(capability)? = source["capability"] else {
            throw CoreBridgeError.invalidResponse
        }
        stagedCapability = capability
        return CoreResponse(
            version: CoreProtocol.version,
            id: request.id,
            result: .object([
                "operationId": .string("operation-1"),
                "leaseId": .string("lease-1"),
                "state": .string("ProcessingQueued")
            ]),
            error: nil
        )
    }

    func capturedCapability() -> String? { stagedCapability }
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

    func testQueuedImportKeepsItsLeaseReadableUntilRelease() async throws {
        let root = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        defer { try? FileManager.default.removeItem(at: root) }
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        let input = root.appendingPathComponent("notes.md")
        try Data("# Notes".utf8).write(to: input)
        let staging = ImportStagingService(root: root)
        let transport = StagedImportHarnessTransport()
        let viewModel = ImportViewModel(
            bridge: CoreBridge(transport: transport),
            staging: staging
        )

        await viewModel.importFile(url: input)

        let capturedCapability = await transport.capturedCapability()
        let capability = try XCTUnwrap(capturedCapability)
        let leaseSource = root.appendingPathComponent("Staging")
            .appendingPathComponent(capability)
            .appendingPathComponent("source")
        XCTAssertNil(viewModel.errorMessage)
        XCTAssertEqual(try Data(contentsOf: leaseSource), Data("# Notes".utf8))

        staging.releaseOwnership(for: capability)

        XCTAssertFalse(FileManager.default.fileExists(atPath: leaseSource.path))
    }
}
#endif
