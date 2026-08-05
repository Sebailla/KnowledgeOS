import Foundation

public actor MobileAIService {
    private let client: MobileHTTPClient?
    private let store: MobileLocalStore

    public init(client: MobileHTTPClient?, store: MobileLocalStore) { self.client = client; self.store = store }

    public func models() -> [MobileAIModel] {
        [MobileAIModel(id: "remote:default", name: "KnowledgeOS Remote", provider: "KnowledgeOS", remote: true)]
    }

    public func send(message: String, conversationId: String?, modelId: String, policy: MobileAIContextPolicy, sourceIds: [String]) async throws -> MobileAIConversation {
        if policy == .restricted { throw MobileAIError.restrictedContext }
        let now = ISO8601DateFormatter().string(from: Date())
        let current = await store.current().aiConversations.first { $0.id == conversationId }
        let id = current?.id ?? UUID().uuidString
        let user = MobileAIMessage(id: UUID().uuidString, role: "user", content: message, createdAt: now, sourceIds: sourceIds)
        let responseText: String
        if let client {
            struct Payload: Codable { let message: String; let modelId: String; let contextQuery: String }
            struct Response: Codable { let messages: [MobileAIMessage] }
            let payload = try JSONEncoder().encode(Payload(message: message, modelId: modelId, contextQuery: message))
            let response: Response = try await client.send("/rpc/ai.chat", method: "POST", body: payload, as: Response.self)
            responseText = response.messages.last?.content ?? "No response."
        } else {
            responseText = "Queued for remote AI: \(message)"
        }
        let assistant = MobileAIMessage(id: UUID().uuidString, role: "assistant", content: responseText, createdAt: ISO8601DateFormatter().string(from: Date()), sourceIds: sourceIds)
        let conversation = MobileAIConversation(id: id, title: current?.title ?? String(message.prefix(60)), modelId: modelId, messages: (current?.messages ?? []) + [user, assistant], updatedAt: assistant.createdAt)
        try await store.saveAIConversation(conversation)
        return conversation
    }
}

public enum MobileAIError: Error { case restrictedContext }
