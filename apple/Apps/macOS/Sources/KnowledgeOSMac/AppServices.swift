import Foundation

actor AppServices {
    let library: LibraryService
    let search: SearchService
    let workspace: WorkspaceService
    let ai: AIService
    let graph: KnowledgeGraphService

    init(
        library: LibraryService,
        search: SearchService,
        workspace: WorkspaceService,
        ai: AIService,
        graph: KnowledgeGraphService
    ) {
        self.library = library
        self.search = search
        self.workspace = workspace
        self.ai = ai
        self.graph = graph
    }

    static func makeDefault() -> AppServices {
        AppServices(
            library: InMemoryLibraryService(),
            search: InMemorySearchService(),
            workspace: InMemoryWorkspaceService(),
            ai: InMemoryAIService(),
            graph: InMemoryKnowledgeGraphService()
        )
    }

    func start() async throws {
        try await library.start()
        try await search.start()
        try await workspace.start()
        try await ai.start()
        try await graph.start()
    }

    func stop() async {
        await graph.stop()
        await ai.stop()
        await workspace.stop()
        await search.stop()
        await library.stop()
    }
}
