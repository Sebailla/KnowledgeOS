import XCTest
@testable import KnowledgeOSCoreBridge

actor MockTransport: CoreTransport {
    let response: CoreResponse

    init(response: CoreResponse) {
        self.response = response
    }

    func start() async throws {}
    func stop() async {}

    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        CoreResponse(
            version: response.version,
            id: request.id,
            result: response.result,
            error: response.error
        )
    }
}

final class BridgeTests: XCTestCase {
    func testHealth() async throws {
        let bridge = CoreBridge(
            transport: MockTransport(
                response: CoreResponse(
                    version: "1.0",
                    id: "x",
                    result: .object([
                        "status": .string("ok"),
                        "runtimeState":
                            .string("running"),
                        "engines": .array([])
                    ]),
                    error: nil
                )
            )
        )

        try await bridge.start()

        let health = try await bridge.health()

        XCTAssertEqual(health.status, "ok")
    }

    func testRemoteError() async {
        let bridge = CoreBridge(
            transport: MockTransport(
                response: CoreResponse(
                    version: "1.0",
                    id: "x",
                    result: nil,
                    error: .init(
                        code: "FAILED",
                        message: "Failure"
                    )
                )
            )
        )

        do {
            _ = try await bridge.search("x")
            XCTFail("Expected failure")
        } catch let error as CoreBridgeError {
            XCTAssertEqual(
                error,
                .remote(
                    code: "FAILED",
                    message: "Failure"
                )
            )
        } catch {
            XCTFail("Unexpected error")
        }
    }
}
