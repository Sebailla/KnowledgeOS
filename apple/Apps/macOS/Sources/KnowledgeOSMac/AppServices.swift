import Foundation
import KnowledgeOSCoreBridge

actor AppServices {
    let bridge: CoreBridge
    let library: LibraryService
    let search: SearchService
    let document: DocumentService
    let annotations: AnnotationService
    let workspace: WorkspaceService
    let ai: AIService
    let graph: KnowledgeGraphService

    static func makeDefault()
    throws -> AppServices {
        let configuration = try ReleaseEnvironment
            .hostConfiguration()

        let bridge = CoreBridge(
            transport:
                CoreProcessController(
                    executableURL:
                        configuration
                            .executableURL,
                    arguments:
                        configuration.arguments,
                    environment:
                        configuration.environment,
                    standardErrorURL:
                        configuration.logURL
                )
        )

        return AppServices(
            bridge: bridge,
            library:
                CoreLibraryAdapter(
                    bridge: bridge
                ),
            search:
                CoreSearchAdapter(
                    bridge: bridge
                ),
            document:
                CoreDocumentAdapter(
                    bridge: bridge
                ),
            annotations:
                CoreAnnotationAdapter(
                    bridge: bridge
                ),
            workspace:
                CoreWorkspaceAdapter(
                    bridge: bridge
                ),
            ai:
                CoreAIAdapter(
                    bridge: bridge
                ),
            graph:
                CoreKnowledgeGraphAdapter(
                    bridge: bridge
                )
        )
    }

    init(
        bridge: CoreBridge,
        library: LibraryService,
        search: SearchService,
        document: DocumentService,
        annotations: AnnotationService,
        workspace: WorkspaceService,
        ai: AIService,
        graph: KnowledgeGraphService
    ) {
        self.bridge = bridge
        self.library = library
        self.search = search
        self.document = document
        self.annotations = annotations
        self.workspace = workspace
        self.ai = ai
        self.graph = graph
    }

    func start() async throws {
        try await bridge.start()
        try await library.start()
        try await search.start()
        try await document.start()
        try await annotations.start()
        try await workspace.start()
        try await ai.start()
        try await graph.start()
    }

    func stop() async {
        await graph.stop()
        await ai.stop()
        await workspace.stop()
        await annotations.stop()
        await document.stop()
        await search.stop()
        await library.stop()
        await bridge.stop()
    }
}
