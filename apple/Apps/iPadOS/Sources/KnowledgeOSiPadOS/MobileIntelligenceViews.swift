#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSMobile

struct IPadIntelligenceView: View {
    enum Mode: String, CaseIterable, Identifiable { case search, graph, ai; var id: String { rawValue } }
    @EnvironmentObject var model: MobileAppModel
    @State private var mode: Mode = .search
    @State private var query = ""
    @State private var prompt = ""

    var body: some View {
        VStack(spacing: 0) {
            Picker("Mode", selection: $mode) {
                ForEach(Mode.allCases) { Text($0.rawValue.capitalized).tag($0) }
            }
            .pickerStyle(.segmented)
            .padding()
            Divider()
            switch mode {
            case .search:
                HSplitView {
                    List(model.searchResults) { result in
                        Button { model.selectedDocumentID = result.id } label: {
                            VStack(alignment: .leading) { Text(result.title).font(.headline); Text(result.snippet).font(.caption).foregroundStyle(.secondary) }
                        }
                    }
                    VStack(alignment: .leading) {
                        TextField("Search", text: $query).textFieldStyle(.roundedBorder).onSubmit { Task { await model.performSearch(query) } }
                        if let selected = model.searchResults.first(where: { $0.id == model.selectedDocumentID }) { Text(selected.title).font(.title2); Text(selected.snippet) }
                        Spacer()
                    }.padding()
                }
            case .graph:
                HSplitView {
                    List(model.graphNodes) { node in Button(node.label) { model.expandGraph(nodeId: node.id) } }
                    VStack(alignment: .leading) {
                        TextField("Search graph", text: $query).textFieldStyle(.roundedBorder).onSubmit { model.searchGraph(query) }
                        Text("Nodes: \(model.graphNodes.count)").foregroundStyle(.secondary)
                        Spacer()
                    }.padding()
                }
            case .ai:
                HSplitView {
                    List(model.conversations.first?.messages ?? []) { message in VStack(alignment: .leading) { Text(message.role.capitalized).font(.caption.bold()); Text(message.content) } }
                    VStack {
                        Picker("Privacy", selection: $model.aiPolicy) { ForEach(MobileAIContextPolicy.allCases, id: \.self) { Text($0.rawValue) } }
                        TextField("Ask KnowledgeOS…", text: $prompt, axis: .vertical).textFieldStyle(.roundedBorder)
                        Button("Send") { let value = prompt; prompt = ""; Task { await model.sendAI(message: value, conversationId: model.conversations.first?.id, sourceIds: model.selectedDocumentID.map { [$0] } ?? []) } }.disabled(prompt.isEmpty || model.aiPolicy == .restricted)
                        Spacer()
                    }.padding()
                }
            }
        }
    }
}
#endif
