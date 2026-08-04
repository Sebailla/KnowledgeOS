#if canImport(SwiftUI)
import SwiftUI

struct InspectorView: View {
    var body: some View {
        Form {
            Section("Selection") {
                LabeledContent(
                    "Type",
                    value: "None"
                )

                LabeledContent(
                    "Status",
                    value: "Ready"
                )
            }

            Section("Metadata") {
                Text("No item selected.")
                    .foregroundStyle(.secondary)
            }
        }
        .formStyle(.grouped)
        .navigationTitle("Inspector")
        .frame(minWidth: 260)
    }
}

#endif
