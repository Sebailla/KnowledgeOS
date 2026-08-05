#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class AppModel: ObservableObject {
    enum State: Equatable {
        case idle
        case starting
        case running
        case failed(String)
        case stopped
    }

    @Published private(set)
    var state: State = .idle

    @Published var selectedSidebarItem:
        SidebarItem = .library {
        didSet {
            persistPreferences()
        }
    }

    @Published var searchText = ""
    @Published var activeWorkspaceName =
        "Research"

    @Published var isInspectorVisible = true {
        didSet {
            persistPreferences()
        }
    }

    @Published var openDocumentID:
        String? {
        didSet {
            persistPreferences()
        }
    }

    @Published private(set)
    var libraryViewModel:
        LibraryViewModel?

    @Published private(set)
    var documentReaderViewModel:
        DocumentReaderViewModel?

    @Published private(set)
    var annotationViewModel:
        AnnotationViewModel?

    @Published private(set)
    var persistenceViewModel:
        PersistenceViewModel?

    @Published private(set)
    var syncViewModel:
        SyncViewModel?

    @Published private(set)
    var conflictViewModel:
        ConflictViewModel?

    @Published private(set)
    var knowledgeGraphViewModel:
        KnowledgeGraphViewModel?

    @Published private(set)
    var localSearchViewModel:
        LocalSearchViewModel?

    @Published private(set)
    var transportViewModel:
        TransportViewModel?

    @Published private(set)
    var aiAssistantViewModel:
        AIAssistantViewModel?

    @Published private(set)
    var importViewModel:
        ImportViewModel?

    @Published private(set)
    var exportViewModel:
        ExportViewModel?

    @Published private(set)
    var applicationStatusViewModel:
        ApplicationStatusViewModel?

    let bootstrapper:
        ApplicationBootstrapper

    let preferences:
        PreferencesStore

    init(
        bootstrapper:
            ApplicationBootstrapper,
        preferences:
            PreferencesStore =
                UserDefaultsPreferencesStore()
    ) {
        self.bootstrapper = bootstrapper
        self.preferences = preferences
        restorePreferences()
    }

    func start() async {
        guard
            state == .idle ||
            state == .stopped ||
            isFailed
        else {
            return
        }

        state = .starting

        do {
            try await bootstrapper.start()

            guard let bridge =
                await bootstrapper.coreBridge()
            else {
                throw ApplicationBootstrapper
                    .BootstrapError
                    .coreUnavailable
            }

            if let service =
                await bootstrapper
                    .annotationService() {
                annotationViewModel =
                    AnnotationViewModel(
                        service: service
                    )
            }

            if let service =
                await bootstrapper
                    .documentService() {
                documentReaderViewModel =
                    DocumentReaderViewModel(
                        service: service
                    )
            }

            if let service =
                await bootstrapper
                    .libraryService() {
                libraryViewModel =
                    LibraryViewModel(
                        service: service
                    )
            }

            persistenceViewModel =
                PersistenceViewModel(
                    bridge: bridge
                )

            syncViewModel =
                SyncViewModel(
                    bridge: bridge
                )

            conflictViewModel =
                ConflictViewModel(
                    bridge: bridge
                )

            knowledgeGraphViewModel =
                KnowledgeGraphViewModel(
                    bridge: bridge
                )

            localSearchViewModel =
                LocalSearchViewModel(
                    bridge: bridge
                )

            transportViewModel =
                TransportViewModel(
                    bridge: bridge
                )

            aiAssistantViewModel =
                AIAssistantViewModel(
                    bridge: bridge
                )

            importViewModel =
                ImportViewModel(
                    bridge: bridge
                )

            exportViewModel =
                ExportViewModel(
                    bridge: bridge
                )

            applicationStatusViewModel =
                ApplicationStatusViewModel(
                    bridge: bridge
                )

            async let persistence:
                Void? =
                persistenceViewModel?
                    .refresh()

            async let synchronization:
                Void? =
                syncViewModel?
                    .refresh()

            async let conflicts:
                Void? =
                conflictViewModel?
                    .refresh()

            async let transport:
                Void? =
                transportViewModel?
                    .load()

            async let application:
                Void? =
                applicationStatusViewModel?
                    .refresh()

            _ = await (
                persistence,
                synchronization,
                conflicts,
                transport,
                application
            )

            state = .running
        } catch {
            await bootstrapper.stop()
            state =
                .failed(
                    error.localizedDescription
                )
        }
    }

    func retryStart() async {
        await bootstrapper.stop()
        state = .stopped
        await start()
    }

    func stop() async {
        persistPreferences()
        await bootstrapper.stop()
        state = .stopped
    }

    func select(
        _ item: SidebarItem
    ) {
        openDocumentID = nil
        selectedSidebarItem = item
    }

    func openDocument(
        id: String
    ) {
        openDocumentID = id
    }

    func closeDocument() {
        openDocumentID = nil
    }

    func toggleInspector() {
        isInspectorVisible.toggle()
    }

    private var isFailed: Bool {
        if case .failed = state {
            return true
        }

        return false
    }

    private func restorePreferences() {
        selectedSidebarItem =
            SidebarItem(
                rawValue:
                    preferences.string(
                        forKey:
                            "selectedSidebarItem"
                    ) ?? ""
            ) ?? .library

        activeWorkspaceName =
            preferences.string(
                forKey:
                    "activeWorkspaceName"
            ) ?? "Research"

        isInspectorVisible =
            preferences.bool(
                forKey:
                    "isInspectorVisible",
                defaultValue: true
            )

        openDocumentID =
            preferences.string(
                forKey:
                    "openDocumentID"
            )
    }

    private func persistPreferences() {
        preferences.set(
            selectedSidebarItem.rawValue,
            forKey:
                "selectedSidebarItem"
        )

        preferences.set(
            activeWorkspaceName,
            forKey:
                "activeWorkspaceName"
        )

        preferences.set(
            isInspectorVisible,
            forKey:
                "isInspectorVisible"
        )

        preferences.set(
            openDocumentID,
            forKey:
                "openDocumentID"
        )
    }
}
#endif
