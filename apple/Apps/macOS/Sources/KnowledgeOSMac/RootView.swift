#if canImport(SwiftUI)
import SwiftUI

struct RootView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        Group {
            switch appModel.state {
            case .idle, .starting:
                ProgressView("Starting KnowledgeOS…")
                    .frame(minWidth: 900, minHeight: 600)

            case .running:
                MainWorkspaceView()

            case .failed(let message):
                ContentUnavailableView(
                    "KnowledgeOS could not start",
                    systemImage: "exclamationmark.triangle",
                    description: Text(message)
                )
                .frame(minWidth: 900, minHeight: 600)

            case .stopped:
                ContentUnavailableView(
                    "KnowledgeOS is stopped",
                    systemImage: "pause.circle"
                )
                .frame(minWidth: 900, minHeight: 600)
            }
        }
    }
}

#endif
