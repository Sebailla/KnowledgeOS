import XCTest
@testable import KnowledgeOSCoreBridge
actor DocumentMockTransport:CoreTransport { func start() async throws{}; func stop() async{}; func send(_ request:CoreRequest) async throws -> CoreResponse { CoreResponse(version:CoreProtocol.version,id:request.id,result:.object(["id":.string("d1"),"title":.string("KnowledgeOS"),"authors":.array([.string("Team")]),"pageCount":.number(2),"format":.string("markdown"),"sections":.array([]),"metadata":.object([:])]),error:nil) } }
final class DocumentBridgeTests:XCTestCase { func testDocumentDecodes() async throws { let b=CoreBridge(transport:DocumentMockTransport()); let d=try await b.openDocument(id:"d1"); XCTAssertEqual(d.pageCount,2) } }
