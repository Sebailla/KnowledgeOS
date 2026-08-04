import Foundation

public enum LibraryAvailability:
String, Codable, Sendable, CaseIterable {
    case local
    case masterLibrary = "master-library"
    case both
    case unavailable
}

public enum LibraryItemKind:
String, Codable, Sendable, CaseIterable {
    case book
    case paper
    case document
    case web
    case note
}

public enum LibrarySort:
String, Codable, Sendable, CaseIterable {
    case titleAscending = "title-asc"
    case titleDescending = "title-desc"
    case updatedDescending = "updated-desc"
    case createdDescending = "created-desc"
}

public struct LibraryQuery:
Sendable, Equatable {
    public var text: String?
    public var page: Int
    public var pageSize: Int
    public var sort: LibrarySort
    public var favoritesOnly: Bool
    public var kinds: [LibraryItemKind]
    public var availability: [LibraryAvailability]

    public init(
        text: String? = nil,
        page: Int = 1,
        pageSize: Int = 24,
        sort: LibrarySort = .updatedDescending,
        favoritesOnly: Bool = false,
        kinds: [LibraryItemKind] = [],
        availability: [LibraryAvailability] = []
    ) {
        self.text = text
        self.page = page
        self.pageSize = pageSize
        self.sort = sort
        self.favoritesOnly = favoritesOnly
        self.kinds = kinds
        self.availability = availability
    }

    var jsonValue: JSONValue {
        var object: [String: JSONValue] = [
            "page": .number(Double(page)),
            "pageSize": .number(Double(pageSize)),
            "sort": .string(sort.rawValue),
            "favoritesOnly": .bool(favoritesOnly),
            "kinds": .array(
                kinds.map {
                    .string($0.rawValue)
                }
            ),
            "availability": .array(
                availability.map {
                    .string($0.rawValue)
                }
            ),
        ]

        if let text, !text.isEmpty {
            object["text"] = .string(text)
        }

        return .object(object)
    }
}

public struct LibraryItemDTO:
Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let title: String
    public let subtitle: String?
    public let authors: [String]
    public let kind: LibraryItemKind
    public let availability: LibraryAvailability
    public let favorite: Bool
    public let tags: [String]
    public let createdAt: String
    public let updatedAt: String
    public let coverURL: String?
    public let metadata: [String: JSONValue]
}

public struct LibraryPageDTO:
Codable, Sendable, Equatable {
    public let items: [LibraryItemDTO]
    public let page: Int
    public let pageSize: Int
    public let total: Int
    public let hasNextPage: Bool
}

public struct LibraryItemsDTO:
Codable, Sendable, Equatable {
    public let items: [LibraryItemDTO]
}
