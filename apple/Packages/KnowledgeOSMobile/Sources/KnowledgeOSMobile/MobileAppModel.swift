import Foundation
#if canImport(SwiftUI)
import SwiftUI
#endif

#if canImport(SwiftUI)
@MainActor
public final class MobileAppModel: ObservableObject {
    public enum Phase: Equatable {
        case launching
        case needsConfiguration
        case ready
        case offline
        case failed(String)
    }

    @Published public private(set) var phase: Phase = .launching
    @Published public private(set) var library: [MobileLibraryItem] = []
    @Published public private(set) var syncStatus = MobileSyncStatus(
        phase: "idle",
        pendingOperations: 0,
        pendingConflicts: 0,
        lastSuccessfulSync: nil,
        progress: 0,
        error: nil
    )
    @Published public var selectedDocumentID: String?
    @Published public var query = ""
    @Published public var readingSettings = MobileReadingSettings()
    @Published public private(set) var importJobs: [MobileImportJob] = []
    @Published public private(set) var searchResults: [MobileSearchResult] = []
    @Published public private(set) var graphNodes: [MobileGraphNode] = []
    @Published public private(set) var conversations: [MobileAIConversation] = []
    @Published public var aiPolicy: MobileAIContextPolicy = .localOnly

    public private(set) var store: MobileLocalStore?
    public private(set) var client: MobileHTTPClient?
    public private(set) var sync: MobileSyncCoordinator?
    public private(set) var reader: ReaderSessionManager?
    public private(set) var importer: MobileImportCoordinator?
    public private(set) var searchIndex = MobileSearchIndex()
    public private(set) var graph = MobileKnowledgeGraph()
    public private(set) var ai: MobileAIService?
    public private(set) var exporter: MobileExportCoordinator?
    public private(set) var exportJobs: [MobileExportJob] = []

    public init() {}

    public func bootstrap(
        configuration: MobileServerConfiguration?,
        directory: URL
    ) async {
        do {
            let store = try MobileLocalStore(directory: directory)
            self.store = store
            let snapshot = await store.current()
            library = snapshot.library
            readingSettings = snapshot.settings
            reader = ReaderSessionManager(store: store)
            importer = try MobileImportCoordinator(store: store, directory: directory)
            importJobs = snapshot.importJobs
            searchIndex = MobileSearchIndex(documents: snapshot.searchDocuments)
            if snapshot.searchDocuments.isEmpty { searchIndex.rebuild(from: snapshot.library); try? await store.saveSearchDocuments(searchIndex.allDocuments) }
            graph = MobileKnowledgeGraph(nodes: snapshot.graphNodes, edges: snapshot.graphEdges)
            if snapshot.graphNodes.isEmpty { graph.rebuild(from: snapshot.library); try? await store.saveGraph(nodes: graph.nodes, edges: graph.edges) }
            graphNodes = graph.nodes
            conversations = snapshot.aiConversations
            exporter = try MobileExportCoordinator(store: store, directory: directory)
            exportJobs = snapshot.exportJobs

            guard let configuration else {
                phase = .needsConfiguration
                return
            }

            let client = MobileHTTPClient(configuration: configuration)
            self.client = client
            let sync = MobileSyncCoordinator(client: client, store: store)
            self.sync = sync
            self.ai = MobileAIService(client: client, store: store)
            self.reader = ReaderSessionManager(store: store)
            phase = .ready
            syncStatus = await sync.status()
        } catch {
            phase = .failed(error.localizedDescription)
        }
    }

    public var filteredLibrary: [MobileLibraryItem] {
        query.isEmpty
            ? library
            : library.filter {
                $0.title.localizedCaseInsensitiveContains(query)
                    || $0.authors.joined(separator: " ")
                        .localizedCaseInsensitiveContains(query)
            }
    }

    public func performSearch(_ value: String) async {
        searchResults = searchIndex.search(value)
        if !value.isEmpty { try? await store?.recordSearch(value) }
    }

    public func searchGraph(_ value: String) { graphNodes = graph.search(value) }
    public func expandGraph(nodeId: String, depth: Int = 1) { graphNodes = graph.expand(from: nodeId, depth: depth).nodes }

    public func sendAI(message: String, conversationId: String? = nil, modelId: String = "remote:default", sourceIds: [String] = []) async {
        guard let ai else { return }
        if let conversation = try? await ai.send(message: message, conversationId: conversationId, modelId: modelId, policy: aiPolicy, sourceIds: sourceIds) {
            conversations.removeAll { $0.id == conversation.id }
            conversations.insert(conversation, at: 0)
        }
    }

    public func synchronize() async {
        guard let sync else { return }
        await sync.synchronize()
        syncStatus = await sync.status()
        if let store {
            library = await store.current().library
        }
    }

    public func toggleFavorite(_ id: String) async {
        guard
            let store,
            let item = library.first(where: { $0.id == id })
        else { return }

        try? await store.setFavorite(
            documentId: id,
            value: !item.favorite
        )
        library = await store.current().library
    }

    public func markAvailableOffline(
        _ id: String,
        content: String
    ) async {
        guard
            let store,
            var item = library.first(where: { $0.id == id })
        else { return }

        item.availability = .local
        item.localContent = content
        try? await store.upsertLibraryItem(item)
        library = await store.current().library
    }

    public func recordPosition(
        documentId: String,
        locator: String,
        progress: Double
    ) async {
        guard let store else { return }
        let now = ISO8601DateFormatter().string(from: Date())
        let position = MobileReadingPosition(
            documentId: documentId,
            locator: locator,
            progress: progress,
            updatedAt: now
        )
        try? await store.savePosition(position)
        try? await store.markRecent(documentId: documentId)
    }

    public func saveReadingSettings() async {
        try? await store?.saveSettings(readingSettings)
    }

    public func openReader(documentId: String) async -> (MobileReaderDocument, MobileReaderSession)? {
        guard let item = library.first(where: { $0.id == documentId }), let reader else { return nil }
        return try? await reader.open(item)
    }

    public func addBookmark(documentId: String, sectionId: String, anchor: String, title: String?) async {
        _ = try? await reader?.addBookmark(documentId: documentId, sectionId: sectionId, anchor: anchor, title: title)
        syncStatus.pendingOperations = await store?.current().offlineOperations.count ?? syncStatus.pendingOperations
    }

    public func addAnnotation(documentId: String, sectionId: String, anchor: String, text: String, note: String?, style: MobileAnnotationStyle, color: MobileAnnotationColor) async {
        _ = try? await reader?.addAnnotation(documentId: documentId, sectionId: sectionId, anchor: anchor, selectedText: text, note: note, style: style, color: color)
        syncStatus.pendingOperations = await store?.current().offlineOperations.count ?? syncStatus.pendingOperations
    }

    public func exportDocument(id:String,format:MobileExportFormat) async -> MobileExportJob? { guard let exporter, let document=library.first(where:{$0.id==id}) else{return nil}; let job=try? await exporter.export(document:document,format:format); if let job { exportJobs.removeAll{$0.id==job.id}; exportJobs.insert(job,at:0) }; return job }
    public func handleDeepLink(_ url:URL) async -> MobileDeepLink? { guard let link=MobileDeepLinkRouter.parse(url) else{return nil}; switch link { case let .document(id,_): selectedDocumentID=id; case let .search(q): query=q; await performSearch(q); case let .graphNode(id): expandGraph(nodeId:id); case let .conversation(id): break; case .importFiles: break; case .export: break }; return link }
    public func saveHandoff(_ state:MobileHandoffState) async { try? await store?.saveHandoffState(state) }

    public func importFile(at url: URL) async {
        guard let importer else { return }
        do {
            #if canImport(UIKit)
            let result = try SecurityScopedAccessManager.withAccess(to: url) { try Data(contentsOf: url) }
            _ = try await importer.importData(name: url.lastPathComponent, data: result)
            #else
            _ = try await importer.importFile(at: url)
            #endif
            importJobs = await importer.history()
            if let store { library = await store.current().library }
        } catch { }
    }

    public func processSharedImports() async {
        guard let importer else { return }
        _ = await importer.processSharedRequests()
        importJobs = await importer.history()
        if let store { library = await store.current().library }
    }
}
#else
@MainActor
public final class MobileAppModel {
    public enum Phase: Equatable {
        case launching
        case needsConfiguration
        case ready
        case offline
        case failed(String)
    }

    public private(set) var phase: Phase = .launching
    public private(set) var library: [MobileLibraryItem] = []
    public var selectedDocumentID: String?
    public var query = ""
    public var readingSettings = MobileReadingSettings()
    public private(set) var importJobs: [MobileImportJob] = []
    public private(set) var searchResults: [MobileSearchResult] = []
    public private(set) var graphNodes: [MobileGraphNode] = []
    public private(set) var conversations: [MobileAIConversation] = []
    public var aiPolicy: MobileAIContextPolicy = .localOnly
    public private(set) var store: MobileLocalStore?
    public private(set) var client: MobileHTTPClient?
    public private(set) var sync: MobileSyncCoordinator?
    public private(set) var reader: ReaderSessionManager?
    public private(set) var importer: MobileImportCoordinator?
    public private(set) var searchIndex = MobileSearchIndex()
    public private(set) var graph = MobileKnowledgeGraph()
    public private(set) var ai: MobileAIService?
    public private(set) var exporter: MobileExportCoordinator?
    public private(set) var exportJobs: [MobileExportJob] = []

    public init() {}

    public func bootstrap(
        configuration: MobileServerConfiguration?,
        directory: URL
    ) async {
        do {
            let store = try MobileLocalStore(directory: directory)
            self.store = store
            let snapshot = await store.current()
            library = snapshot.library
            readingSettings = snapshot.settings
            reader = ReaderSessionManager(store: store)
            importer = try MobileImportCoordinator(store: store, directory: directory)
            importJobs = snapshot.importJobs
            searchIndex = MobileSearchIndex(documents: snapshot.searchDocuments)
            if snapshot.searchDocuments.isEmpty { searchIndex.rebuild(from: snapshot.library); try? await store.saveSearchDocuments(searchIndex.allDocuments) }
            graph = MobileKnowledgeGraph(nodes: snapshot.graphNodes, edges: snapshot.graphEdges)
            if snapshot.graphNodes.isEmpty { graph.rebuild(from: snapshot.library); try? await store.saveGraph(nodes: graph.nodes, edges: graph.edges) }
            graphNodes = graph.nodes
            conversations = snapshot.aiConversations
            exporter = try MobileExportCoordinator(store: store, directory: directory)
            exportJobs = snapshot.exportJobs

            guard let configuration else {
                phase = .needsConfiguration
                return
            }

            let client = MobileHTTPClient(configuration: configuration)
            self.client = client
            sync = MobileSyncCoordinator(client: client, store: store)
            reader = ReaderSessionManager(store: store)
            phase = .ready
        } catch {
            phase = .failed(error.localizedDescription)
        }
    }

    public var filteredLibrary: [MobileLibraryItem] { library }

    public func saveReadingSettings() async {
        try? await store?.saveSettings(readingSettings)
    }
    public func importFile(at url: URL) async {
        guard let importer else { return }
        do {
            #if canImport(UIKit)
            let result = try SecurityScopedAccessManager.withAccess(to: url) { try Data(contentsOf: url) }
            _ = try await importer.importData(name: url.lastPathComponent, data: result)
            #else
            _ = try await importer.importFile(at: url)
            #endif
            importJobs = await importer.history()
            if let store { library = await store.current().library }
        } catch { }
    }

    public func processSharedImports() async {
        guard let importer else { return }
        _ = await importer.processSharedRequests()
        importJobs = await importer.history()
        if let store { library = await store.current().library }
    }

    public func exportDocument(id:String,format:MobileExportFormat) async -> MobileExportJob? { guard let exporter, let document=library.first(where:{$0.id==id}) else{return nil}; return try? await exporter.export(document:document,format:format) }
    public func handleDeepLink(_ url:URL) async -> MobileDeepLink? { MobileDeepLinkRouter.parse(url) }

}
#endif
