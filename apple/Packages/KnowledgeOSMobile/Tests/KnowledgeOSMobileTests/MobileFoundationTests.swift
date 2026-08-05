import XCTest
@testable import KnowledgeOSMobile

final class MobileFoundationTests: XCTestCase {
    func testLocalStorePersistsLibraryAndReadingData() async throws {
        let directory = FileManager.default.temporaryDirectory
            .appending(path: UUID().uuidString)
        let store = try MobileLocalStore(directory: directory)

        try await store.replaceLibrary([
            MobileLibraryItem(
                id: "doc:1",
                title: "KnowledgeOS",
                availability: .local,
                localContent: "Body"
            )
        ])
        try await store.saveBookmark(
            .init(
                id: "bookmark:1",
                documentId: "doc:1",
                locator: "p1",
                title: nil,
                updatedAt: "now"
            )
        )
        try await store.savePosition(
            .init(
                documentId: "doc:1",
                locator: "p1",
                progress: 0.4,
                updatedAt: "now"
            )
        )

        let restored = try MobileLocalStore(directory: directory)
        let snapshot = await restored.current()

        XCTAssertEqual(snapshot.library.first?.localContent, "Body")
        XCTAssertEqual(snapshot.bookmarks.count, 1)
        XCTAssertEqual(snapshot.positions["doc:1"]?.progress, 0.4)
    }

    func testQueueIsIdempotent() async throws {
        let directory = FileManager.default.temporaryDirectory
            .appending(path: UUID().uuidString)
        let store = try MobileLocalStore(directory: directory)
        let operation = OfflineOperation(
            id: "op:1",
            method: "POST",
            payload: Data("{}".utf8),
            idempotencyKey: "key:1",
            createdAt: "now"
        )

        try await store.enqueue(operation)
        try await store.enqueue(operation)

        let snapshot = await store.current()
        XCTAssertEqual(snapshot.offlineOperations.count, 1)
    }

    func testCorruptPrimaryRecoversFromBackup() async throws {
        let directory = FileManager.default.temporaryDirectory
            .appending(path: UUID().uuidString)
        let store = try MobileLocalStore(directory: directory)

        try await store.replaceLibrary([
            .init(id: "doc:1", title: "One")
        ])
        try await store.replaceLibrary([
            .init(id: "doc:2", title: "Two")
        ])

        try Data("broken".utf8).write(
            to: directory.appending(path: "mobile-state-v2.json")
        )

        let restored = try MobileLocalStore(directory: directory)
        let snapshot = await restored.current()
        XCTAssertFalse(snapshot.library.isEmpty)
    }

    @MainActor
    func testAppBootstrapsOfflineCache() async throws {
        let directory = FileManager.default.temporaryDirectory
            .appending(path: UUID().uuidString)
        let model = MobileAppModel()

        await model.bootstrap(
            configuration: nil,
            directory: directory
        )

        XCTAssertEqual(model.phase, .needsConfiguration)
    }
}
