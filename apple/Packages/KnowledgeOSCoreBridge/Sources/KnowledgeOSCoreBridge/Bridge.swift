import Foundation

public enum CoreBridgeError:
LocalizedError, Equatable {
    case unavailable
    case terminated
    case timeout
    case invalidResponse
    case remote(
        code: String,
        message: String
    )

    public var errorDescription: String? {
        switch self {
        case .unavailable:
            "Core host is unavailable."
        case .terminated:
            "Core host terminated."
        case .timeout:
            "Core request timed out."
        case .invalidResponse:
            "Core response is invalid."
        case .remote(_, let message):
            message
        }
    }
}

public protocol CoreTransport:
Sendable {
    func start() async throws
    func stop() async
    func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse
}

public actor CoreBridge {
    private let transport: CoreTransport

    public init(
        transport: CoreTransport
    ) {
        self.transport = transport
    }

    public func start() async throws {
        try await transport.start()
        _ = try await health()
    }

    public func stop() async {
        await transport.stop()
    }


    public func syncStatus() async throws -> SyncStatusDTO { try await call(method:"sync.status",params:nil,as:SyncStatusDTO.self) }
    public func startSync() async throws -> SyncStatusDTO { try await call(method:"sync.start",params:nil,as:SyncStatusDTO.self) }
    public func pauseSync() async throws -> SyncStatusDTO { try await call(method:"sync.pause",params:nil,as:SyncStatusDTO.self) }
    public func resumeSync() async throws -> SyncStatusDTO { try await call(method:"sync.resume",params:nil,as:SyncStatusDTO.self) }
    public func cancelSync() async throws -> SyncStatusDTO { try await call(method:"sync.cancel",params:nil,as:SyncStatusDTO.self) }
    public func syncConflicts() async throws -> [SyncConflictDTO] { let response:SyncConflictsDTO=try await call(method:"sync.conflicts",params:nil,as:SyncConflictsDTO.self); return response.conflicts }

    public func persistenceHealth() async throws -> PersistenceHealthDTO {
        try await call(
            method: "persistence.health",
            params: nil,
            as: PersistenceHealthDTO.self
        )
    }

    public func backupPersistence(
        directory: String
    ) async throws -> PersistenceBackupDTO {
        try await call(
            method: "persistence.backup",
            params: .object([
                "directory": .string(directory)
            ]),
            as: PersistenceBackupDTO.self
        )
    }

    public func restorePersistence(
        directory: String
    ) async throws -> PersistenceRestoreDTO {
        try await call(
            method: "persistence.restore",
            params: .object([
                "directory": .string(directory)
            ]),
            as: PersistenceRestoreDTO.self
        )
    }


    public func applicationStatus()
    async throws -> ApplicationStatusDTO {
        try await call(
            method: "application.status",
            params: nil,
            as: ApplicationStatusDTO.self
        )
    }

    public func applicationDiagnostics()
    async throws -> ApplicationDiagnosticsDTO {
        try await call(
            method:
                "application.diagnostics",
            params: nil,
            as:
                ApplicationDiagnosticsDTO.self
        )
    }

    public func validateApplicationConfiguration()
    async throws -> ConfigurationValidationDTO {
        try await call(
            method:
                "application.configuration.validate",
            params: nil,
            as:
                ConfigurationValidationDTO.self
        )
    }

    public func applicationAbout()
    async throws -> ApplicationAboutDTO {
        try await call(
            method: "application.about",
            params: nil,
            as: ApplicationAboutDTO.self
        )
    }

    public func health()
    async throws -> CoreHealth {
        try await call(
            method: "core.health",
            params: nil,
            as: CoreHealth.self
        )
    }


    public func listAnnotations(
        documentId: String
    ) async throws -> [AnnotationDTO] {
        let response: AnnotationListDTO = try await call(
            method: "annotation.list",
            params: .object([
                "documentId": .string(documentId)
            ]),
            as: AnnotationListDTO.self
        )

        return response.annotations
    }

    public func createAnnotation(
        id: String,
        kind: AnnotationKind,
        anchor: AnnotationAnchorDTO,
        color: AnnotationColor? = nil,
        body: String? = nil
    ) async throws -> AnnotationDTO {
        var params: [String: JSONValue] = [
            "id": .string(id),
            "kind": .string(kind.rawValue),
            "documentId": .string(anchor.documentId),
            "pageNumber": .number(Double(anchor.pageNumber))
        ]

        if let startOffset = anchor.startOffset {
            params["startOffset"] = .number(Double(startOffset))
        }

        if let endOffset = anchor.endOffset {
            params["endOffset"] = .number(Double(endOffset))
        }

        if let selectedText = anchor.selectedText {
            params["selectedText"] = .string(selectedText)
        }

        if let color {
            params["color"] = .string(color.rawValue)
        }

        if let body {
            params["body"] = .string(body)
        }

        return try await call(
            method: "annotation.create",
            params: .object(params),
            as: AnnotationDTO.self
        )
    }

    public func deleteAnnotation(
        id: String
    ) async throws -> Bool {
        let response: AnnotationDeleteDTO = try await call(
            method: "annotation.delete",
            params: .object([
                "id": .string(id)
            ]),
            as: AnnotationDeleteDTO.self
        )

        return response.deleted
    }

    public func openDocument(id:String) async throws -> DocumentDescriptorDTO { try await call(method:"document.open",params:.object(["id":.string(id)]),as:DocumentDescriptorDTO.self) }
    public func documentPage(id:String,pageNumber:Int) async throws -> DocumentPageDTO { try await call(method:"document.page",params:.object(["id":.string(id),"pageNumber":.number(Double(pageNumber))]),as:DocumentPageDTO.self) }
    public func documentLocation(id:String) async throws -> DocumentLocationDTO? { let x:DocumentLocationEnvelope=try await call(method:"document.location.get",params:.object(["id":.string(id)]),as:DocumentLocationEnvelope.self); return x.location }
    public func saveDocumentLocation(id:String,pageNumber:Int,progress:Double) async throws -> DocumentLocationDTO { try await call(method:"document.location.save",params:.object(["id":.string(id),"pageNumber":.number(Double(pageNumber)),"progress":.number(progress)]),as:DocumentLocationDTO.self) }

    public func listLibrary(
        query: LibraryQuery = .init()
    ) async throws -> LibraryPageDTO {
        try await call(
            method: "library.list",
            params: query.jsonValue,
            as: LibraryPageDTO.self
        )
    }

    public func searchLibrary(
        query: LibraryQuery
    ) async throws -> LibraryPageDTO {
        try await call(
            method: "library.search",
            params: query.jsonValue,
            as: LibraryPageDTO.self
        )
    }

    public func getLibraryItem(
        id: String
    ) async throws -> LibraryItemDTO {
        try await call(
            method: "library.get",
            params: .object([
                "id": .string(id)
            ]),
            as: LibraryItemDTO.self
        )
    }

    public func recentLibraryItems(
        limit: Int = 12
    ) async throws -> [LibraryItemDTO] {
        let response: LibraryItemsDTO =
            try await call(
                method: "library.recent",
                params: .object([
                    "limit":
                        .number(Double(limit))
                ]),
                as: LibraryItemsDTO.self
            )

        return response.items
    }

    public func favoriteLibraryItems(
        limit: Int = 100
    ) async throws -> [LibraryItemDTO] {
        let response: LibraryItemsDTO =
            try await call(
                method: "library.favorites",
                params: .object([
                    "limit":
                        .number(Double(limit))
                ]),
                as: LibraryItemsDTO.self
            )

        return response.items
    }



    public func graphSearch(query: String) async throws -> [GraphNodeDTO] { let result: GraphNodesEnvelopeDTO = try await call(method:"graph.search",params:.object(["query":.string(query)]),as:GraphNodesEnvelopeDTO.self); return result.nodes }
    public func graphExpand(nodeID: String, depth: Int = 1) async throws -> GraphSubgraphDTO { try await call(method:"graph.expand",params:.object(["nodeId":.string(nodeID),"depth":.number(Double(depth))]),as:GraphSubgraphDTO.self) }
    public func graphPath(sourceID: String, targetID: String) async throws -> GraphPathDTO? { let result:GraphPathEnvelopeDTO = try await call(method:"graph.path",params:.object(["sourceId":.string(sourceID),"targetId":.string(targetID)]),as:GraphPathEnvelopeDTO.self); return result.path }
    public func graphStatistics() async throws -> GraphStatisticsDTO { try await call(method:"graph.statistics",params:nil,as:GraphStatisticsDTO.self) }



    public func exportFormats() async throws -> [ExportFormatInfoDTO] { let result:ExportFormatsDTO = try await call(method:"export.formats",params:nil,as:ExportFormatsDTO.self); return result.formats }
    public func exportPreview(format:ExportFormatDTO,id:String,title:String,body:String,includeMetadata:Bool=true,includeAnnotations:Bool=true) async throws -> ExportPreviewDTO { try await call(method:"export.preview",params:exportParameters(format:format,id:id,title:title,body:body,includeMetadata:includeMetadata,includeAnnotations:includeAnnotations),as:ExportPreviewDTO.self) }
    public func startExport(format:ExportFormatDTO,id:String,title:String,body:String,includeMetadata:Bool=true,includeAnnotations:Bool=true) async throws -> ExportJobDTO { try await call(method:"export.start",params:exportParameters(format:format,id:id,title:title,body:body,includeMetadata:includeMetadata,includeAnnotations:includeAnnotations),as:ExportJobDTO.self) }
    public func exportHistory() async throws -> [ExportJobDTO] { let result:ExportHistoryDTO = try await call(method:"export.history",params:nil,as:ExportHistoryDTO.self); return result.jobs }
    private func exportParameters(format:ExportFormatDTO,id:String,title:String,body:String,includeMetadata:Bool,includeAnnotations:Bool)->JSONValue { .object(["format":.string(format.rawValue),"sources":.array([.object(["id":.string(id),"title":.string(title),"body":.string(body)])]),"includeMetadata":.bool(includeMetadata),"includeAnnotations":.bool(includeAnnotations)]) }

    public func importPreview(
        name: String,
        content: String,
        mediaType: String? = nil,
        extensionName: String? = nil,
        runOCR: Bool = false
    ) async throws -> ImportPreviewDTO {
        try await call(
            method: "import.preview",
            params: importParameters(
                name: name,
                content: content,
                mediaType: mediaType,
                extensionName: extensionName,
                runOCR: runOCR
            ),
            as: ImportPreviewDTO.self
        )
    }

    public func startImport(
        name: String,
        content: String,
        mediaType: String? = nil,
        extensionName: String? = nil,
        runOCR: Bool = false
    ) async throws -> ImportJobDTO {
        try await call(
            method: "import.start",
            params: importParameters(
                name: name,
                content: content,
                mediaType: mediaType,
                extensionName: extensionName,
                runOCR: runOCR
            ),
            as: ImportJobDTO.self
        )
    }

    public func importHistory()
    async throws -> [ImportJobDTO] {
        let result: ImportHistoryDTO =
            try await call(
                method: "import.history",
                params: nil,
                as: ImportHistoryDTO.self
            )

        return result.jobs
    }

    public func cancelImport(
        id: String
    ) async throws -> ImportJobDTO {
        try await call(
            method: "import.cancel",
            params: .object([
                "id": .string(id)
            ]),
            as: ImportJobDTO.self
        )
    }

    private func importParameters(
        name: String,
        content: String,
        mediaType: String?,
        extensionName: String?,
        runOCR: Bool
    ) -> JSONValue {
        var params: [String: JSONValue] = [
            "name": .string(name),
            "content": .string(content),
            "runOCR": .bool(runOCR)
        ]

        if let mediaType {
            params["mediaType"] =
                .string(mediaType)
        }

        if let extensionName {
            params["extension"] =
                .string(extensionName)
        }

        return .object(params)
    }

    public func localSearch(
        query: String,
        page: Int = 1,
        pageSize: Int = 20
    ) async throws -> LocalSearchPageDTO {
        try await call(
            method: "search.query",
            params: .object([
                "query": .string(query),
                "page":
                    .number(Double(page)),
                "pageSize":
                    .number(Double(pageSize))
            ]),
            as: LocalSearchPageDTO.self
        )
    }

    public func searchSuggestions(
        query: String,
        limit: Int = 8
    ) async throws ->
    [String] {
        let result:
            LocalSearchSuggestionsDTO =
                try await call(
                    method:
                        "search.suggest",
                    params: .object([
                        "query":
                            .string(query),
                        "limit":
                            .number(
                                Double(limit)
                            )
                    ]),
                    as:
                        LocalSearchSuggestionsDTO
                            .self
                )

        return result.suggestions
    }

    public func localSearchIndexStatus()
    async throws ->
    LocalSearchIndexStatusDTO {
        try await call(
            method:
                "search.index.status",
            params: nil,
            as:
                LocalSearchIndexStatusDTO.self
        )
    }

    public func search(
        _ query: String
    ) async throws -> CoreSearchResult {
        try await call(
            method: "search.query",
            params: .object([
                "query": .string(query)
            ]),
            as: CoreSearchResult.self
        )
    }

    public func listWorkspaces()
    async throws -> WorkspaceListResult {
        try await call(
            method: "workspace.list",
            params: nil,
            as: WorkspaceListResult.self
        )
    }


    public func aiModels() async throws -> [AIModelDTO] { let value:AIModelsDTO = try await call(method:"ai.models.list",params:nil,as:AIModelsDTO.self); return value.models }
    public func aiHealth() async throws -> AIRuntimeHealthDTO { try await call(method:"ai.health",params:nil,as:AIRuntimeHealthDTO.self) }
    public func aiChat(message:String, conversationId:String? = nil, modelId:String? = nil) async throws -> AIConversationDTO {
        var params:[String:JSONValue] = ["message":.string(message)]
        if let conversationId { params["conversationId"] = .string(conversationId) }
        if let modelId { params["modelId"] = .string(modelId) }
        return try await call(method:"ai.chat",params:.object(params),as:AIConversationDTO.self)
    }
    public func aiConversations() async throws -> [AIConversationDTO] { let value:AIConversationsDTO = try await call(method:"ai.conversation.list",params:nil,as:AIConversationsDTO.self); return value.conversations }
    public func deleteAIConversation(id:String) async throws -> Bool { struct Result:Codable { let deleted:Bool }; return try await call(method:"ai.conversation.delete",params:.object(["id":.string(id)]),as:Result.self).deleted }

    public func generate(
        _ prompt: String
    ) async throws -> AIGenerationResult {
        try await call(
            method: "ai.generate",
            params: .object([
                "prompt": .string(prompt)
            ]),
            as: AIGenerationResult.self
        )
    }

    private func call<T: Decodable>(
        method: String,
        params: JSONValue?,
        as type: T.Type
    ) async throws -> T {
        let response =
            try await transport.send(
                CoreRequest(
                    method: method,
                    params: params
                )
            )

        if let error = response.error {
            throw CoreBridgeError.remote(
                code: error.code,
                message: error.message
            )
        }

        guard let result = response.result else {
            throw CoreBridgeError
                .invalidResponse
        }

        let data =
            try JSONEncoder().encode(result)

        return try JSONDecoder().decode(
            T.self,
            from: data
        )
    }
    public func transportConfiguration()
    async throws -> TransportConfigurationDTO {
        try await call(
            method:
                "transport.configuration.get",
            params: nil,
            as:
                TransportConfigurationDTO.self
        )
    }

    public func saveTransportConfiguration(
        _ configuration:
            TransportConfigurationDTO
    ) async throws ->
    TransportConfigurationDTO {
        try await call(
            method:
                "transport.configuration.save",
            params:
                configuration.jsonValue,
            as:
                TransportConfigurationDTO.self
        )
    }

    public func testTransport()
    async throws -> TransportHealthDTO {
        try await call(
            method: "transport.test",
            params: nil,
            as: TransportHealthDTO.self
        )
    }

    public func listConflicts() async throws -> [ConflictDTO] { let value: ConflictListDTO = try await call(method: "conflict.list", params: nil, as: ConflictListDTO.self); return value.conflicts }
    public func previewConflict(id: String) async throws -> ConflictPreviewDTO { try await call(method: "conflict.preview", params: .object(["id": .string(id)]), as: ConflictPreviewDTO.self) }
    public func resolveConflict(id: String, strategy: ConflictResolutionStrategyDTO) async throws -> ConflictDTO { try await call(method: "conflict.resolve", params: .object(["id": .string(id), "strategy": .string(strategy.rawValue)]), as: ConflictDTO.self) }
    public func ignoreConflict(id: String) async throws -> ConflictDTO { try await call(method: "conflict.ignore", params: .object(["id": .string(id)]), as: ConflictDTO.self) }
    public func conflictStatistics() async throws -> ConflictStatisticsDTO { try await call(method: "conflict.statistics", params: nil, as: ConflictStatisticsDTO.self) }

}

public struct CoreHealth:
Codable, Sendable, Equatable {
    public struct Engine:
    Codable, Sendable, Equatable {
        public let id: String
        public let name: String
        public let version: String
    }

    public let status: String
    public let runtimeState: String
    public let engines: [Engine]
}

public struct CoreSearchResult:
Codable, Sendable, Equatable {
    public let total: Int
}

public struct WorkspaceListResult:
Codable, Sendable, Equatable {
    public struct Workspace:
    Codable, Sendable, Equatable {
        public let id: String
        public let name: String
    }

    public let workspaces: [Workspace]
}

public struct AIGenerationResult:
Codable, Sendable, Equatable {
    public let modelId: String
    public let providerId: String
    public let content: String


}
