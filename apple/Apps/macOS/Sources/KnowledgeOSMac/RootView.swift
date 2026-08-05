#if canImport(SwiftUI)
import SwiftUI

struct RootView: View {
    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        Group {
            switch appModel.state {
            case .idle, .starting:
                VStack(spacing: 16) {
                    ProgressView()
                    Text(
                        "Starting KnowledgeOS…"
                    )
                    .font(.headline)

                    Text(
                        "Initializing the Core Host and local engines."
                    )
                    .foregroundStyle(.secondary)
                }
                .frame(
                    minWidth: 900,
                    minHeight: 600
                )

            case .running:
                MainWorkspaceView()

            case .failed(let message):
                VStack(spacing: 18) {
                    ContentUnavailableView(
                        "KnowledgeOS could not start",
                        systemImage:
                            "exclamationmark.triangle",
                        description: Text(message)
                    )

                    Button(
                        "Retry Core Startup"
                    ) {
                        Task {
                            await appModel
                                .retryStart()
                        }
                    }
                    .keyboardShortcut(
                        .defaultAction
                    )
                }
                .frame(
                    minWidth: 900,
                    minHeight: 600
                )

            case .stopped:
                VStack(spacing: 18) {
                    ContentUnavailableView(
                        "KnowledgeOS is stopped",
                        systemImage:
                            "pause.circle"
                    )

                    Button("Start") {
                        Task {
                            await appModel.start()
                        }
                    }
                }
                .frame(
                    minWidth: 900,
                    minHeight: 600
                )
            }
        }
        .onOpenURL { url in
            DeepLinkCoordinator.handle(url, appModel: appModel)
        }
    }
}
#endif
