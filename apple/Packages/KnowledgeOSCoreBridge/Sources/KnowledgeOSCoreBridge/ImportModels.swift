import Foundation

public enum ImportFormatDTO:
String, Codable, Sendable {
    case pdf
    case epub
    case markdown
    case html
    case text
}

public enum ImportJobStateDTO:
String, Codable, Sendable {
    case queued
    case running
    case completed
    case failed
    case cancelled
}

public struct ImportPreviewDTO:
Codable, Sendable, Equatable {
    public let name: String
    public let format: ImportFormatDTO
    public let mediaType: String
    public let title: String
    public let checksum: String
    public let size: Int
    public let duplicate: Bool
    public let requiresOCR: Bool
    public let metadata:
        [String: JSONValue]
}

public struct ImportResultDTO:
Codable, Sendable, Equatable {
    public let documentId: String
    public let title: String
    public let format: ImportFormatDTO
    public let checksum: String
}

public struct ImportJobDTO:
Codable, Sendable, Equatable, Identifiable {
    public struct Input:
    Codable, Sendable, Equatable {
        public let name: String
        public let content: String
        public let mediaType: String?
        public let extensionName: String?
        public let metadata:
            [String: JSONValue]?
        public let runOCR: Bool?

        enum CodingKeys: String, CodingKey {
            case name
            case content
            case mediaType
            case extensionName = "extension"
            case metadata
            case runOCR
        }
    }

    public let id: String
    public let input: Input
    public let preview: ImportPreviewDTO
    public let state: ImportJobStateDTO
    public let progress: Double
    public let createdAt: String
    public let updatedAt: String
    public let result: ImportResultDTO?
    public let error: String?
}

public struct ImportHistoryDTO:
Codable, Sendable, Equatable {
    public let jobs: [ImportJobDTO]
}
