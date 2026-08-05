import Foundation

public struct USPCursorDTO: Codable, Sendable, Equatable {
    public let serverSequence: Int
    public let localSequence: Int
    public let checkpointId: String?
}

public struct USPOperationDTO: Codable, Sendable, Equatable, Identifiable {
    public var id: String { operationId }
    public let operationId: String
    public let protocolVersion: String
    public let entityType: String
    public let operationType: String
    public let entityId: String
    public let deviceId: String
    public let userId: String
    public let sequence: Int
    public let timestamp: String
    public let payload: JSONValue
    public let checksum: String
}

public struct USPBatchDTO: Codable, Sendable, Equatable {
    public let batchId: String
    public let protocolVersion: String
    public let operations: [USPOperationDTO]
    public let cursor: USPCursorDTO
    public let createdAt: String
    public let checksum: String
}

public struct USPEnvelopeDTO: Codable, Sendable, Equatable {
    public let protocolVersion: String
    public let requestId: String
    public let sessionId: String
    public let deviceId: String
    public let clientVersion: String
    public let batch: USPBatchDTO
    public let checksum: String
}

public struct USPAcknowledgementDTO: Codable, Sendable, Equatable {
    public let batchId: String
    public let acceptedOperationIds: [String]
    public let duplicateOperationIds: [String]
    public let cursor: USPCursorDTO
    public let processedAt: String
}

public struct USPCheckpointDTO: Codable, Sendable, Equatable {
    public let checkpointId: String
    public let cursor: USPCursorDTO
    public let createdAt: String
    public let operationCount: Int
    public let checksum: String
}
