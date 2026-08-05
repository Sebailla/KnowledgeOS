#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge
struct KnowledgeGraphView:View { @ObservedObject var viewModel:KnowledgeGraphViewModel; @EnvironmentObject private var appModel:AppModel
 var body:some View { VStack(spacing:0){ HStack{ TextField("Search graph",text:$viewModel.query).textFieldStyle(.roundedBorder).onSubmit{Task{await viewModel.load()}}; Button("Search"){Task{await viewModel.load()}}; Button("Expand"){Task{await viewModel.expandSelected()}}.disabled(viewModel.selectedNodeID==nil) }.padding(); Divider(); HSplitView{ List(viewModel.nodes,selection:$viewModel.selectedNodeID){node in Label(node.label,systemImage:icon(node.type)).tag(node.id).onTapGesture(count:2){ if node.properties["resourceId"] != nil { appModel.openDocumentID=node.id } } }.frame(minWidth:280); VStack(alignment:.leading,spacing:12){ if let node=viewModel.selectedNode { Text(node.label).font(.title2.bold()); Text(node.type).foregroundStyle(.secondary); Text("Connections: \(viewModel.edges.filter{$0.sourceId==node.id || $0.targetId==node.id}.count)"); Spacer() } else { ContentUnavailableView("No Node Selected",systemImage:"point.3.connected.trianglepath.dotted") } }.padding().frame(maxWidth:.infinity,maxHeight:.infinity,alignment:.topLeading) } }.task{await viewModel.load()} }
 private func icon(_ type:String)->String { switch type { case "document","book","paper": "doc.text"; case "concept":"lightbulb"; case "tag":"tag"; default:"circle" } }
}
#endif
