#if canImport(SwiftUI)
import SwiftUI

@main
struct KnowledgeOSMacApp: App {
    @NSApplicationDelegateAdaptor(
        KnowledgeOSAppDelegate.self
    )
    private var appDelegate

    @StateObject
    private var appModel = AppModel(
        bootstrapper:
            ApplicationBootstrapper()
    )

    init() {
        appDelegate.onTerminate = {
            Task {
                await appModel.stop()
            }
        }
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appModel)
                .task {
                    await appModel.start()
                }
        }
        .commands {
            KnowledgeOSCommands(
                appModel: appModel
            )
        }

        Settings {
            SettingsView()
                .environmentObject(appModel)
        }

        Window(
            "About KnowledgeOS",
            id: "about"
        ) {
            AboutView()
                .environmentObject(appModel)
        }
    }
}

final class KnowledgeOSAppDelegate:
NSObject, NSApplicationDelegate {
    var onTerminate:
        (() -> Void)?

    func applicationWillTerminate(
        _ notification: Notification
    ) {
        onTerminate?()
    }
}
#else
import Foundation

@main
enum KnowledgeOSMacValidationApp {
    static func main() async {
        let bootstrapper =
            ApplicationBootstrapper()

        do {
            try await bootstrapper.start()
            await bootstrapper.stop()
        } catch {
            FileHandle.standardError.write(
                Data(
                    error.localizedDescription
                        .utf8
                )
            )
        }
    }
}
#endif
