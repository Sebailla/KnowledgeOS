import Foundation

public actor MobileLocalStore {
    public struct Snapshot: Codable, Sendable {
        public var schemaVersion: Int
        public var library: [MobileLibraryItem]
        public var positions: [String: MobileReadingPosition]
        public var bookmarks: [MobileBookmark]
        public var annotations: [MobileAnnotation]
        public var recentDocumentIDs: [String]
        public var offlineOperations: [OfflineOperation]
        public var checkpoint: MobileCheckpoint
        public var conflicts: [MobileConflict]
        public var settings: MobileReadingSettings
        public var lastSuccessfulSync: String?
        public var readerSessions: [String: MobileReaderSession]
        public var readerPreferences: [String: MobileReaderPreferences]
        public var readerAnnotations: [MobileReaderAnnotation]
        public var inkStrokes: [MobileInkStroke]
        public var importJobs: [MobileImportJob]
        public var shareRequests: [MobileImportRequest]
        public var searchDocuments: [MobileSearchDocument]
        public var searchHistory: [MobileSearchHistoryEntry]
        public var graphNodes: [MobileGraphNode]
        public var graphEdges: [MobileGraphEdge]
        public var aiConversations: [MobileAIConversation]
        public var exportJobs: [MobileExportJob]
        public var handoffState: MobileHandoffState?

        public init(
            schemaVersion: Int = 3,
            library: [MobileLibraryItem] = [],
            positions: [String: MobileReadingPosition] = [:],
            bookmarks: [MobileBookmark] = [],
            annotations: [MobileAnnotation] = [],
            recentDocumentIDs: [String] = [],
            offlineOperations: [OfflineOperation] = [],
            checkpoint: MobileCheckpoint = .init(serverSequence: 0, localSequence: 0, checkpointId: nil, updatedAt: ""),
            conflicts: [MobileConflict] = [],
            settings: MobileReadingSettings = .init(),
            lastSuccessfulSync: String? = nil,
            readerSessions: [String: MobileReaderSession] = [:],
            readerPreferences: [String: MobileReaderPreferences] = [:],
            readerAnnotations: [MobileReaderAnnotation] = [],
            inkStrokes: [MobileInkStroke] = [],
            importJobs: [MobileImportJob] = [],
            shareRequests: [MobileImportRequest] = [],
            searchDocuments: [MobileSearchDocument] = [],
            searchHistory: [MobileSearchHistoryEntry] = [],
            graphNodes: [MobileGraphNode] = [],
            graphEdges: [MobileGraphEdge] = [],
            aiConversations: [MobileAIConversation] = [],
            exportJobs: [MobileExportJob] = [],
            handoffState: MobileHandoffState? = nil
        ) {
            self.schemaVersion = schemaVersion
            self.library = library
            self.positions = positions
            self.bookmarks = bookmarks
            self.annotations = annotations
            self.recentDocumentIDs = recentDocumentIDs
            self.offlineOperations = offlineOperations
            self.checkpoint = checkpoint
            self.conflicts = conflicts
            self.settings = settings
            self.lastSuccessfulSync = lastSuccessfulSync
            self.readerSessions = readerSessions
            self.readerPreferences = readerPreferences
            self.readerAnnotations = readerAnnotations
            self.inkStrokes = inkStrokes
            self.importJobs = importJobs
            self.shareRequests = shareRequests
            self.searchDocuments = searchDocuments
            self.searchHistory = searchHistory
            self.graphNodes = graphNodes
            self.graphEdges = graphEdges
            self.aiConversations = aiConversations
            self.exportJobs = exportJobs
            self.handoffState = handoffState
        }

        enum CodingKeys: String, CodingKey { case schemaVersion, library, positions, bookmarks, annotations, recentDocumentIDs, offlineOperations, checkpoint, conflicts, settings, lastSuccessfulSync, readerSessions, readerPreferences, readerAnnotations, inkStrokes, importJobs, shareRequests, searchDocuments, searchHistory, graphNodes, graphEdges, aiConversations, exportJobs, handoffState }
        public init(from decoder: Decoder) throws {
            let c = try decoder.container(keyedBy: CodingKeys.self)
            schemaVersion = try c.decodeIfPresent(Int.self, forKey: .schemaVersion) ?? 1
            library = try c.decodeIfPresent([MobileLibraryItem].self, forKey: .library) ?? []
            positions = try c.decodeIfPresent([String: MobileReadingPosition].self, forKey: .positions) ?? [:]
            bookmarks = try c.decodeIfPresent([MobileBookmark].self, forKey: .bookmarks) ?? []
            annotations = try c.decodeIfPresent([MobileAnnotation].self, forKey: .annotations) ?? []
            recentDocumentIDs = try c.decodeIfPresent([String].self, forKey: .recentDocumentIDs) ?? []
            offlineOperations = try c.decodeIfPresent([OfflineOperation].self, forKey: .offlineOperations) ?? []
            checkpoint = try c.decodeIfPresent(MobileCheckpoint.self, forKey: .checkpoint) ?? .init(serverSequence: 0, localSequence: 0, checkpointId: nil, updatedAt: "")
            conflicts = try c.decodeIfPresent([MobileConflict].self, forKey: .conflicts) ?? []
            settings = try c.decodeIfPresent(MobileReadingSettings.self, forKey: .settings) ?? .init()
            lastSuccessfulSync = try c.decodeIfPresent(String.self, forKey: .lastSuccessfulSync)
            readerSessions = try c.decodeIfPresent([String: MobileReaderSession].self, forKey: .readerSessions) ?? [:]
            readerPreferences = try c.decodeIfPresent([String: MobileReaderPreferences].self, forKey: .readerPreferences) ?? [:]
            readerAnnotations = try c.decodeIfPresent([MobileReaderAnnotation].self, forKey: .readerAnnotations) ?? []
            inkStrokes = try c.decodeIfPresent([MobileInkStroke].self, forKey: .inkStrokes) ?? []
            importJobs = try c.decodeIfPresent([MobileImportJob].self, forKey: .importJobs) ?? []
            shareRequests = try c.decodeIfPresent([MobileImportRequest].self, forKey: .shareRequests) ?? []
            searchDocuments = try c.decodeIfPresent([MobileSearchDocument].self, forKey: .searchDocuments) ?? []
            searchHistory = try c.decodeIfPresent([MobileSearchHistoryEntry].self, forKey: .searchHistory) ?? []
            graphNodes = try c.decodeIfPresent([MobileGraphNode].self, forKey: .graphNodes) ?? []
            graphEdges = try c.decodeIfPresent([MobileGraphEdge].self, forKey: .graphEdges) ?? []
            aiConversations = try c.decodeIfPresent([MobileAIConversation].self, forKey: .aiConversations) ?? []
            exportJobs = try c.decodeIfPresent([MobileExportJob].self, forKey: .exportJobs) ?? []
            handoffState = try c.decodeIfPresent(MobileHandoffState.self, forKey: .handoffState)
        }
    }

    private let fileURL: URL
    private let backupURL: URL
    private var snapshot: Snapshot

    public init(directory: URL) throws {
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        fileURL = directory.appending(path: "mobile-state-v2.json")
        backupURL = directory.appending(path: "mobile-state-v2.backup.json")
        if let data = try? Data(contentsOf: fileURL), let value = try? JSONDecoder().decode(Snapshot.self, from: data) {
            snapshot = MobileMigrationManager.migrate(value)
        } else if let data = try? Data(contentsOf: backupURL), let value = try? JSONDecoder().decode(Snapshot.self, from: data) {
            snapshot = MobileMigrationManager.migrate(value)
        } else { snapshot = Snapshot() }
    }

    public func current() -> Snapshot { snapshot }
    public func replaceLibrary(_ items: [MobileLibraryItem]) throws { snapshot.library = items; try persist() }
    public func upsertLibraryItem(_ item: MobileLibraryItem) throws { if let i=snapshot.library.firstIndex(where:{$0.id==item.id}){snapshot.library[i]=item}else{snapshot.library.append(item)};try persist() }
    public func setFavorite(documentId:String,value:Bool)throws{guard let i=snapshot.library.firstIndex(where:{$0.id==documentId})else{return};snapshot.library[i].favorite=value;try persist()}
    public func markRecent(documentId:String)throws{snapshot.recentDocumentIDs.removeAll{$0==documentId};snapshot.recentDocumentIDs.insert(documentId,at:0);snapshot.recentDocumentIDs=Array(snapshot.recentDocumentIDs.prefix(100));try persist()}
    public func savePosition(_ value:MobileReadingPosition)throws{snapshot.positions[value.documentId]=value;try persist()}
    public func saveBookmark(_ value:MobileBookmark)throws{if let i=snapshot.bookmarks.firstIndex(where:{$0.id==value.id}){snapshot.bookmarks[i]=value}else{snapshot.bookmarks.append(value)};try persist()}
    public func saveAnnotation(_ value:MobileAnnotation)throws{if let i=snapshot.annotations.firstIndex(where:{$0.id==value.id}){snapshot.annotations[i]=value}else{snapshot.annotations.append(value)};try persist()}
    public func saveReaderSession(_ value:MobileReaderSession)throws{snapshot.readerSessions[value.documentId]=value;try persist()}
    public func saveReaderPreferences(documentId:String,value:MobileReaderPreferences)throws{snapshot.readerPreferences[documentId]=value;try persist()}
    public func saveReaderAnnotation(_ value:MobileReaderAnnotation)throws{if let i=snapshot.readerAnnotations.firstIndex(where:{$0.id==value.id}){snapshot.readerAnnotations[i]=value}else{snapshot.readerAnnotations.append(value)};try persist()}
    public func deleteReaderAnnotation(id:String)throws{snapshot.readerAnnotations.removeAll{$0.id==id};snapshot.annotations.removeAll{$0.id==id};try persist()}
    public func saveInkStroke(_ value:MobileInkStroke)throws{if let i=snapshot.inkStrokes.firstIndex(where:{$0.id==value.id}){snapshot.inkStrokes[i]=value}else{snapshot.inkStrokes.append(value)};try persist()}
    public func enqueue(_ value:OfflineOperation)throws{if !snapshot.offlineOperations.contains(where:{$0.id==value.id}){snapshot.offlineOperations.append(value);snapshot.checkpoint.localSequence += 1};try persist()}
    public func replaceOperation(_ value:OfflineOperation)throws{if let i=snapshot.offlineOperations.firstIndex(where:{$0.id==value.id}){snapshot.offlineOperations[i]=value};try persist()}
    public func removeOperation(id:String)throws{snapshot.offlineOperations.removeAll{$0.id==id};try persist()}
    public func saveCheckpoint(_ value:MobileCheckpoint)throws{snapshot.checkpoint=value;try persist()}
    public func saveConflict(_ value:MobileConflict)throws{if let i=snapshot.conflicts.firstIndex(where:{$0.id==value.id}){snapshot.conflicts[i]=value}else{snapshot.conflicts.append(value)};try persist()}
    public func resolveConflict(id:String,state:MobileConflictState)throws{guard let i=snapshot.conflicts.firstIndex(where:{$0.id==id})else{return};snapshot.conflicts[i].state=state;try persist()}
    public func saveSettings(_ value:MobileReadingSettings)throws{snapshot.settings=value;try persist()}
    public func recordSuccessfulSync(_ date:String)throws{snapshot.lastSuccessfulSync=date;try persist()}
    public func saveImportJob(_ value:MobileImportJob)throws{if let i=snapshot.importJobs.firstIndex(where:{$0.id==value.id}){snapshot.importJobs[i]=value}else{snapshot.importJobs.append(value)};try persist()}
    public func saveShareRequest(_ value:MobileImportRequest)throws{if !snapshot.shareRequests.contains(where:{$0.id==value.id}){snapshot.shareRequests.append(value)};try persist()}
    public func removeShareRequest(id:String)throws{snapshot.shareRequests.removeAll{$0.id==id};try persist()}
    public func clearSession()throws{snapshot.offlineOperations=[];snapshot.conflicts=[];snapshot.checkpoint = .init(serverSequence: 0, localSequence: 0, checkpointId: nil, updatedAt: "");snapshot.lastSuccessfulSync=nil;try persist()}

    public func saveSearchDocuments(_ values: [MobileSearchDocument]) throws { snapshot.searchDocuments = values; try persist() }
    public func recordSearch(_ query: String) throws { snapshot.searchHistory.insert(.init(id: UUID().uuidString, query: query, createdAt: ISO8601DateFormatter().string(from: Date())), at: 0); snapshot.searchHistory = Array(snapshot.searchHistory.prefix(100)); try persist() }
    public func saveGraph(nodes: [MobileGraphNode], edges: [MobileGraphEdge]) throws { snapshot.graphNodes = nodes; snapshot.graphEdges = edges; try persist() }
    public func saveAIConversation(_ value: MobileAIConversation) throws { if let index = snapshot.aiConversations.firstIndex(where: { $0.id == value.id }) { snapshot.aiConversations[index] = value } else { snapshot.aiConversations.append(value) }; try persist() }
    public func deleteAIConversation(id: String) throws { snapshot.aiConversations.removeAll { $0.id == id }; try persist() }

    public func saveExportJob(_ value:MobileExportJob)throws{if let i=snapshot.exportJobs.firstIndex(where:{$0.id==value.id}){snapshot.exportJobs[i]=value}else{snapshot.exportJobs.append(value)};try persist()}
    public func saveHandoffState(_ value:MobileHandoffState?)throws{snapshot.handoffState=value;try persist()}
    private func persist() throws {
        let encoder=JSONEncoder();encoder.outputFormatting=[.sortedKeys];let data=try encoder.encode(snapshot)
        if FileManager.default.fileExists(atPath:fileURL.path()){try? FileManager.default.removeItem(at:backupURL);try? FileManager.default.copyItem(at:fileURL,to:backupURL)}
        try data.write(to:fileURL,options:[.atomic,.completeFileProtection])
    }
}

public enum MobileMigrationManager {
    public static func migrate(_ snapshot: MobileLocalStore.Snapshot) -> MobileLocalStore.Snapshot { var value=snapshot;value.schemaVersion=6;return value }
}
