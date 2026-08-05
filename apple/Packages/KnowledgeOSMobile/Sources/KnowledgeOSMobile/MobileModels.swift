import Foundation

public enum MobileAvailability: String, Codable, Sendable {
    case local
    case remote
    case downloading
    case synchronized
    case conflict
}

public struct MobileLibraryItem: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public var title: String
    public var authors: [String]
    public var summary: String
    public var availability: MobileAvailability
    public var favorite: Bool
    public var updatedAt: String
    public var localContent: String?

    public init(
        id: String,
        title: String,
        authors: [String] = [],
        summary: String = "",
        availability: MobileAvailability = .remote,
        favorite: Bool = false,
        updatedAt: String = "",
        localContent: String? = nil
    ) {
        self.id = id
        self.title = title
        self.authors = authors
        self.summary = summary
        self.availability = availability
        self.favorite = favorite
        self.updatedAt = updatedAt
        self.localContent = localContent
    }
}

public struct MobileReadingSettings: Codable, Sendable, Equatable {
    public enum Theme: String, Codable, Sendable, CaseIterable {
        case light
        case dark
        case sepia
    }

    public var theme: Theme
    public var fontScale: Double
    public var horizontalMargin: Double
    public var continuousReading: Bool

    public init(
        theme: Theme = .light,
        fontScale: Double = 1,
        horizontalMargin: Double = 24,
        continuousReading: Bool = true
    ) {
        self.theme = theme
        self.fontScale = fontScale
        self.horizontalMargin = horizontalMargin
        self.continuousReading = continuousReading
    }
}

public struct MobileReadingPosition: Codable, Sendable, Equatable {
    public let documentId: String
    public let locator: String
    public let progress: Double
    public let updatedAt: String
}

public struct MobileBookmark: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let documentId: String
    public let locator: String
    public let title: String?
    public let updatedAt: String
}

public struct MobileAnnotation: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let documentId: String
    public let locator: String
    public let text: String
    public let note: String?
    public let updatedAt: String
}

public struct OfflineOperation: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let method: String
    public let payload: Data
    public let idempotencyKey: String
    public let createdAt: String
    public var retryCount: Int
    public var nextAttemptAt: String?

    public init(
        id: String,
        method: String,
        payload: Data,
        idempotencyKey: String,
        createdAt: String,
        retryCount: Int = 0,
        nextAttemptAt: String? = nil
    ) {
        self.id = id
        self.method = method
        self.payload = payload
        self.idempotencyKey = idempotencyKey
        self.createdAt = createdAt
        self.retryCount = retryCount
        self.nextAttemptAt = nextAttemptAt
    }
}

public struct MobileCheckpoint: Codable, Sendable, Equatable {
    public var serverSequence: Int
    public var localSequence: Int
    public var checkpointId: String?
    public var updatedAt: String

    public init(
        serverSequence: Int,
        localSequence: Int,
        checkpointId: String?,
        updatedAt: String
    ) {
        self.serverSequence = serverSequence
        self.localSequence = localSequence
        self.checkpointId = checkpointId
        self.updatedAt = updatedAt
    }
}

public enum MobileConflictKind: String, Codable, Sendable {
    case readingPosition = "reading-position"
    case bookmark
    case annotation
    case document
}

public enum MobileConflictState: String, Codable, Sendable {
    case pending
    case resolved
    case ignored
    case merged
}

public struct MobileConflict: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let kind: MobileConflictKind
    public let entityId: String
    public let localPayload: Data
    public let remotePayload: Data
    public var state: MobileConflictState
    public let createdAt: String
}

public struct MobileSyncStatus: Codable, Sendable, Equatable {
    public var phase: String
    public var pendingOperations: Int
    public var pendingConflicts: Int
    public var lastSuccessfulSync: String?
    public var progress: Double
    public var error: String?
}
