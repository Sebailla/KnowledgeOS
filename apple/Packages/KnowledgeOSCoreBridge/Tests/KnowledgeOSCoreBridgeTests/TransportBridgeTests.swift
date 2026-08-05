import XCTest
@testable import KnowledgeOSCoreBridge

actor TransportMock: CoreTransport {
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
                "protocolVersion":
                    .string("1.0"),
                "serverVersion":
                    .string("1.0.0"),
                "latencyMilliseconds":
                    .number(5),
                "authenticated":
                    .bool(true)
            ]),
            error: nil
        )
    }
}

final class TransportBridgeTests:
XCTestCase {
    func testHealthDecodes()
    async throws {
        let bridge = CoreBridge(
            transport: TransportMock()
        )

        let health =
            try await bridge.testTransport()

        XCTAssertEqual(
            health.protocolVersion,
            "1.0"
        )
        XCTAssertTrue(
            health.authenticated
        )
    }
}
