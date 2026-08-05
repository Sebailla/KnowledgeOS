#if canImport(SwiftUI)
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var appModel: AppModel

    var body: some View {
        Form {
            Section(
                "Application Diagnostics"
            ) {
                if let status =
                    appModel
                        .applicationStatusViewModel?
                        .status {
                    LabeledContent(
                        "Core status",
                        value:
                            status.phase
                                .capitalized
                    )

                    LabeledContent(
                        "Protocol",
                        value:
                            status.protocolVersion
                    )

                    LabeledContent(
                        "Host",
                        value:
                            status.hostVersion
                    )

                    ForEach(
                        status.services
                    ) { service in
                        LabeledContent(
                            service.id,
                            value:
                                service.detail ??
                                service.status
                        )
                    }
                } else {
                    Text(
                        "Diagnostics unavailable."
                    )
                    .foregroundStyle(
                        .secondary
                    )
                }

                Button(
                    "Refresh Diagnostics"
                ) {
                    Task {
                        await appModel
                            .applicationStatusViewModel?
                            .refresh()
                    }
                }
            }


            if let transport =
                appModel.transportViewModel {
                Section(
                    "Master Library Connection"
                ) {
                    TextField(
                        "Server URL",
                        text: Binding(
                            get: {
                                transport.baseURL
                            },
                            set: {
                                transport.baseURL =
                                    $0
                            }
                        )
                    )

                    SecureField(
                        "Access token",
                        text: Binding(
                            get: {
                                transport.token
                            },
                            set: {
                                transport.token =
                                    $0
                            }
                        )
                    )

                    Button(
                        transport.isTesting
                            ? "Testing…"
                            : "Save and Test"
                    ) {
                        Task {
                            await transport
                                .saveAndTest()
                        }
                    }
                    .disabled(
                        transport.isTesting
                    )

                    if let health =
                        transport.health {
                        LabeledContent(
                            "Status",
                            value:
                                health.status
                        )
                        LabeledContent(
                            "Latency",
                            value:
                                "\(health.latencyMilliseconds) ms"
                        )
                    }

                    if let error =
                        transport.errorMessage {
                        Text(error)
                            .foregroundStyle(.red)
                    }
                }
            }


            Section("Local Persistence") {
                if let health = appModel.persistenceViewModel?.health { LabeledContent("Status", value: health.reading.status); LabeledContent("Directory", value: health.reading.directory); LabeledContent("Schema", value: String(health.reading.schemaVersion)) } else { Text("Persistence status unavailable.").foregroundStyle(.secondary) }
                Button("Refresh") { Task { await appModel.persistenceViewModel?.refresh() } }
            }
            Section("Conflict Resolution") {
                if let stats = appModel.conflictViewModel?.statistics { LabeledContent("Pending", value: String(stats.pending)); LabeledContent("Resolved", value: String(stats.resolved)) } else { Text("Conflict status unavailable.").foregroundStyle(.secondary) }
                Button("Refresh Conflicts") { Task { await appModel.conflictViewModel?.refresh() } }
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
