import Foundation
public enum DocumentContentFormat:String,Codable,Sendable { case plainText="plain-text"; case markdown; case pdf }
public struct DocumentSectionDTO:Codable,Sendable,Equatable,Identifiable { public let id:String; public let title:String; public let pageNumber:Int; public let level:Int }
public struct DocumentDescriptorDTO:Codable,Sendable,Equatable,Identifiable { public let id:String; public let title:String; public let authors:[String]; public let pageCount:Int; public let format:DocumentContentFormat; public let sections:[DocumentSectionDTO]; public let metadata:[String:JSONValue] }
public struct DocumentPageDTO:Codable,Sendable,Equatable { public let documentId:String; public let pageNumber:Int; public let pageCount:Int; public let content:String; public let format:DocumentContentFormat }
public struct DocumentLocationDTO:Codable,Sendable,Equatable { public let documentId:String; public let pageNumber:Int; public let progress:Double; public let updatedAt:String }
public struct DocumentLocationEnvelope:Codable,Sendable,Equatable { public let location:DocumentLocationDTO? }
