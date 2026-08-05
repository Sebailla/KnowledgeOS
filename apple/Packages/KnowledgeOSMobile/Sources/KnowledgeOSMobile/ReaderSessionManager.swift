import Foundation

public actor ReaderSessionManager {
    private let store: MobileLocalStore
    private let navigator = MobileDocumentNavigator()

    public init(store: MobileLocalStore) { self.store = store }

    public func open(_ item: MobileLibraryItem) async throws -> (MobileReaderDocument, MobileReaderSession) {
        let document = navigator.document(from: item)
        let snapshot = await store.current()
        if let existing = snapshot.readerSessions[item.id] {
            return (document, existing)
        }
        let first = document.sections.first ?? .init(id: "section:0", title: item.title, body: item.summary, anchor: "section-0")
        let session = MobileReaderSession(
            documentId: item.id,
            sectionId: first.id,
            anchor: first.anchor,
            progress: 0,
            updatedAt: now()
        )
        try await store.saveReaderSession(session)
        try await store.markRecent(documentId: item.id)
        return (document, session)
    }

    public func updatePosition(documentId: String, sectionId: String, anchor: String, progress: Double) async throws {
        let session = MobileReaderSession(
            documentId: documentId,
            sectionId: sectionId,
            anchor: anchor,
            progress: min(1, max(0, progress)),
            updatedAt: now()
        )
        try await store.saveReaderSession(session)
        try await store.savePosition(.init(documentId: documentId, locator: anchor, progress: session.progress, updatedAt: session.updatedAt))
        try await enqueue(entityType: "reading-position", entityId: documentId, payload: ["locator": anchor, "progress": session.progress])
    }

    public func savePreferences(documentId: String, preferences: MobileReaderPreferences) async throws {
        try await store.saveReaderPreferences(documentId: documentId, value: preferences)
    }

    public func addBookmark(documentId: String, sectionId: String, anchor: String, title: String?) async throws -> MobileBookmark {
        let bookmark = MobileBookmark(id: UUID().uuidString, documentId: documentId, locator: anchor, title: title, updatedAt: now())
        try await store.saveBookmark(bookmark)
        try await enqueue(entityType: "bookmark", entityId: bookmark.id, payload: ["documentId": documentId, "sectionId": sectionId, "locator": anchor, "title": title ?? ""])
        return bookmark
    }

    public func addAnnotation(
        documentId: String,
        sectionId: String,
        anchor: String,
        selectedText: String,
        note: String?,
        style: MobileAnnotationStyle,
        color: MobileAnnotationColor
    ) async throws -> MobileReaderAnnotation {
        let timestamp = now()
        let annotation = MobileReaderAnnotation(
            id: UUID().uuidString,
            documentId: documentId,
            sectionId: sectionId,
            anchor: anchor,
            selectedText: selectedText,
            note: note,
            style: style,
            color: color,
            createdAt: timestamp,
            updatedAt: timestamp
        )
        try await store.saveReaderAnnotation(annotation)
        try await store.saveAnnotation(.init(id: annotation.id, documentId: documentId, locator: anchor, text: selectedText, note: note, updatedAt: timestamp))
        try await enqueue(entityType: "annotation", entityId: annotation.id, payload: ["documentId": documentId, "sectionId": sectionId, "locator": anchor, "text": selectedText, "note": note ?? "", "style": style.rawValue, "color": color.rawValue])
        return annotation
    }

    public func deleteAnnotation(id: String) async throws {
        try await store.deleteReaderAnnotation(id: id)
        try await enqueue(entityType: "annotation", entityId: id, operationType: "delete", payload: [:])
    }

    public func saveInkStroke(_ stroke: MobileInkStroke) async throws {
        try await store.saveInkStroke(stroke)
        try await enqueue(entityType: "annotation", entityId: stroke.id, payload: ["kind": "ink", "documentId": stroke.documentId, "sectionId": stroke.sectionId, "anchor": stroke.anchor, "color": stroke.color.rawValue, "width": stroke.width])
    }

    public nonisolated func search(_ query: String, in document: MobileReaderDocument) -> [MobileDocumentSearchResult] {
        navigator.search(query, in: document)
    }

    private func enqueue(entityType: String, entityId: String, operationType: String = "upsert", payload: [String: Any]) async throws {
        let operationId = UUID().uuidString
        let envelope: [String: Any] = [
            "protocolVersion": "1.0",
            "requestId": UUID().uuidString,
            "sessionId": "mobile-reader",
            "deviceId": "mobile",
            "clientVersion": "0.36.0",
            "batch": [
                "batchId": UUID().uuidString,
                "protocolVersion": "1.0",
                "operations": [[
                    "operationId": operationId,
                    "protocolVersion": "1.0",
                    "entityType": entityType,
                    "operationType": operationType,
                    "entityId": entityId,
                    "deviceId": "mobile",
                    "userId": "local-user",
                    "sequence": Int(Date().timeIntervalSince1970 * 1000),
                    "timestamp": now(),
                    "payload": payload,
                    "checksum": "mobile"
                ]],
                "cursor": ["serverSequence": 0, "localSequence": 0],
                "createdAt": now(),
                "checksum": "mobile"
            ],
            "checksum": "mobile"
        ]
        let data = try JSONSerialization.data(withJSONObject: envelope, options: [.sortedKeys])
        try await store.enqueue(.init(id: operationId, method: "POST", payload: data, idempotencyKey: "reader:\(operationId)", createdAt: now()))
    }

    private func now() -> String { ISO8601DateFormatter().string(from: Date()) }
}
