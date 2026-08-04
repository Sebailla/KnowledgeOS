import Foundation
public struct PersistenceStoreHealthDTO: Codable, Sendable, Equatable { public let status:String; public let directory:String; public let schemaVersion:Int; public let recoveredFromBackup:Bool }
public struct PersistenceHealthDTO: Codable, Sendable, Equatable { public let reading:PersistenceStoreHealthDTO; public let annotations:PersistenceStoreHealthDTO }
public struct PersistenceBackupDTO: Codable, Sendable, Equatable { public let reading:String; public let annotations:String }
public struct PersistenceRestoreDTO: Codable, Sendable, Equatable { public let restored:Bool }
