import Foundation
public struct GraphNodeDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let type:String; public let label:String; public let properties:[String:JSONValue] }
public struct GraphEdgeDTO: Codable, Sendable, Equatable, Identifiable { public let id:String; public let type:String; public let sourceId:String; public let targetId:String; public let directed:Bool; public let properties:[String:JSONValue] }
public struct GraphSubgraphDTO: Codable, Sendable, Equatable { public let nodes:[GraphNodeDTO]; public let edges:[GraphEdgeDTO] }
public struct GraphPathDTO: Codable, Sendable, Equatable { public let nodes:[GraphNodeDTO]; public let edges:[GraphEdgeDTO] }
public struct GraphPathEnvelopeDTO: Codable, Sendable, Equatable { public let path:GraphPathDTO? }
public struct GraphNodesEnvelopeDTO: Codable, Sendable, Equatable { public let nodes:[GraphNodeDTO] }
public struct GraphStatisticsDTO: Codable, Sendable, Equatable { public let nodeCount:Int; public let edgeCount:Int; public let nodeTypes:[String:Int]; public let edgeTypes:[String:Int]; public let connectedComponents:Int }
