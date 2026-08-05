import XCTest
@testable import KnowledgeOSMobile

final class MobileExportHandoffTests: XCTestCase {
    func testExportPersistsManifest() async throws {
        let directory = FileManager.default.temporaryDirectory
            .appending(path: UUID().uuidString)
        let store = try MobileLocalStore(directory: directory)
        let exporter = try MobileExportCoordinator(
            store: store,
            directory: directory
        )
        let item = MobileLibraryItem(
            id: "doc:1",
            title: "KnowledgeOS",
            availability: .local,
            localContent: "Offline first"
        )

        let job = try await exporter.export(
            document: item,
            format: .markdown
        )
        let history = await exporter.history()

        XCTAssertEqual(job.state, MobileExportState.completed)
        XCTAssertEqual(job.checksum?.count, 64)
        XCTAssertEqual(history.count, 1)
    }

    func testDeepLinksRoundTrip() {
        let link = MobileDeepLink.document(
            id: "doc:1",
            anchor: "a1"
        )
        let url = MobileDeepLinkRouter.url(for: link)!

        XCTAssertEqual(MobileDeepLinkRouter.parse(url), link)
        XCTAssertNil(
            MobileDeepLinkRouter.parse(
                URL(string: "https://example.com")!
            )
        )
    }
}
