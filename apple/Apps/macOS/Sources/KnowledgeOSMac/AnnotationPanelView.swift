#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

struct AnnotationPanelView: View {
    @ObservedObject var viewModel: AnnotationViewModel

    let documentId: String
    let pageNumber: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Annotations")
                    .font(.headline)

                Spacer()

                Button {
                    Task {
                        await viewModel.addBookmark(
                            documentId: documentId,
                            pageNumber: pageNumber
                        )
                    }
                } label: {
                    Image(systemName: "bookmark")
                }
                .help("Bookmark this page")
            }

            TextField(
                "Add a note",
                text: $viewModel.draftNote,
                axis: .vertical
            )

            HStack {
                Picker("Color", selection: $viewModel.selectedColor) {
                    ForEach(AnnotationColor.allCases, id: \.self) { color in
                        Text(color.rawValue.capitalized)
                            .tag(color)
                    }
                }

                Button("Add Note") {
                    Task {
                        await viewModel.addNote(
                            documentId: documentId,
                            pageNumber: pageNumber
                        )
                    }
                }
            }

            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .font(.caption)
                    .foregroundStyle(.red)
            }

            List(viewModel.items) { item in
                VStack(alignment: .leading, spacing: 4) {
                    Label(
                        item.kind.rawValue.capitalized,
                        systemImage: item.kind == .bookmark
                            ? "bookmark.fill"
                            : "note.text"
                    )

                    if let body = item.body {
                        Text(body)
                            .font(.callout)
                    }

                    Text("Page \(item.anchor.pageNumber)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding()
        .task(id: documentId) {
            await viewModel.load(documentId: documentId)
        }
    }
}
#endif
