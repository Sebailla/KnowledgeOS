import XCTest
@testable import KnowledgeOSCoreBridge

actor ApplicationIntegrationMock:
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
                "status": .string("ok"),
                "phase": .string("ready"),
                "protocolVersion":
                    .string("1.0"),
                "hostVersion":
                    .string("1.0.0"),
                "startedAt":
                    .string("2026-08-04"),
                "uptimeMilliseconds":
                    .number(100),
                "services": .array([])
            ]),
            error: nil
        )
    }
}

final class ApplicationIntegrationBridgeTests:
XCTestCase {
    func testApplicationStatusDecodes()
    async throws {
        let bridge = CoreBridge(
            transport:
                ApplicationIntegrationMock()
        )

        let status =
            try await bridge
                .applicationStatus()

        XCTAssertEqual(
            status.phase,
            "ready"
        )
        XCTAssertEqual(
            status.protocolVersion,
            "1.0"
        )
    }
}
