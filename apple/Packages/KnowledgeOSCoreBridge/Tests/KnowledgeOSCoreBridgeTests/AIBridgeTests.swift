import XCTest
@testable import KnowledgeOSCoreBridge

actor AIMock: CoreTransport {
    func start() async throws {}
    func stop() async {}

    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        CoreResponse(
            version: CoreProtocol.version,
            id: request.id,
            result: .object([
                "models": .array([])
            ]),
            error: nil
        )
    }
}

final class AIBridgeTests: XCTestCase {
    func testModelsDecode() async throws {
        let bridge = CoreBridge(
            transport: AIMock()
        )

        let models = try await bridge.aiModels()

        XCTAssertEqual(models.count, 0)
    }
}
