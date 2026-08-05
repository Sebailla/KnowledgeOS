import Foundation
public enum ExportFormatDTO:String,Codable,Sendable,CaseIterable { case markdown,html,pdf,epub,text; case knowledgePackage="knowledge-package" }
public struct ExportFormatInfoDTO:Codable,Sendable,Equatable,Identifiable { public let id:ExportFormatDTO; public let name:String; public let mediaType:String }
public struct ExportFormatsDTO:Codable,Sendable,Equatable { public let formats:[ExportFormatInfoDTO] }
public struct ExportPreviewDTO:Codable,Sendable,Equatable { public let format:ExportFormatDTO; public let sourceCount:Int; public let estimatedSize:Int; public let fileName:String; public let mediaType:String; public let includedSections:[String] }
public struct ExportManifestDTO:Codable,Sendable,Equatable { public let version:Int; public let format:ExportFormatDTO; public let createdAt:String; public let sourceIds:[String]; public let checksum:String }
public struct ExportResultDTO:Codable,Sendable,Equatable { public let fileName:String; public let mediaType:String; public let content:String; public let checksum:String; public let manifest:ExportManifestDTO }
public struct ExportJobDTO:Codable,Sendable,Equatable,Identifiable { public let id:String; public let format:ExportFormatDTO; public let state:String; public let progress:Double; public let createdAt:String; public let updatedAt:String; public let preview:ExportPreviewDTO; public let result:ExportResultDTO?; public let error:String? }
public struct ExportHistoryDTO:Codable,Sendable,Equatable { public let jobs:[ExportJobDTO] }
