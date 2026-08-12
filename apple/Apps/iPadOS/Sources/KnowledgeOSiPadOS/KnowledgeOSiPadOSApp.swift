#if canImport(SwiftUI)
import SwiftUI
import UniformTypeIdentifiers
import KnowledgeOSMobile

@main
struct KnowledgeOSiPadOSApp: App {
    @StateObject private var model = MobileAppModel()
    var body: some Scene {
        WindowGroup {
            TabView {
                IPadRootView().tabItem { Label("Library", systemImage: "books.vertical") }
                IPadIntelligenceView().tabItem { Label("Intelligence", systemImage: "sparkles") }
            }.environmentObject(model).task {
                let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!.appending(path: "KnowledgeOS")
                await model.bootstrap(configuration: nil, directory: dir)
            }
        }
    }
}

struct IPadRootView: View {
    @EnvironmentObject var model: MobileAppModel
    @State private var showingImporter = false
    var body: some View {
        // Capture the EnvironmentObject as a local constant so SwiftUI does
        // not infer `Binding<Subject>` for `model` after the
        // `$model.selectedDocumentID` / `$model.query` projections below.
        // Calling `model.importFile(at:)` and `model.processSharedImports()`
        // inside the `.fileImporter` and `.task` modifiers requires the
        // concrete `MobileAppModel` type.
        let viewModel = model
        return NavigationSplitView {
            List(viewModel.filteredLibrary, selection: $model.selectedDocumentID) { item in
                Label(item.title, systemImage: item.favorite ? "star.fill" : "doc.text").tag(item.id)
            }
            .navigationTitle("KnowledgeOS")
            .searchable(text: $model.query)
            .toolbar { Button { showingImporter = true } label: { Label("Import",systemImage:"square.and.arrow.down") } }
            .fileImporter(isPresented:$showingImporter,allowedContentTypes:[.pdf,.epub,.html,.plainText,.image],allowsMultipleSelection:true){ result in if case .success(let urls)=result { Task { for url in urls { await viewModel.importFile(at:url) } } } }
            .task { await viewModel.processSharedImports() }
        } content: {
            if let id = viewModel.selectedDocumentID { IPadReaderView(documentID: id) } else { ContentUnavailableView("Select a Document", systemImage: "book") }
        } detail: {
            ReaderInspector(documentID: viewModel.selectedDocumentID)
        }
    }
}

struct IPadReaderView: View {
    let documentID: String
    @EnvironmentObject var model: MobileAppModel
    @State private var document: MobileReaderDocument?
    @State private var session: MobileReaderSession?
    var body: some View {
        ScrollView {
            if let document {
                LazyVStack(alignment: .leading, spacing: 28) {
                    ForEach(document.sections) { section in
                        VStack(alignment: .leading, spacing: 12) {
                            Text(section.title).font(.title.bold())
                            Text(section.body).font(.system(size: 18 * model.readingSettings.fontScale)).textSelection(.enabled)
                        }
                        .id(section.anchor)
                    }
                }
                .frame(maxWidth: 760, alignment: .leading)
                .padding(model.readingSettings.horizontalMargin)
            } else { ProgressView("Opening…") }
        }
        .navigationTitle(model.library.first { $0.id == documentID }?.title ?? "Document")
        .toolbar {
            Button { if let session { Task { await model.addBookmark(documentId: documentID, sectionId: session.sectionId, anchor: session.anchor, title: document?.title) } } } label: { Label("Bookmark", systemImage: "bookmark") }
        }
        .task { if let opened = await model.openReader(documentId: documentID) { document = opened.0; session = opened.1 } }
    }
}

struct ReaderInspector: View {
    let documentID: String?
    @EnvironmentObject var model: MobileAppModel
    var body: some View {
        Form {
            Section("Reading") {
                Picker("Theme", selection: $model.readingSettings.theme) { ForEach(MobileReadingSettings.Theme.allCases, id: \.self) { Text($0.rawValue.capitalized) } }
                Slider(value: $model.readingSettings.fontScale, in: 0.8...1.8)
                Slider(value: $model.readingSettings.horizontalMargin, in: 12...80)
                Toggle("Continuous", isOn: $model.readingSettings.continuousReading)
                Button("Save Preferences") { Task { await model.saveReadingSettings() } }
            }
            Section("Synchronization") {
                LabeledContent("Pending", value: String(model.syncStatus.pendingOperations))
                LabeledContent("Conflicts", value: String(model.syncStatus.pendingConflicts))
                Button("Synchronize") { Task { await model.synchronize() } }
            }
        }
        .formStyle(.grouped)
    }
}
#else
import Foundation
@main enum KnowledgeOSiPadOSValidationApp { static func main() {} }
#endif
