import XCTest
import KnowledgeOSCoreBridge
@testable import KnowledgeOSMac

actor TestTransport: CoreTransport {
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
                "runtimeState":
                    .string("running"),
                "engines": .array([])
            ]),
            error: nil
        )
    }
}

final class ApplicationBootstrapperTests:
XCTestCase {
    func testBootstrapperStartsAndStops()
    async throws {
        let bridge = CoreBridge(
            transport: TestTransport()
        )

        let services = AppServices(
            bridge: bridge,
            library:
                CoreLibraryAdapter(
                    bridge: bridge
                ),
            search:
                CoreSearchAdapter(
                    bridge: bridge
                ),
            document: CoreDocumentAdapter(bridge: bridge),
            annotations: CoreAnnotationAdapter(bridge: bridge),
            workspace:
                CoreWorkspaceAdapter(
                    bridge: bridge
                ),
            ai:
                CoreAIAdapter(
                    bridge: bridge
                ),
            graph:
                CoreKnowledgeGraphAdapter(
                    bridge: bridge
                )
        )

        let bootstrapper =
            ApplicationBootstrapper {
                services
            }

        try await bootstrapper.start()

        let running =
            await bootstrapper.runningState()

        XCTAssertTrue(running)

        await bootstrapper.stop()

        let stopped =
            await bootstrapper.runningState()

        XCTAssertFalse(stopped)
    }
}
