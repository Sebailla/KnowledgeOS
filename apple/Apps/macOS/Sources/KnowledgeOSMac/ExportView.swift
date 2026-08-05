#if canImport(SwiftUI)
import SwiftUI

struct ExportView: View {
    @ObservedObject
    var viewModel: ExportViewModel

    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        VStack(spacing: 0) {
            Form {
                Section("Export") {
                    Picker(
                        "Format",
                        selection: $viewModel.selectedFormat
                    ) {
                        ForEach(viewModel.formats) { format in
                            Text(format.name)
                                .tag(format.id)
                        }
                    }

                    Toggle(
                        "Include metadata",
                        isOn: $viewModel.includeMetadata
                    )

                    Toggle(
                        "Include annotations",
                        isOn: $viewModel.includeAnnotations
                    )

                    HStack {
                        Button("Preview") {
                            Task {
                                await preview()
                            }
                        }

                        Button("Export") {
                            Task {
                                await export()
                            }
                        }
                        .buttonStyle(.borderedProminent)

                        if viewModel.isWorking {
                            ProgressView()
                        }
                    }
                }

                if let preview = viewModel.preview {
                    Section("Preview") {
                        LabeledContent(
                            "File",
                            value: preview.fileName
                        )

                        LabeledContent(
                            "Media type",
                            value: preview.mediaType
                        )

                        LabeledContent(
                            "Estimated size",
                            value: "\(preview.estimatedSize) bytes"
                        )
                    }
                }

                if let error = viewModel.errorMessage {
                    Text(error)
                        .foregroundStyle(.red)
                }
            }
            .formStyle(.grouped)

            List(viewModel.jobs) { job in
                VStack(alignment: .leading) {
                    HStack {
                        Text(job.preview.fileName)
                            .font(.headline)

                        Spacer()

                        Text(job.state)
                    }

                    ProgressView(value: job.progress)

                    if let result = job.result {
                        Text(result.checksum)
                            .font(.caption2)
                            .textSelection(.enabled)
                    }
                }
            }
        }
        .task {
            await viewModel.load()
        }
    }

    private func values() -> (
        id: String,
        title: String,
        body: String
    ) {
        let id = appModel.openDocumentID
            ?? "publication:knowledge-os"

        let title = appModel
            .documentReaderViewModel?
            .descriptor?
            .title
            ?? "KnowledgeOS Export"

        let body = appModel
            .documentReaderViewModel?
            .page?
            .content
            ?? "KnowledgeOS export content."

        return (id, title, body)
    }

    private func preview() async {
        let values = values()

        await viewModel.previewDocument(
            id: values.id,
            title: values.title,
            body: values.body
        )
    }

    private func export() async {
        let values = values()

        await viewModel.exportDocument(
            id: values.id,
            title: values.title,
            body: values.body
        )
    }
}
#endif
