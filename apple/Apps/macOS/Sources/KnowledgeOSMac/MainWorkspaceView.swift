#if canImport(SwiftUI)
import SwiftUI

struct MainWorkspaceView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        NavigationSplitView {
            SidebarView()
        } content: {
            WorkspaceContentView()
        } detail: {
            if appModel.isInspectorVisible {
                InspectorView()
            } else {
                EmptyView()
            }
        }
        .searchable(
            text: $appModel.searchText,
            placement: .toolbar,
            prompt: "Search your knowledge"
        )
        .toolbar {
            ToolbarItem {
                Button {
                    appModel.toggleInspector()
                } label: {
                    Label(
                        "Toggle Inspector",
                        systemImage: "sidebar.right"
                    )
                }
            }
        }
        .frame(minWidth: 1100, minHeight: 700)
    }
}

#endif
