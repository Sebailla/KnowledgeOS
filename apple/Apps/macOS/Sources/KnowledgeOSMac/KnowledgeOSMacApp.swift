#if canImport(SwiftUI)
import SwiftUI

@main
struct KnowledgeOSMacApp: App {
    @StateObject private var appModel = AppModel(
        bootstrapper: ApplicationBootstrapper()
    )

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appModel)
                .task {
                    await appModel.start()
                }
        }
        .commands {
            KnowledgeOSCommands(appModel: appModel)
        }

        Settings {
            SettingsView()
                .environmentObject(appModel)
        }
    }
}
#else
import Foundation

@main
enum KnowledgeOSMacValidationApp {
    static func main() async {
        let bootstrapper = ApplicationBootstrapper()

        do {
            try await bootstrapper.start()
            await bootstrapper.stop()
        } catch {
            FileHandle.standardError.write(
                Data(error.localizedDescription.utf8)
            )
        }
    }
}
#endif
