import Foundation

public struct LocalSearchHitDTO:
Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let title: String
    public let kind: String
    public let score: Double
    public let snippet: String
    public let highlights: [String]
    public let metadata: [String: JSONValue]
}

public struct LocalSearchPageDTO:
Codable, Sendable, Equatable {
    public let items: [LocalSearchHitDTO]
    public let page: Int
    public let pageSize: Int
    public let total: Int
    public let hasNextPage: Bool
}

public struct LocalSearchSuggestionsDTO:
Codable, Sendable, Equatable {
    public let suggestions: [String]
}

public struct LocalSearchIndexStatusDTO:
Codable, Sendable, Equatable {
    public let state: String
    public let documentCount: Int
    public let termCount: Int
    public let version: Int
    public let updatedAt: String?
}
