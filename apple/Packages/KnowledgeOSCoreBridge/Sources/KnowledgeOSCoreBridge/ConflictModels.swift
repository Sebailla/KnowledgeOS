import Foundation
public enum ConflictStatusDTO: String, Codable, Sendable { case pending, resolved, ignored, merged }
public enum ConflictResolutionStrategyDTO: String, Codable, Sendable { case lastWriteWins = "last-write-wins"; case mergeBookmarks = "merge-bookmarks"; case mergeAnnotations = "merge-annotations"; case keepLocal = "keep-local"; case keepRemote = "keep-remote"; case manual; case ignore }
public struct ConflictDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let entityType:String; public let entityId:String; public let kind:String; public let status:ConflictStatusDTO; public let suggestedStrategy:ConflictResolutionStrategyDTO; public let createdAt:String; public let resolvedAt:String?; public let resolution:ConflictResolutionStrategyDTO? }
public struct ConflictListDTO: Codable, Sendable, Equatable { public let conflicts:[ConflictDTO] }
public struct ConflictPreviewDTO: Codable, Sendable, Equatable { public let conflictId:String; public let automatic:Bool; public let strategy:ConflictResolutionStrategyDTO; public let localPayload:JSONValue; public let remotePayload:JSONValue; public let mergedPayload:JSONValue?; public let reason:String }
public struct ConflictStatisticsDTO: Codable, Sendable, Equatable { public let total:Int; public let pending:Int; public let resolved:Int }
