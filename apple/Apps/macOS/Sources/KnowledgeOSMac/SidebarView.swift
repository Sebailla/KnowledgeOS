#if canImport(SwiftUI)
import SwiftUI

struct SidebarView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        List(
            SidebarItem.allCases,
            selection: $appModel.selectedSidebarItem
        ) { item in
            Label(
                item.title,
                systemImage: item.systemImage
            )
            .tag(item)
        }
        .navigationTitle("KnowledgeOS")
    }
}

#endif
