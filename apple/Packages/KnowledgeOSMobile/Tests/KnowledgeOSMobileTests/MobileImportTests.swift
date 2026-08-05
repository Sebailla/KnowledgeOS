import XCTest
@testable import KnowledgeOSMobile

final class MobileImportTests: XCTestCase {
    func testImportPersistsLibraryJobAndOperation() async throws {
        let directory=FileManager.default.temporaryDirectory.appending(path:UUID().uuidString)
        let store=try MobileLocalStore(directory:directory)
        let importer=try MobileImportCoordinator(store:store,directory:directory)
        let result=try await importer.importData(name:"Notes.md",data:Data("# Notes\nBody".utf8))
        XCTAssertEqual(result.job.state,.completed)
        XCTAssertEqual(result.job.checksum.count,64)
        let snapshot=await store.current()
        XCTAssertEqual(snapshot.library.count,1)
        XCTAssertEqual(snapshot.importJobs.count,1)
        XCTAssertEqual(snapshot.offlineOperations.count,1)
    }

    func testDuplicateAndUnsafeFilesAreRejected() async throws {
        let directory=FileManager.default.temporaryDirectory.appending(path:UUID().uuidString)
        let store=try MobileLocalStore(directory:directory)
        let importer=try MobileImportCoordinator(store:store,directory:directory)
        let data=Data("same".utf8)
        _=try await importer.importData(name:"one.txt",data:data)
        let duplicate=try await importer.importData(name:"two.txt",data:data)
        XCTAssertEqual(duplicate.job.state,.duplicate)
        do { _=try await importer.importData(name:"run.command",data:data); XCTFail("Expected rejection") } catch { XCTAssertEqual(error as? MobileImportError,.executableRejected) }
    }

    func testSharedRequestIsProcessed() async throws {
        let directory=FileManager.default.temporaryDirectory.appending(path:UUID().uuidString)
        let store=try MobileLocalStore(directory:directory)
        try await store.saveShareRequest(.init(originalName:"Shared.txt",textContent:"Shared body"))
        let importer=try MobileImportCoordinator(store:store,directory:directory)
        let results=await importer.processSharedRequests()
        XCTAssertEqual(results.count,1)
        let snapshot = await store.current()
        XCTAssertTrue(snapshot.shareRequests.isEmpty)
    }
}
