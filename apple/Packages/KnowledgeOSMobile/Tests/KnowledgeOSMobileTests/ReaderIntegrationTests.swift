import XCTest
@testable import KnowledgeOSMobile

final class ReaderIntegrationTests: XCTestCase {
    func testReaderRestoresSessionAndPreferences() async throws {
        let directory = FileManager.default.temporaryDirectory.appending(path: UUID().uuidString)
        let store = try MobileLocalStore(directory: directory)
        let item = MobileLibraryItem(id: "doc:reader", title: "Reader", summary: "# One\nFirst\n# Two\nSecond", availability: .local, localContent: "# One\nFirst\n# Two\nSecond")
        try await store.replaceLibrary([item])
        let manager = ReaderSessionManager(store: store)
        let opened = try await manager.open(item)
        XCTAssertEqual(opened.0.sections.count, 2)
        try await manager.updatePosition(documentId: item.id, sectionId: "section:1", anchor: "section-1", progress: 0.7)
        try await manager.savePreferences(documentId: item.id, preferences: .init(theme: .sepia, fontScale: 1.3))
        let restored = try MobileLocalStore(directory: directory)
        let snapshot = await restored.current()
        XCTAssertEqual(snapshot.readerSessions[item.id]?.progress, 0.7)
        XCTAssertEqual(snapshot.readerPreferences[item.id]?.theme, .sepia)
    }

    func testAnnotationsBookmarksAndSearchPersist() async throws {
        let directory = FileManager.default.temporaryDirectory.appending(path: UUID().uuidString)
        let store = try MobileLocalStore(directory: directory)
        let manager = ReaderSessionManager(store: store)
        let item = MobileLibraryItem(id: "doc:a", title: "A", summary: "Knowledge graphs connect documents", availability: .local, localContent: "Knowledge graphs connect documents")
        let opened = try await manager.open(item)
        XCTAssertEqual(manager.search("graphs", in: opened.0).count, 1)
        _ = try await manager.addBookmark(documentId: item.id, sectionId: "section:0", anchor: "section-0", title: "Start")
        _ = try await manager.addAnnotation(documentId: item.id, sectionId: "section:0", anchor: "section-0", selectedText: "Knowledge graphs", note: "Important", style: .highlight, color: .yellow)
        let snapshot = await store.current()
        XCTAssertEqual(snapshot.bookmarks.count, 1)
        XCTAssertEqual(snapshot.readerAnnotations.count, 1)
        XCTAssertEqual(snapshot.offlineOperations.count, 2)
    }
}
