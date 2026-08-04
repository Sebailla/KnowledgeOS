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
