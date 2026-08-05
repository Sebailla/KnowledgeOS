#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge
@MainActor final class ExportViewModel:ObservableObject {
 @Published private(set) var formats:[ExportFormatInfoDTO]=[]; @Published private(set) var jobs:[ExportJobDTO]=[]; @Published private(set) var preview:ExportPreviewDTO?; @Published var selectedFormat:ExportFormatDTO = .markdown; @Published var includeMetadata=true; @Published var includeAnnotations=true; @Published var errorMessage:String?; @Published private(set) var isWorking=false
 private let bridge:CoreBridge
 init(bridge:CoreBridge){self.bridge=bridge}
 func load() async { do { formats=try await bridge.exportFormats(); jobs=try await bridge.exportHistory() } catch { errorMessage=error.localizedDescription } }
 func previewDocument(id:String,title:String,body:String) async { isWorking=true; defer{isWorking=false}; do { preview=try await bridge.exportPreview(format:selectedFormat,id:id,title:title,body:body,includeMetadata:includeMetadata,includeAnnotations:includeAnnotations) } catch { errorMessage=error.localizedDescription } }
 func exportDocument(id:String,title:String,body:String) async { isWorking=true; defer{isWorking=false}; do { let job=try await bridge.startExport(format:selectedFormat,id:id,title:title,body:body,includeMetadata:includeMetadata,includeAnnotations:includeAnnotations); jobs.insert(job,at:0); preview=job.preview } catch { errorMessage=error.localizedDescription } }
}
#endif
