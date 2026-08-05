#if canImport(SwiftUI)
import SwiftUI

struct MainWorkspaceView: View {
    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        NavigationSplitView {
            SidebarView()
        } content: {
            WorkspaceContentView()
        } detail: {
            if appModel.isInspectorVisible {
                InspectorView()
            }
        }
        .searchable(
            text: $appModel.searchText,
            placement: .toolbar,
            prompt:
                "Search your knowledge"
        )
        .onSubmit(of: .search) {
            routeSearch()
        }
        .onChange(
            of: appModel.searchText
        ) {
            if appModel
                .selectedSidebarItem ==
                .library {
                appModel
                    .libraryViewModel?
                    .queryText =
                    appModel.searchText
            }
        }
        .toolbar {
            ToolbarItemGroup {
                if let sync =
                    appModel
                        .syncViewModel?
                        .status {
                    Label(
                        sync.phase.rawValue,
                        systemImage:
                            sync.phase.rawValue ==
                            "running"
                                ? "arrow.triangle.2.circlepath"
                                : "checkmark.circle"
                    )
                    .foregroundStyle(
                        .secondary
                    )
                }

                Button {
                    Task {
                        await appModel
                            .applicationStatusViewModel?
                            .refresh()
                    }
                } label: {
                    Label(
                        "Refresh Status",
                        systemImage:
                            "arrow.clockwise"
                    )
                }

                Button {
                    appModel.toggleInspector()
                } label: {
                    Label(
                        "Toggle Inspector",
                        systemImage:
                            "sidebar.right"
                    )
                }
            }
        }
        .frame(
            minWidth: 1100,
            minHeight: 700
        )
    }

    private func routeSearch() {
        guard
            !appModel.searchText
                .trimmingCharacters(
                    in:
                        .whitespacesAndNewlines
                )
                .isEmpty
        else {
            return
        }

        if appModel
            .selectedSidebarItem !=
            .library {
            appModel.select(.search)
            appModel
                .localSearchViewModel?
                .query =
                appModel.searchText

            Task {
                await appModel
                    .localSearchViewModel?
                    .search()
            }
        }
    }
}
#endif
