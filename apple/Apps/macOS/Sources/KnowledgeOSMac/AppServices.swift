import Foundation
import KnowledgeOSCoreBridge

actor AppServices {
    let bridge: CoreBridge
    let library: LibraryService
    let search: SearchService
    let workspace: WorkspaceService
    let ai: AIService
    let graph: KnowledgeGraphService

    static func makeDefault()
    throws -> AppServices {
        let root = URL(
            fileURLWithPath:
                FileManager.default
                    .currentDirectoryPath
        )

        let bridge = CoreBridge(
            transport:
                CoreProcessController(
                    executableURL:
                        URL(
                            fileURLWithPath:
                                "/usr/bin/env"
                        ),
                    arguments: [
                        "node",
                        root.appendingPathComponent(
                            "apps/macos-core-host/dist/main.js"
                        ).path
                    ]
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
        workspace: WorkspaceService,
        ai: AIService,
        graph: KnowledgeGraphService
    ) {
        self.bridge = bridge
        self.library = library
        self.search = search
        self.workspace = workspace
        self.ai = ai
        self.graph = graph
    }

    func start() async throws {
        try await bridge.start()
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
        await bridge.stop()
    }
}
