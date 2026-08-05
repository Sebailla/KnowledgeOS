#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge
@MainActor final class KnowledgeGraphViewModel: ObservableObject { @Published private(set) var nodes:[GraphNodeDTO]=[]; @Published private(set) var edges:[GraphEdgeDTO]=[]; @Published var query=""; @Published var selectedNodeID:String?; @Published var errorMessage:String?; private let bridge:CoreBridge; init(bridge:CoreBridge){self.bridge=bridge}
 func load() async { do { let found=try await bridge.graphSearch(query:query); nodes=found; if selectedNodeID==nil { selectedNodeID=nodes.first?.id } } catch { errorMessage=error.localizedDescription } }
 func expandSelected() async { guard let id=selectedNodeID else{return}; do { let graph=try await bridge.graphExpand(nodeID:id,depth:2); nodes=graph.nodes; edges=graph.edges } catch { errorMessage=error.localizedDescription } }
 var selectedNode:GraphNodeDTO? { nodes.first{$0.id==selectedNodeID} }
}
#endif
