import XCTest
@testable import KnowledgeOSMac

final class PreferencesStoreTests: XCTestCase {
    func testPreferencesStorePersistsValues() {
        let suiteName = "KnowledgeOSMacTests.preferences"
        let defaults = UserDefaults(suiteName: suiteName)!

        defaults.removePersistentDomain(forName: suiteName)

        let store = UserDefaultsPreferencesStore(
            defaults: defaults
        )

        store.set("Research", forKey: "workspace")
        store.set(true, forKey: "inspector")

        XCTAssertEqual(
            store.string(forKey: "workspace"),
            "Research"
        )

        XCTAssertTrue(
            store.bool(
                forKey: "inspector",
                defaultValue: false
            )
        )
    }
}
