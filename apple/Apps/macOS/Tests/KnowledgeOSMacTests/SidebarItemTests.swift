import XCTest
@testable import KnowledgeOSMac

final class SidebarItemTests: XCTestCase {
    func testSidebarItemsHaveTitlesAndImages() {
        for item in SidebarItem.allCases {
            XCTAssertFalse(item.title.isEmpty)
            XCTAssertFalse(item.systemImage.isEmpty)
        }
    }
}
