import XCTest
@testable import KnowledgeOSMac

final class ReleaseEnvironmentTests: XCTestCase {
    func testApplicationSupportDirectoryExists()
    throws {
        let directory = try ReleaseEnvironment
            .applicationSupportDirectory()

        XCTAssertTrue(
            FileManager.default.fileExists(
                atPath: directory.path
            )
        )
    }

}
