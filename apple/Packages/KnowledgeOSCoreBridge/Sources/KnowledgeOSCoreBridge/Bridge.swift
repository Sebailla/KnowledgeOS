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

    public func health()
    async throws -> CoreHealth {
        try await call(
            method: "core.health",
            params: nil,
            as: CoreHealth.self
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
