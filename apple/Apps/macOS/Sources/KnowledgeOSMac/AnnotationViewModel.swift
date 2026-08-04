#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class AnnotationViewModel: ObservableObject {
    @Published private(set) var items: [AnnotationDTO] = []
    @Published var draftNote = ""
    @Published var selectedColor: AnnotationColor = .yellow
    @Published var errorMessage: String?

    private let service: AnnotationService

    init(service: AnnotationService) {
        self.service = service
    }

    func load(documentId: String) async {
        do {
            items = try await service.list(documentId: documentId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func addBookmark(documentId: String, pageNumber: Int) async {
        do {
            _ = try await service.create(
                id: UUID().uuidString,
                kind: .bookmark,
                anchor: AnnotationAnchorDTO(
                    documentId: documentId,
                    pageNumber: pageNumber,
                    startOffset: nil,
                    endOffset: nil,
                    selectedText: nil
                ),
                color: nil,
                body: nil
            )

            await load(documentId: documentId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func addNote(documentId: String, pageNumber: Int) async {
        let normalized = draftNote.trimmingCharacters(in: .whitespacesAndNewlines)

        guard !normalized.isEmpty else {
            return
        }

        do {
            _ = try await service.create(
                id: UUID().uuidString,
                kind: .note,
                anchor: AnnotationAnchorDTO(
                    documentId: documentId,
                    pageNumber: pageNumber,
                    startOffset: nil,
                    endOffset: nil,
                    selectedText: nil
                ),
                color: selectedColor,
                body: normalized
            )

            draftNote = ""
            await load(documentId: documentId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
#endif
