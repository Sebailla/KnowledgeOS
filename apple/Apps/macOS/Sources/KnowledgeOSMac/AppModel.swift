#if canImport(SwiftUI)
import SwiftUI

@MainActor
final class AppModel: ObservableObject {
    enum State: Equatable {
        case idle
        case starting
        case running
        case failed(String)
        case stopped
    }

    @Published private(set) var state: State = .idle
    @Published var selectedSidebarItem: SidebarItem = .library
    @Published var searchText = ""
    @Published var activeWorkspaceName = "Research"
    @Published var isInspectorVisible = true

    let bootstrapper: ApplicationBootstrapper
    let preferences: PreferencesStore

    init(
        bootstrapper: ApplicationBootstrapper,
        preferences: PreferencesStore = UserDefaultsPreferencesStore()
    ) {
        self.bootstrapper = bootstrapper
        self.preferences = preferences
        restorePreferences()
    }

    func start() async {
        guard state == .idle || state == .stopped else {
            return
        }

        state = .starting

        do {
            try await bootstrapper.start()
            state = .running
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func stop() async {
        await bootstrapper.stop()
        persistPreferences()
        state = .stopped
    }

    func toggleInspector() {
        isInspectorVisible.toggle()
        persistPreferences()
    }

    private func restorePreferences() {
        selectedSidebarItem =
            SidebarItem(
                rawValue: preferences.string(forKey: "selectedSidebarItem") ?? ""
            ) ?? .library

        activeWorkspaceName =
            preferences.string(forKey: "activeWorkspaceName") ?? "Research"

        isInspectorVisible =
            preferences.bool(
                forKey: "isInspectorVisible",
                defaultValue: true
            )
    }

    private func persistPreferences() {
        preferences.set(
            selectedSidebarItem.rawValue,
            forKey: "selectedSidebarItem"
        )

        preferences.set(
            activeWorkspaceName,
            forKey: "activeWorkspaceName"
        )

        preferences.set(
            isInspectorVisible,
            forKey: "isInspectorVisible"
        )
    }
}

#endif
