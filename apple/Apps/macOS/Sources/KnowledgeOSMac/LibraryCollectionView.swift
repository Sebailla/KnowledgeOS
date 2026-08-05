#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

struct LibraryCollectionView: View {
    enum Mode {
        case recent
        case favorites
    }

    @EnvironmentObject
    private var appModel: AppModel

    @ObservedObject
    var viewModel: LibraryViewModel

    let mode: Mode

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView(
                    mode == .recent
                        ? "Loading Recent…"
                        : "Loading Favorites…"
                )
            } else if let error =
                viewModel.errorMessage {
                ContentUnavailableView(
                    "Library unavailable",
                    systemImage:
                        "exclamationmark.triangle",
                    description: Text(error)
                )
            } else if viewModel.items.isEmpty {
                ContentUnavailableView(
                    mode == .recent
                        ? "No Recent Documents"
                        : "No Favorites",
                    systemImage:
                        mode == .recent
                            ? "clock"
                            : "star"
                )
            } else {
                List(
                    viewModel.items,
                    selection:
                        $viewModel
                            .selectedItemID
                ) { item in
                    VStack(
                        alignment: .leading,
                        spacing: 4
                    ) {
                        Text(item.title)
                            .font(.headline)

                        Text(
                            item.authors.joined(
                                separator: ", "
                            )
                        )
                        .font(.caption)
                        .foregroundStyle(
                            .secondary
                        )
                    }
                    .tag(item.id)
                    .contentShape(Rectangle())
                    .onTapGesture(count: 2) {
                        appModel.openDocument(
                            id: item.id
                        )
                    }
                }
            }
        }
        .task(id: modeID) {
            switch mode {
            case .recent:
                await viewModel.loadRecent()
            case .favorites:
                await viewModel
                    .loadFavorites()
            }
        }
    }

    private var modeID: String {
        switch mode {
        case .recent:
            "recent"
        case .favorites:
            "favorites"
        }
    }
}
#endif
