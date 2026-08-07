import XCTest
@testable import KnowledgeOSCoreBridge

actor TransportMock: CoreTransport {
    func start() async throws {}
    func stop() async {}

    func send(_ request: CoreRequest) async throws -> CoreResponse {
        response(for: request)
    }
}

final class TransportBridgeTests: XCTestCase {
    func testHealthDecodes() async throws {
        let bridge = CoreBridge(transport: TransportMock())
        let health = try await bridge.testTransport()
        XCTAssertEqual(health.protocolVersion, "1.0")
        XCTAssertTrue(health.authenticated)
    }

    func testFragmentedAndCoalescedFramesRemainOrdered() async throws {
        let controller = try await controller(script: #"read one; read two; printf '{\"version\":\"1.0\",\"id\":\"one\",\"result\":{\"value\":1}}'; sleep 0.01; printf '\n{\"version\":\"1.0\",\"id\":\"two\",\"result\":{\"value\":2}}\n'"#)
        defer { Task { await controller.stop() } }

        async let firstResponse = controller.send(request("one"))
        async let secondResponse = controller.send(request("two"))
        let (first, second) = try await (firstResponse, secondResponse)
        XCTAssertEqual(first.result, .object(["value": .number(1)]))
        XCTAssertEqual(second.result, .object(["value": .number(2)]))
    }

    func testMalformedFrameResetsBeforeRestart() async throws {
        let controller = try await controller(script: "read line; printf 'not-json\\n'")
        await XCTAssertThrowsErrorAsync(try await controller.send(request("bad"))) { error in
            XCTAssertEqual(error as? CoreBridgeError, .invalidResponse)
        }
        await controller.stop()
        try await controller.start()
        await XCTAssertThrowsErrorAsync(try await controller.send(request("bad-again"))) { error in
            XCTAssertEqual(error as? CoreBridgeError, .invalidResponse)
        }
    }

    func testSilentPeerTimesOut() async throws {
        let controller = try await controller(script: "read line; sleep 1", timeout: 0.05)
        defer { Task { await controller.stop() } }
        await XCTAssertThrowsErrorAsync(try await controller.send(request("timeout"))) { error in
            XCTAssertEqual(error as? CoreBridgeError, .timeout)
        }
    }

    func testTerminatedPeerFailsRequest() async throws {
        let controller = try await controller(script: "read line; exit 0")
        defer { Task { await controller.stop() } }
        await XCTAssertThrowsErrorAsync(try await controller.send(request("terminated"))) { error in
            XCTAssertEqual(error as? CoreBridgeError, .terminated)
        }
    }

    func testWriteAfterPeerExitFailsAsUnavailable() async throws {
        let controller = try await controller(script: "exit 0")
        defer { Task { await controller.stop() } }
        try await Task.sleep(for: .milliseconds(20))
        await XCTAssertThrowsErrorAsync(try await controller.send(request("write"))) { error in
            XCTAssertEqual(error as? CoreBridgeError, .unavailable)
        }
    }

    func testCancellationSettlesRequest() async throws {
        let controller = try await controller(script: "read line; sleep 1")
        defer { Task { await controller.stop() } }
        let task = Task { try await controller.send(request("cancelled")) }
        try await Task.sleep(for: .milliseconds(20))
        task.cancel()
        await XCTAssertThrowsErrorAsync(try await task.value) { error in
            XCTAssertEqual(error as? CoreBridgeError, .cancelled)
        }
    }

    func testRestartFailsAllPriorRequestsAndStartsEmpty() async throws {
        let controller = try await controller(script: "read line; sleep 1")
        let first = Task { try await controller.send(request("one")) }
        let second = Task { try await controller.send(request("two")) }
        try await Task.sleep(for: .milliseconds(20))
        await controller.stop()
        await XCTAssertThrowsErrorAsync(try await first.value) { error in
            XCTAssertEqual(error as? CoreBridgeError, .terminated)
        }
        await XCTAssertThrowsErrorAsync(try await second.value) { error in
            XCTAssertEqual(error as? CoreBridgeError, .terminated)
        }
        try await controller.start()
        await controller.stop()
    }

    private func controller(script: String, timeout: TimeInterval = 1) async throws -> CoreProcessController {
        let controller = CoreProcessController(executableURL: URL(fileURLWithPath: "/bin/sh"), arguments: ["-c", script], timeout: timeout)
        try await controller.start()
        return controller
    }

    private func request(_ id: String) -> CoreRequest {
        CoreRequest(id: id, method: "test")
    }
}

private func response(for request: CoreRequest) -> CoreResponse {
    CoreResponse(version: CoreProtocol.version, id: request.id, result: .object([
        "status": .string("ok"), "protocolVersion": .string("1.0"),
        "serverVersion": .string("1.0.0"), "latencyMilliseconds": .number(5),
        "authenticated": .bool(true)
    ]), error: nil)
}

private func XCTAssertThrowsErrorAsync<T>(
    _ expression: @autoclosure () async throws -> T,
    _ verify: (Error) -> Void
) async {
    do {
        _ = try await expression()
        XCTFail("Expected an error")
    } catch {
        verify(error)
    }
}
