import XCTest
@testable import KnowledgeOSCoreBridge

final class UniversalSyncProtocolTests: XCTestCase {
    func testOperationDecodes() throws {
        let data = #"{"operationId":"op:1","protocolVersion":"1.0","entityType":"bookmark","operationType":"create","entityId":"bookmark:1","deviceId":"device:1","userId":"user:1","sequence":1,"timestamp":"2026-08-04T00:00:00.000Z","payload":{},"checksum":"abcd"}"#.data(using: .utf8)!
        let operation = try JSONDecoder().decode(USPOperationDTO.self, from: data)
        XCTAssertEqual(operation.operationId, "op:1")
        XCTAssertEqual(operation.protocolVersion, "1.0")
    }
}
