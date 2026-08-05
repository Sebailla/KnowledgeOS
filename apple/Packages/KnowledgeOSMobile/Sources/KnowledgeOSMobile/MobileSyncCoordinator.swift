import Foundation
import KnowledgeOSCoreBridge

public actor MobileSyncCoordinator {
    public enum State:Sendable,Equatable { case idle,offline,synchronizing,paused,failed(String) }
    public struct PullResponse:Decodable { public let operations:[JSONValue]; public let cursor:Cursor; public struct Cursor:Decodable { public let serverSequence:Int; public let localSequence:Int } }
    public struct PushAck:Decodable { public let acceptedOperationIds:[String]; public let duplicateOperationIds:[String]; public let cursor:Cursor; public struct Cursor:Decodable { public let serverSequence:Int; public let localSequence:Int } }
    private let client:MobileHTTPClient; private let store:MobileLocalStore; private(set) public var state:State = .idle; private var cancelled=false
    public init(client:MobileHTTPClient,store:MobileLocalStore){self.client=client;self.store=store}
    public func pause(){state = .paused}
    public func resume() async {guard state == .paused else{return};await synchronize()}
    public func cancel(){cancelled=true}
    public func markOffline(){state = .offline}
    public func status() async -> MobileSyncStatus { let snapshot=await store.current(); return .init(phase:String(describing:state),pendingOperations:snapshot.offlineOperations.count,pendingConflicts:snapshot.conflicts.filter{$0.state == .pending}.count,lastSuccessfulSync:snapshot.lastSuccessfulSync,progress:state == .synchronizing ? 0.5 : 0,error:{if case .failed(let message)=state{return message};return nil}()) }

    public func synchronize() async {
        guard state != .paused else{return}; cancelled=false; state = .synchronizing
        do {
            try await pushPending()
            if cancelled { state = .idle; return }
            try await pullRemote()
            let now=ISO8601DateFormatter().string(from:Date()); try await store.recordSuccessfulSync(now); state = .idle
        } catch { state = .failed(error.localizedDescription) }
    }

    private func pushPending() async throws {
        let snapshot=await store.current()
        for var operation in snapshot.offlineOperations {
            if cancelled { return }
            do {
                let ack:PushAck=try await client.send("v1/usp/envelopes",method:"POST",body:operation.payload,headers:["Idempotency-Key":operation.idempotencyKey],as:PushAck.self)
                try await store.removeOperation(id:operation.id)
                let current=await store.current(); try await store.saveCheckpoint(.init(serverSequence:max(current.checkpoint.serverSequence,ack.cursor.serverSequence),localSequence:ack.cursor.localSequence,checkpointId:current.checkpoint.checkpointId,updatedAt:ISO8601DateFormatter().string(from:Date())))
            } catch {
                operation.retryCount += 1; let delay=min(3600,pow(2.0,Double(operation.retryCount))*2); operation.nextAttemptAt=ISO8601DateFormatter().string(from:Date().addingTimeInterval(delay)); try await store.replaceOperation(operation); throw error
            }
        }
    }

    private func pullRemote() async throws {
        let snapshot=await store.current(); let request:[String:Int]=["serverSequence":snapshot.checkpoint.serverSequence,"limit":100]; let body=try JSONEncoder().encode(request)
        let response:PullResponse=try await client.send("v1/usp/pull",method:"POST",body:body,as:PullResponse.self)
        for operation in response.operations { try await apply(operation) }
        try await store.saveCheckpoint(.init(serverSequence:response.cursor.serverSequence,localSequence:max(snapshot.checkpoint.localSequence,response.cursor.localSequence),checkpointId:snapshot.checkpoint.checkpointId,updatedAt:ISO8601DateFormatter().string(from:Date())))
    }

    private func apply(_ operation:JSONValue) async throws {
        guard case .object(let value)=operation,case .string(let entityType)?=value["entityType"],case .string(let entityId)?=value["entityId"] else{return}
        if entityType == "reading-position",case .object(let payload)?=value["payload"],case .string(let locator)?=payload["locator"] { let progress:Double={if case .number(let n)?=payload["progress"]{return n};return 0}();try await store.savePosition(.init(documentId:entityId,locator:locator,progress:progress,updatedAt:ISO8601DateFormatter().string(from:Date())));return }
        if entityType == "bookmark" { return }
        if entityType == "annotation" { return }
    }
}
