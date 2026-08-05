import Foundation
public struct AIModelDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let providerId:String; public let name:String; public let local:Bool; public let contextWindow:Int; public let capabilities:[String] }
public struct AIModelsDTO: Codable, Sendable, Equatable { public let models:[AIModelDTO] }
public struct AIContextSourceDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let title:String; public let kind:String; public let excerpt:String }
public struct AIMessageDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let role:String; public let content:String; public let createdAt:String; public let sources:[AIContextSourceDTO]? }
public struct AIConversationDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let title:String; public let modelId:String; public let messages:[AIMessageDTO]; public let createdAt:String; public let updatedAt:String }
public struct AIConversationsDTO: Codable, Sendable, Equatable { public let conversations:[AIConversationDTO] }
public struct AIRuntimeHealthDTO: Codable, Sendable, Equatable { public let status:String; public let selectedModelId:String?; public let modelCount:Int; public let conversationCount:Int; public let localOnly:Bool }
