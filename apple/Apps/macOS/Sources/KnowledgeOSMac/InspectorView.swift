#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

struct InspectorView: View {
    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        if let item =
            appModel.libraryViewModel?
                .selectedItem {
            Form {
                Section("Publication") {
                    LabeledContent(
                        "Title",
                        value: item.title
                    )

                    LabeledContent(
                        "Type",
                        value:
                            item.kind.rawValue
                    )

                    LabeledContent(
                        "Availability",
                        value:
                            item.availability
                                .rawValue
                    )

                    LabeledContent(
                        "Authors",
                        value:
                            item.authors.joined(
                                separator: ", "
                            )
                    )
                }

                Section("Tags") {
                    Text(
                        item.tags.joined(
                            separator: ", "
                        )
                    )
                }
            }
            .formStyle(.grouped)
            .navigationTitle("Inspector")
            .frame(minWidth: 280)
        } else {
            ContentUnavailableView(
                "No Selection",
                systemImage:
                    "sidebar.right"
            )
            .frame(minWidth: 280)
        }
    }
}
#endif
