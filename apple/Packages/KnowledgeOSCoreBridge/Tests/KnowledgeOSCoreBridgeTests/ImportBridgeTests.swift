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
    func testDecodesCanonicalTypeScriptV2Fixture() throws {
        let fixtureSource = try String(
            contentsOf: repositoryRoot()
                .appendingPathComponent("packages/contracts/src/import.ts"),
            encoding: .utf8
        )
        let expression = try NSRegularExpression(
            pattern: #"STAGED_IMPORT_V2_FIXTURE_JSON\s*=\s*\n?\s*\"((?:\\.|[^\"\\])*)\""#
        )
        let range = NSRange(fixtureSource.startIndex..., in: fixtureSource)
        let match = try XCTUnwrap(expression.firstMatch(in: fixtureSource, range: range))
        let encodedLiteral = String(fixtureSource[Range(match.range(at: 1), in: fixtureSource)!])
        let json = try XCTUnwrap(
            try JSONSerialization.jsonObject(
                with: Data("\"\(encodedLiteral)\"".utf8),
                options: .fragmentsAllowed
            ) as? String
        )

        let decoded = try JSONDecoder().decode(
            StagedImportRequestV2DTO.self,
            from: Data(json.utf8)
        )

        XCTAssertEqual(decoded.contractVersion, 2)
        XCTAssertEqual(decoded.operationId, "operation-1")
        XCTAssertEqual(decoded.idempotencyKey, "key-1")
        XCTAssertEqual(decoded.source.kind, "staged-file")
        XCTAssertEqual(decoded.source.capability, "fixture-capability-token")
        XCTAssertEqual(decoded.name, "notes.md")
        XCTAssertEqual(decoded.byteLength, 5)
        XCTAssertEqual(decoded.sha256, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824")
    }

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

    private func repositoryRoot() -> URL {
        var directory = URL(fileURLWithPath: #filePath)
        for _ in 0..<6 {
            directory.deleteLastPathComponent()
        }
        return directory
    }
}
