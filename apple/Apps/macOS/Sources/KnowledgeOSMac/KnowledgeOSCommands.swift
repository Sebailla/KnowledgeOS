#if canImport(SwiftUI)
import SwiftUI

struct KnowledgeOSCommands: Commands {
    @ObservedObject var appModel: AppModel

    var body: some Commands {
        CommandMenu("KnowledgeOS") {
            Button("Toggle Inspector") {
                appModel.toggleInspector()
            }
            .keyboardShortcut(
                "i",
                modifiers: [.command, .option]
            )
        }
    }
}

#endif
