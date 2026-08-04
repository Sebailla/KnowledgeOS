#if canImport(SwiftUI)
import SwiftUI

struct WorkspaceContentView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text(appModel.activeWorkspaceName)
                    .font(.headline)

                Spacer()

                Text(appModel.selectedSidebarItem.title)
                    .foregroundStyle(.secondary)
            }
            .padding()

            Divider()

            Group {
                if let id=appModel.openDocumentID, let vm=appModel.documentReaderViewModel { DocumentReaderView(viewModel:vm,documentID:id) } else {
                switch appModel.selectedSidebarItem {
                case .library:
                    if let viewModel =
                        appModel.libraryViewModel {
                        LibraryBrowserView(
                            viewModel: viewModel
                        )
                    } else {
                        ProgressView(
                            "Loading Library…"
                        )
                    }
                case .recent:
                    PlaceholderView(
                        title: "Recent",
                        systemImage: "clock"
                    )
                case .favorites:
                    PlaceholderView(
                        title: "Favorites",
                        systemImage: "star"
                    )
                case .search:
                    PlaceholderView(
                        title: "Semantic Search",
                        systemImage: "magnifyingglass"
                    )
                case .knowledgeGraph:
                    PlaceholderView(
                        title: "Knowledge Graph",
                        systemImage: "point.3.connected.trianglepath.dotted"
                    )
                case .ai:
                    PlaceholderView(
                        title: "AI Assistant",
                        systemImage: "sparkles"
                    )
                }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

private struct PlaceholderView: View {
    let title: String
    let systemImage: String

    var body: some View {
        ContentUnavailableView(
            title,
            systemImage: systemImage
        )
    }
}

#endif
