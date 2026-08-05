import Foundation

public enum MobileImportFormat: String, Codable, Sendable, CaseIterable {
    case pdf, epub, markdown, html, text, image
}

public enum MobileImportJobState: String, Codable, Sendable {
    case queued, copying, completed, failed, cancelled, duplicate
}

public struct MobileImportRequest: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let originalName: String
    public let sourcePath: String?
    public let textContent: String?
    public let sharedURL: String?
    public let createdAt: String

    public init(id: String = UUID().uuidString, originalName: String, sourcePath: String? = nil, textContent: String? = nil, sharedURL: String? = nil, createdAt: String = ISO8601DateFormatter().string(from: Date())) {
        self.id=id;self.originalName=originalName;self.sourcePath=sourcePath;self.textContent=textContent;self.sharedURL=sharedURL;self.createdAt=createdAt
    }
}

public struct MobileImportJob: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let originalName: String
    public let sanitizedName: String
    public let format: MobileImportFormat
    public let checksum: String
    public let size: Int
    public var state: MobileImportJobState
    public var progress: Double
    public let createdAt: String
    public var updatedAt: String
    public var documentId: String?
    public var localPath: String?
    public var error: String?
}

public struct MobileImportResult: Codable, Sendable, Equatable {
    public let job: MobileImportJob
    public let libraryItem: MobileLibraryItem?
}

public enum MobileImportError: Error, LocalizedError, Equatable {
    case unsupportedFormat
    case executableRejected
    case fileTooLarge
    case invalidName
    case unavailableContent

    public var errorDescription: String? {
        switch self {
        case .unsupportedFormat: "Unsupported file format."
        case .executableRejected: "Executable files cannot be imported."
        case .fileTooLarge: "The file exceeds the configured import limit."
        case .invalidName: "The file name is invalid."
        case .unavailableContent: "The shared content is unavailable."
        }
    }
}
