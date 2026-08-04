import Foundation

protocol LifecycleService: Sendable {
    func start() async throws
    func stop() async
}

protocol LibraryService: LifecycleService {}
protocol SearchService: LifecycleService {}
protocol WorkspaceService: LifecycleService {}
protocol AIService: LifecycleService {}
protocol KnowledgeGraphService: LifecycleService {}

actor InMemoryLibraryService: LibraryService {
    func start() async throws {}
    func stop() async {}
}

actor InMemorySearchService: SearchService {
    func start() async throws {}
    func stop() async {}
}

actor InMemoryWorkspaceService: WorkspaceService {
    func start() async throws {}
    func stop() async {}
}

actor InMemoryAIService: AIService {
    func start() async throws {}
    func stop() async {}
}

actor InMemoryKnowledgeGraphService: KnowledgeGraphService {
    func start() async throws {}
    func stop() async {}
}
