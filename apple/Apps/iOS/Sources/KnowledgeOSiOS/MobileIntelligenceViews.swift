#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSMobile

struct IPhoneSearchView: View {
    @EnvironmentObject var model: MobileAppModel
    @State private var query = ""

    var body: some View {
        NavigationStack {
            List(model.searchResults) { result in
                NavigationLink(value: result.id) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(result.title).font(.headline)
                        Text(result.snippet).font(.caption).foregroundStyle(.secondary)
                        Text(result.highlights.joined(separator: " · ")).font(.caption2).foregroundStyle(.tint)
                    }
                }
            }
            .navigationTitle("Search")
            .searchable(text: $query)
            .onSubmit(of: .search) { Task { await model.performSearch(query) } }
            .navigationDestination(for: String.self) { id in IPhoneReaderView(documentID: id) }
        }
    }
}

struct IPhoneGraphView: View {
    @EnvironmentObject var model: MobileAppModel
    @State private var query = ""

    var body: some View {
        NavigationStack {
            List(model.graphNodes) { node in
                Button {
                    model.expandGraph(nodeId: node.id)
                    if let documentId = node.documentId { model.selectedDocumentID = documentId }
                } label: {
                    Label(node.label, systemImage: node.type == "document" ? "doc.text" : "circle.hexagongrid")
                }
            }
            .navigationTitle("Graph")
            .searchable(text: $query)
            .onSubmit(of: .search) { model.searchGraph(query) }
        }
    }
}

struct IPhoneAIView: View {
    @EnvironmentObject var model: MobileAppModel
    @State private var prompt = ""

    var body: some View {
        NavigationStack {
            VStack {
                List(model.conversations.first?.messages ?? []) { message in
                    VStack(alignment: .leading, spacing: 5) {
                        Text(message.role.capitalized).font(.caption.bold())
                        Text(message.content)
                        if !message.sourceIds.isEmpty { Text(message.sourceIds.joined(separator: " · ")).font(.caption2).foregroundStyle(.secondary) }
                    }
                }
                HStack {
                    TextField("Ask KnowledgeOS…", text: $prompt, axis: .vertical)
                    Button("Send") {
                        let value = prompt
                        prompt = ""
                        Task { await model.sendAI(message: value, conversationId: model.conversations.first?.id, sourceIds: model.selectedDocumentID.map { [$0] } ?? []) }
                    }
                    .disabled(prompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || model.aiPolicy == .restricted)
                }
                .padding()
            }
            .navigationTitle("AI")
            .toolbar {
                Picker("Privacy", selection: $model.aiPolicy) {
                    ForEach(MobileAIContextPolicy.allCases, id: \.self) { Text($0.rawValue) }
                }
            }
        }
    }
}
#endif
