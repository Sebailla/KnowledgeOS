import Foundation

public protocol CoreLifecycleService:
Sendable {
    func start() async throws
    func stop() async
}

public actor CoreLibraryAdapter:
CoreLifecycleService {
    private let bridge: CoreBridge

    public init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    public func start() async throws {}
    public func stop() async {}

    public func list(
        query: LibraryQuery = .init()
    ) async throws -> LibraryPageDTO {
        try await bridge.listLibrary(
            query: query
        )
    }

    public func item(
        id: String
    ) async throws -> LibraryItemDTO {
        try await bridge.getLibraryItem(
            id: id
        )
    }

    public func recent(
        limit: Int = 12
    ) async throws -> [LibraryItemDTO] {
        try await bridge.recentLibraryItems(
            limit: limit
        )
    }

    public func favorites(
        limit: Int = 100
    ) async throws -> [LibraryItemDTO] {
        try await bridge.favoriteLibraryItems(
            limit: limit
        )
    }
}

public actor CoreSearchAdapter:
CoreLifecycleService {
    private let bridge: CoreBridge

    public init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    public func start() async throws {}
    public func stop() async {}

    public func search(
        _ query: String
    ) async throws -> CoreSearchResult {
        try await bridge.search(query)
    }
}

public actor CoreWorkspaceAdapter:
CoreLifecycleService {
    private let bridge: CoreBridge

    public init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    public func start() async throws {}
    public func stop() async {}

    public func list()
    async throws -> WorkspaceListResult {
        try await bridge.listWorkspaces()
    }
}

public actor CoreAIAdapter:
CoreLifecycleService {
    private let bridge: CoreBridge

    public init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    public func start() async throws {}
    public func stop() async {}

    public func generate(
        _ prompt: String
    ) async throws -> AIGenerationResult {
        try await bridge.generate(prompt)
    }
}

public actor CoreKnowledgeGraphAdapter:
CoreLifecycleService {
    public init(bridge: CoreBridge) {}
    public func start() async throws {}
    public func stop() async {}
}

public actor CoreDocumentAdapter:CoreLifecycleService { private let bridge:CoreBridge; public init(bridge:CoreBridge){self.bridge=bridge}; public func start() async throws {}; public func stop() async {}; public func open(id:String) async throws -> DocumentDescriptorDTO { try await bridge.openDocument(id:id) }; public func page(id:String,pageNumber:Int) async throws -> DocumentPageDTO { try await bridge.documentPage(id:id,pageNumber:pageNumber) }; public func location(id:String) async throws -> DocumentLocationDTO? { try await bridge.documentLocation(id:id) }; public func saveLocation(id:String,pageNumber:Int,progress:Double) async throws -> DocumentLocationDTO { try await bridge.saveDocumentLocation(id:id,pageNumber:pageNumber,progress:progress) } }

public actor CoreAnnotationAdapter:CoreLifecycleService { private let bridge:CoreBridge; public init(bridge:CoreBridge){self.bridge=bridge}; public func start() async throws{}; public func stop() async{}; public func list(documentId:String) async throws->[AnnotationDTO]{try await bridge.listAnnotations(documentId:documentId)}; public func create(id:String,kind:AnnotationKind,anchor:AnnotationAnchorDTO,color:AnnotationColor?=nil,body:String?=nil) async throws->AnnotationDTO{try await bridge.createAnnotation(id:id,kind:kind,anchor:anchor,color:color,body:body)}; public func delete(id:String) async throws->Bool{try await bridge.deleteAnnotation(id:id)} }
