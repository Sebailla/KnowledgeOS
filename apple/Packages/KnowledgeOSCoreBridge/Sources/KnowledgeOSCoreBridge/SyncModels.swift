import Foundation
public enum SyncPhase:String,Codable,Sendable { case idle,running,paused,offline,failed }
public struct SyncConflictDTO:Codable,Sendable,Equatable,Identifiable { public let id:String; public let entityType:String; public let entityId:String; public let localUpdatedAt:String; public let remoteUpdatedAt:String; public let reason:String }
public struct SyncStatusDTO:Codable,Sendable,Equatable { public let phase:SyncPhase; public let cursor:String; public let pending:Int; public let uploaded:Int; public let downloaded:Int; public let retryCount:Int; public let lastSyncAt:String?; public let lastError:String?; public let conflicts:[SyncConflictDTO] }
public struct SyncConflictsDTO:Codable,Sendable,Equatable { public let conflicts:[SyncConflictDTO] }
