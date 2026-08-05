#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class ImportViewModel:
ObservableObject {
    @Published private(set)
    var jobs: [ImportJobDTO] = []

    @Published private(set)
    var preview: ImportPreviewDTO?

    @Published private(set)
    var isWorking = false

    @Published var runOCR = false
    @Published var errorMessage: String?

    private let bridge: CoreBridge

    init(bridge: CoreBridge) {
        self.bridge = bridge
    }

    func previewFile(
        name: String,
        content: String
    ) async {
        isWorking = true
        errorMessage = nil

        do {
            preview =
                try await bridge
                    .importPreview(
                        name: name,
                        content: content,
                        extensionName:
                            fileExtension(name),
                        runOCR: runOCR
                    )
        } catch {
            errorMessage =
                error.localizedDescription
        }

        isWorking = false
    }

    func importFile(
        name: String,
        content: String
    ) async {
        isWorking = true
        errorMessage = nil

        do {
            let job =
                try await bridge
                    .startImport(
                        name: name,
                        content: content,
                        extensionName:
                            fileExtension(name),
                        runOCR: runOCR
                    )

            jobs.insert(job, at: 0)
            preview = job.preview
        } catch {
            errorMessage =
                error.localizedDescription
        }

        isWorking = false
    }

    func refreshHistory() async {
        do {
            jobs =
                try await bridge
                    .importHistory()
        } catch {
            errorMessage =
                error.localizedDescription
        }
    }

    private func fileExtension(
        _ name: String
    ) -> String? {
        name.split(separator: ".")
            .last
            .map(String.init)
    }
}
#endif
