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

public enum ImportStateDTO: String, Codable, Sendable {
    case staged = "Staged"
    case validating = "Validating"
    case rejected = "Rejected"
    case failed = "Failed"
    case recoveryRequired = "RecoveryRequired"
    case processingQueued = "ProcessingQueued"
}

public struct StagedImportRequestV2DTO: Codable, Sendable, Equatable {
    public struct Source: Codable, Sendable, Equatable {
        public let kind: String
        public let capability: String
        public init(kind: String, capability: String) { self.kind = kind; self.capability = capability }
    }

    public let contractVersion: Int
    public let operationId: String
    public let idempotencyKey: String
    public let source: Source
    public let name: String
    public let byteLength: Int
    public let sha256: String
    public let mediaType: String?
    public let extensionName: String?
    public let runOCR: Bool?

    public init(contractVersion: Int, operationId: String, idempotencyKey: String, source: Source, name: String, byteLength: Int, sha256: String, mediaType: String?, extensionName: String?, runOCR: Bool?) {
        self.contractVersion = contractVersion; self.operationId = operationId; self.idempotencyKey = idempotencyKey; self.source = source; self.name = name; self.byteLength = byteLength; self.sha256 = sha256; self.mediaType = mediaType; self.extensionName = extensionName; self.runOCR = runOCR
    }

    enum CodingKeys: String, CodingKey {
        case contractVersion, operationId, idempotencyKey, source, name, byteLength, sha256, mediaType, runOCR
        case extensionName = "extension"
    }
}

public struct QueuedStagedImportDTO: Codable, Sendable, Equatable {
    public let operationId: String
    public let leaseId: String
    public let state: ImportStateDTO
}

public struct ProcessingLeaseDTO: Codable, Sendable, Equatable {
    public let leaseId: String
    public let capability: String
    public let descriptor: Int
    public let owner: String
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
