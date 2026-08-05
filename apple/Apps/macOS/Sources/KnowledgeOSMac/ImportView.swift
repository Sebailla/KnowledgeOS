#if canImport(SwiftUI)
import SwiftUI
import UniformTypeIdentifiers

struct ImportView: View {
    @ObservedObject
    var viewModel: ImportViewModel

    @State private var isImporterPresented =
        false

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button("Choose Files…") {
                    isImporterPresented = true
                }

                Toggle(
                    "Run OCR when needed",
                    isOn: $viewModel.runOCR
                )

                Spacer()

                if viewModel.isWorking {
                    ProgressView()
                }
            }
            .padding()

            Divider()

            if let preview =
                viewModel.preview {
                Form {
                    Section("Preview") {
                        LabeledContent(
                            "Title",
                            value: preview.title
                        )
                        LabeledContent(
                            "Format",
                            value:
                                preview.format.rawValue
                        )
                        LabeledContent(
                            "Media type",
                            value:
                                preview.mediaType
                        )
                        LabeledContent(
                            "Size",
                            value:
                                "\(preview.size) bytes"
                        )
                        LabeledContent(
                            "Duplicate",
                            value:
                                preview.duplicate
                                    ? "Yes"
                                    : "No"
                        )
                    }
                }
                .formStyle(.grouped)
            }

            if let error =
                viewModel.errorMessage {
                Text(error)
                    .foregroundStyle(.red)
                    .padding()
            }

            List(viewModel.jobs) { job in
                VStack(
                    alignment: .leading,
                    spacing: 6
                ) {
                    HStack {
                        Text(job.preview.title)
                            .font(.headline)
                        Spacer()
                        Text(job.state.rawValue)
                            .foregroundStyle(
                                .secondary
                            )
                    }

                    ProgressView(
                        value: job.progress
                    )

                    if let error = job.error {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }
                }
            }
        }
        .fileImporter(
            isPresented:
                $isImporterPresented,
            allowedContentTypes: [
                .pdf,
                .epub,
                .html,
                .plainText,
                UTType(
                    filenameExtension: "md"
                ) ?? .plainText
            ],
            allowsMultipleSelection: true
        ) { result in
            guard
                case .success(let urls) =
                    result
            else {
                return
            }

            Task {
                for url in urls {
                    guard
                        url.startAccessingSecurityScopedResource()
                    else {
                        continue
                    }

                    defer {
                        url.stopAccessingSecurityScopedResource()
                    }

                    let data =
                        try Data(
                            contentsOf: url
                        )

                    let content =
                        String(
                            data: data,
                            encoding: .utf8
                        ) ??
                        data.base64EncodedString()

                    await viewModel
                        .previewFile(
                            name:
                                url.lastPathComponent,
                            content: content
                        )

                    await viewModel
                        .importFile(
                            name:
                                url.lastPathComponent,
                            content: content
                        )
                }
            }
        }
        .task {
            await viewModel.refreshHistory()
        }
    }
}
#endif
