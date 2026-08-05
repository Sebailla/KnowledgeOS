import Foundation

public struct MobileSearchDocument: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let title: String
    public let body: String
    public let authors: [String]
    public let tags: [String]
    public let availability: MobileAvailability
}

public struct MobileSearchResult: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let title: String
    public let score: Double
    public let snippet: String
    public let highlights: [String]
    public let availability: MobileAvailability
}

public struct MobileSearchHistoryEntry: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let query: String
    public let createdAt: String
}

public struct MobileGraphNode: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let type: String
    public let label: String
    public let documentId: String?
    public let properties: [String: String]
}

public struct MobileGraphEdge: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let type: String
    public let sourceId: String
    public let targetId: String
}

public struct MobileGraphSubgraph: Codable, Sendable, Equatable {
    public let nodes: [MobileGraphNode]
    public let edges: [MobileGraphEdge]
}

public enum MobileAIContextPolicy: String, Codable, Sendable, CaseIterable {
    case localOnly = "local-only"
    case remoteAllowed = "remote-allowed"
    case restricted
}

public struct MobileAIModel: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let name: String
    public let provider: String
    public let remote: Bool
}

public struct MobileAIMessage: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let role: String
    public let content: String
    public let createdAt: String
    public let sourceIds: [String]
}

public struct MobileAIConversation: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public var title: String
    public var modelId: String
    public var messages: [MobileAIMessage]
    public var updatedAt: String
}
