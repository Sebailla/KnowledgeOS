import Foundation

public protocol CoreLifecycleService:
Sendable {
    func start() async throws
    func stop() async
}

public actor CoreLibraryAdapter:
CoreLifecycleService {
    public init(bridge: CoreBridge) {}
    public func start() async throws {}
    public func stop() async {}
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
