import Foundation
public enum AnnotationKind:String,Codable,Sendable,CaseIterable { case highlight,note,bookmark }
public enum AnnotationColor:String,Codable,Sendable,CaseIterable { case yellow,green,blue,pink,purple }
public struct AnnotationAnchorDTO:Codable,Sendable,Equatable { public let documentId:String; public let pageNumber:Int; public let startOffset:Int?; public let endOffset:Int?; public let selectedText:String?; public init(documentId:String,pageNumber:Int,startOffset:Int?,endOffset:Int?,selectedText:String?){ self.documentId=documentId; self.pageNumber=pageNumber; self.startOffset=startOffset; self.endOffset=endOffset; self.selectedText=selectedText } }
public struct AnnotationDTO:Codable,Sendable,Equatable,Identifiable { public let id:String; public let kind:AnnotationKind; public let anchor:AnnotationAnchorDTO; public let color:AnnotationColor?; public let body:String?; public let createdAt:String; public let updatedAt:String }
public struct AnnotationListDTO:Codable,Sendable,Equatable { public let annotations:[AnnotationDTO] }
public struct AnnotationDeleteDTO:Codable,Sendable,Equatable { public let deleted:Bool }
