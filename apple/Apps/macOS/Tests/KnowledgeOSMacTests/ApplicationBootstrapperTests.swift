import XCTest
@testable import KnowledgeOSMac

final class ApplicationBootstrapperTests: XCTestCase {
    func testBootstrapperStartsAndStops() async throws {
        let bootstrapper = ApplicationBootstrapper()

        try await bootstrapper.start()
        let running = await bootstrapper.isRunning

        XCTAssertTrue(running)

        await bootstrapper.stop()
        let stopped = await bootstrapper.isRunning

        XCTAssertFalse(stopped)
    }
}
