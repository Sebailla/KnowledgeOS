#if canImport(SwiftUI)
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        Form {
            Section("Local Persistence") {
                if let health = appModel.persistenceViewModel?.health { LabeledContent("Status", value: health.reading.status); LabeledContent("Directory", value: health.reading.directory); LabeledContent("Schema", value: String(health.reading.schemaVersion)) } else { Text("Persistence status unavailable.").foregroundStyle(.secondary) }
                Button("Refresh") { Task { await appModel.persistenceViewModel?.refresh() } }
            }
            Section("Synchronization") {
                if let status = appModel.syncViewModel?.status {
                    LabeledContent("Status", value: status.phase.rawValue)
                    LabeledContent("Pending", value: String(status.pending))
                    LabeledContent("Uploaded", value: String(status.uploaded))
                    LabeledContent("Downloaded", value: String(status.downloaded))
                    if !status.conflicts.isEmpty { LabeledContent("Conflicts", value: String(status.conflicts.count)) }
                } else { Text("Sync status unavailable.").foregroundStyle(.secondary) }
                HStack {
                    Button("Sync Now") { Task { await appModel.syncViewModel?.synchronize() } }
                    Button("Pause") { Task { await appModel.syncViewModel?.pause() } }
                    Button("Resume") { Task { await appModel.syncViewModel?.resume() } }
                    Button("Refresh") { Task { await appModel.syncViewModel?.refresh() } }
                }
            }
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
