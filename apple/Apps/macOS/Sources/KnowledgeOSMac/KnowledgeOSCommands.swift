#if canImport(SwiftUI)
import SwiftUI

struct KnowledgeOSCommands: Commands {
    @ObservedObject
    var appModel: AppModel

    var body: some Commands {
        CommandMenu("Navigate") {
            navigationButton(
                "Library",
                item: .library,
                key: "1"
            )

            navigationButton(
                "Search",
                item: .search,
                key: "2"
            )

            navigationButton(
                "Knowledge Graph",
                item: .knowledgeGraph,
                key: "3"
            )

            navigationButton(
                "AI Assistant",
                item: .ai,
                key: "4"
            )

            Divider()

            navigationButton(
                "Import",
                item: .importFiles,
                key: "i"
            )

            navigationButton(
                "Export",
                item: .exportFiles,
                key: "e"
            )
        }

        CommandMenu("Document") {
            Button("Close Document") {
                appModel.closeDocument()
            }
            .keyboardShortcut(
                "w",
                modifiers: [.command]
            )
            .disabled(
                appModel.openDocumentID == nil
            )
        }

        CommandMenu("KnowledgeOS") {
            Button("Refresh Diagnostics") {
                Task {
                    await appModel
                        .applicationStatusViewModel?
                        .refresh()
                }
            }
            .keyboardShortcut(
                "r",
                modifiers:
                    [.command, .option]
            )

            Button("Toggle Inspector") {
                appModel.toggleInspector()
            }
            .keyboardShortcut(
                "i",
                modifiers:
                    [.command, .option]
            )
        }
    }

    private func navigationButton(
        _ title: String,
        item: SidebarItem,
        key: KeyEquivalent
    ) -> some View {
        Button(title) {
            appModel.select(item)
        }
        .keyboardShortcut(
            key,
            modifiers: [.command]
        )
    }
}
#endif
