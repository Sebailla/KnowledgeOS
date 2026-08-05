#if canImport(SwiftUI)
import SwiftUI

struct WorkspaceContentView: View {
    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            content
                .frame(
                    maxWidth: .infinity,
                    maxHeight: .infinity
                )
        }
    }

    private var header:
    some View {
        HStack {
            Text(
                appModel.activeWorkspaceName
            )
            .font(.headline)

            Spacer()

            if let status =
                appModel
                    .applicationStatusViewModel?
                    .status {
                Label(
                    status.phase.capitalized,
                    systemImage:
                        status.phase == "ready"
                            ? "checkmark.circle"
                            : "exclamationmark.circle"
                )
                .foregroundStyle(
                    status.phase == "ready"
                        ? .green
                        : .orange
                )
            }

            Text(
                appModel
                    .selectedSidebarItem
                    .title
            )
            .foregroundStyle(.secondary)
        }
        .padding()
    }

    @ViewBuilder
    private var content:
    some View {
        if
            let id =
                appModel.openDocumentID,
            let viewModel =
                appModel
                    .documentReaderViewModel {
            DocumentReaderView(
                viewModel: viewModel,
                documentID: id
            )
        } else {
            switch appModel
                .selectedSidebarItem {
            case .library:
                if let viewModel =
                    appModel.libraryViewModel {
                    LibraryBrowserView(
                        viewModel: viewModel
                    )
                }

            case .recent:
                if let viewModel =
                    appModel.libraryViewModel {
                    LibraryCollectionView(
                        viewModel: viewModel,
                        mode: .recent
                    )
                }

            case .favorites:
                if let viewModel =
                    appModel.libraryViewModel {
                    LibraryCollectionView(
                        viewModel: viewModel,
                        mode: .favorites
                    )
                }

            case .search:
                if let viewModel =
                    appModel
                        .localSearchViewModel {
                    LocalSearchView(
                        viewModel: viewModel
                    )
                }

            case .knowledgeGraph:
                if let viewModel =
                    appModel
                        .knowledgeGraphViewModel {
                    KnowledgeGraphView(
                        viewModel: viewModel
                    )
                }

            case .ai:
                if let viewModel =
                    appModel
                        .aiAssistantViewModel {
                    AIAssistantView(
                        viewModel: viewModel
                    )
                }

            case .importFiles:
                if let viewModel =
                    appModel.importViewModel {
                    ImportView(
                        viewModel: viewModel
                    )
                }

            case .exportFiles:
                if let viewModel =
                    appModel.exportViewModel {
                    ExportView(
                        viewModel: viewModel
                    )
                }
            }
        }
    }
}
#endif
