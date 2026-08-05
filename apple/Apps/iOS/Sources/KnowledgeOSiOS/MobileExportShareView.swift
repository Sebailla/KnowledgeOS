#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSMobile
struct MobileExportShareView:View { @ObservedObject var model:MobileAppModel; let documentID:String; @State private var format:MobileExportFormat = .markdown; @State private var job:MobileExportJob?
 var body:some View { Form { Picker("Format",selection:$format){ForEach(MobileExportFormat.allCases,id:\.self){Text($0.rawValue).tag($0)}}; Button("Export"){Task{job=await model.exportDocument(id:documentID,format:format)}}; if let job{Text(job.fileName);ShareLink(item:job.content ?? "",preview:SharePreview(job.fileName))} } .navigationTitle("Export") }
}
#endif
