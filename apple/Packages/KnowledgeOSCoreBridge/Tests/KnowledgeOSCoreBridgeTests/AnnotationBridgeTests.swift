import XCTest
@testable import KnowledgeOSCoreBridge
actor AnnotationMockTransport:CoreTransport { func start() async throws{}; func stop() async{}; func send(_ r:CoreRequest) async throws->CoreResponse { CoreResponse(version:CoreProtocol.version,id:r.id,result:.object(["annotations":.array([])]),error:nil) } }
final class AnnotationBridgeTests:XCTestCase { func testListDecodes() async throws { let b=CoreBridge(transport:AnnotationMockTransport()); let items=try await b.listAnnotations(documentId:"d1"); XCTAssertEqual(items.count,0) } }
