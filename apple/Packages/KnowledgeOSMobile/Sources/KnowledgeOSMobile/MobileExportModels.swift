import Foundation
public enum MobileExportFormat:String,Codable,Sendable,CaseIterable { case markdown,html,text,pdf; case knowledgePackage="knowledge-package" }
public enum MobileExportState:String,Codable,Sendable { case queued,running,completed,failed,cancelled }
public struct MobileExportManifest:Codable,Sendable,Equatable { public let version:Int; public let format:MobileExportFormat; public let createdAt:String; public let sourceIDs:[String]; public let checksum:String }
public struct MobileExportJob:Codable,Sendable,Equatable,Identifiable { public let id:String; public let format:MobileExportFormat; public let title:String; public let state:MobileExportState; public let progress:Double; public let createdAt:String; public let updatedAt:String; public let fileName:String; public let content:String?; public let checksum:String?; public let manifest:MobileExportManifest?; public let error:String? }
public enum MobileDeepLink:Sendable,Equatable { case document(id:String,anchor:String?); case search(String); case graphNode(String); case conversation(String); case importFiles; case export(String) }
public struct MobileHandoffState:Codable,Sendable,Equatable { public let documentID:String?; public let sectionID:String?; public let anchor:String?; public let progress:Double?; public let searchQuery:String?; public let conversationID:String?; public let updatedAt:String }
