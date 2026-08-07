import XCTest
@testable import KnowledgeOSMac

final class ImportStagingServiceTests: XCTestCase {
    func testStagesAtomicallyWithContentFreeMetadataAndHash() throws {
        let root = try temporaryRoot()
        defer { try? FileManager.default.removeItem(at: root) }
        let source = root.appendingPathComponent("input.md")
        try Data("hello staging".utf8).write(to: source)
        let staged = try ImportStagingService(root: root, retention: 60).stage(source: source)
        XCTAssertEqual(try Data(contentsOf: staged.sourceURL), Data("hello staging".utf8))
        XCTAssertEqual(staged.byteLength, 13)
        XCTAssertEqual(staged.sha256, "30165626038efbd79a01bffaf79a3725b23ad0f52d22d89449bebf7a220b34a0")
        let metadata = try String(contentsOf: staged.metadataURL)
        XCTAssertFalse(metadata.contains("hello staging"))
        XCTAssertFalse(metadata.contains(source.path))
    }

    func testRestartAndSuccessfulCleanupRemoveMacOSOwnedEntries() throws {
        let root = try temporaryRoot()
        defer { try? FileManager.default.removeItem(at: root) }
        let service = ImportStagingService(root: root, retention: 60)
        let staged = try service.stage(bytes: Data("source".utf8), name: "source.txt")
        try service.cleanup(now: Date())
        XCTAssertFalse(FileManager.default.fileExists(atPath: staged.entryURL.path))
        let restarted = ImportStagingService(root: root, retention: 60)
        let stale = try restarted.stage(bytes: Data("stale".utf8), name: "stale.txt")
        try restarted.cleanupForRestart()
        XCTAssertFalse(FileManager.default.fileExists(atPath: stale.entryURL.path))
    }

    func testRetentionAndAcceptedLeaseOwnership() throws {
        let root = try temporaryRoot()
        defer { try? FileManager.default.removeItem(at: root) }
        let service = ImportStagingService(root: root, retention: 60)
        let retained = try service.stage(bytes: Data("retry".utf8), name: "retry.txt", recoverableFailure: true)
        try service.cleanup(now: Date(timeIntervalSinceNow: 30))
        XCTAssertTrue(FileManager.default.fileExists(atPath: retained.entryURL.path))
        try service.cleanup(now: Date(timeIntervalSinceNow: 61))
        XCTAssertFalse(FileManager.default.fileExists(atPath: retained.entryURL.path))
        let accepted = try service.stage(bytes: Data("lease".utf8), name: "lease.txt")
        try service.transferCleanupOwnership(for: accepted.capability)
        try service.cleanup(now: Date(timeIntervalSinceNow: 120))
        XCTAssertTrue(FileManager.default.fileExists(atPath: accepted.sourceURL.path))
        service.releaseOwnership(for: accepted.capability)
        XCTAssertFalse(FileManager.default.fileExists(atPath: accepted.entryURL.path))
    }

    func testAcceptedLeaseSurvivesRestartUntilExplicitRelease() throws {
        let root = try temporaryRoot()
        defer { try? FileManager.default.removeItem(at: root) }

        let service = ImportStagingService(root: root, retention: 60)
        let accepted = try service.stage(bytes: Data("lease".utf8), name: "lease.txt")
        try service.transferCleanupOwnership(for: accepted.capability)

        let restarted = ImportStagingService(root: root, retention: 60)
        try restarted.cleanupForRestart()

        XCTAssertEqual(try Data(contentsOf: accepted.sourceURL), Data("lease".utf8))
        restarted.releaseOwnership(for: accepted.capability)
        XCTAssertFalse(FileManager.default.fileExists(atPath: accepted.entryURL.path))
    }

    private func temporaryRoot() throws -> URL {
        let root = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        return root
    }
}
