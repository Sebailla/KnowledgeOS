#if canImport(SwiftUI)
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        Form {
            TextField(
                "Default workspace",
                text: $appModel.activeWorkspaceName
            )

            Toggle(
                "Show inspector",
                isOn: $appModel.isInspectorVisible
            )
        }
        .padding()
        .frame(width: 420)
    }
}

#endif
