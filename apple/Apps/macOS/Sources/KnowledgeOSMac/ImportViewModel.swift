#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

@MainActor
final class ImportViewModel: ObservableObject {
    @Published private(set) var jobs: [ImportJobDTO] = []
    @Published private(set) var preview: ImportPreviewDTO?
    @Published private(set) var isWorking = false
    @Published var runOCR = false
    @Published var errorMessage: String?
    private let bridge: CoreBridge
    private let staging: ImportStagingService

    init(bridge: CoreBridge, staging: ImportStagingService? = nil) {
        self.bridge = bridge
        self.staging = staging ?? ImportStagingService(root: (try? ReleaseEnvironment.importStagingRoot()) ?? FileManager.default.temporaryDirectory)
    }

    func previewFile(name: String, content: String) async {
        isWorking = true; errorMessage = nil
        do { preview = try await bridge.importPreview(name: name, content: content, extensionName: fileExtension(name), runOCR: runOCR) }
        catch { errorMessage = error.localizedDescription }
        isWorking = false
    }

    func importFile(url: URL) async {
        isWorking = true; errorMessage = nil
        do {
            let staged = try staging.stage(source: url)
            let request = StagedImportRequestV2DTO(contractVersion: 2, operationId: UUID().uuidString, idempotencyKey: UUID().uuidString, source: .init(kind: "staged-file", capability: staged.capability), name: url.lastPathComponent, byteLength: staged.byteLength, sha256: staged.sha256, mediaType: nil, extensionName: fileExtension(url.lastPathComponent), runOCR: runOCR)
            let accepted = try await bridge.queueStagedImport(request)
            guard accepted.state == .processingQueued else { throw CoreBridgeError.invalidResponse }
            try staging.transferCleanupOwnership(for: staged.capability)
        } catch { errorMessage = error.localizedDescription }
        isWorking = false
    }

    func refreshHistory() async {
        do { jobs = try await bridge.importHistory() } catch { errorMessage = error.localizedDescription }
    }

    private func fileExtension(_ name: String) -> String? { name.split(separator: ".").last.map(String.init) }
}
#endif
