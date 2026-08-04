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
                switch appModel.selectedSidebarItem {
                case .library:
                    LibraryPlaceholderView()
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
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

private struct LibraryPlaceholderView: View {
    var body: some View {
        ContentUnavailableView(
            "Library",
            systemImage: "books.vertical",
            description: Text(
                "Your local and Master Library content will appear here."
            )
        )
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
