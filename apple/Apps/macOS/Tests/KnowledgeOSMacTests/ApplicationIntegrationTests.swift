#if canImport(SwiftUI)
import XCTest
import KnowledgeOSCoreBridge
@testable import KnowledgeOSMac

final class MemoryPreferences:
PreferencesStore {
    var values:
        [String: Any] = [:]

    func string(
        forKey key: String
    ) -> String? {
        values[key] as? String
    }

    func bool(
        forKey key: String,
        defaultValue: Bool
    ) -> Bool {
        values[key] as? Bool
            ?? defaultValue
    }

    func set(
        _ value: Any?,
        forKey key: String
    ) {
        values[key] = value
    }
}

@MainActor
final class ApplicationIntegrationTests:
XCTestCase {
    func testSessionPreferencesRestore()
    async {
        let preferences =
            MemoryPreferences()

        preferences.values[
            "selectedSidebarItem"
        ] = "search"

        preferences.values[
            "openDocumentID"
        ] = "document:1"

        let model = AppModel(
            bootstrapper:
                ApplicationBootstrapper(),
            preferences: preferences
        )

        XCTAssertEqual(
            model.selectedSidebarItem,
            .search
        )

        XCTAssertEqual(
            model.openDocumentID,
            "document:1"
        )
    }
}
#endif
