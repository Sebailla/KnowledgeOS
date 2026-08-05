#if canImport(SwiftUI)
import SwiftUI
import UniformTypeIdentifiers
import KnowledgeOSMobile

@main
struct KnowledgeOSiOSApp: App {
    @StateObject private var model = MobileAppModel()
    var body: some Scene {
        WindowGroup {
            TabView {
                IPhoneRootView().tabItem { Label("Library", systemImage: "books.vertical") }
                IPhoneSearchView().tabItem { Label("Search", systemImage: "magnifyingglass") }
                IPhoneGraphView().tabItem { Label("Graph", systemImage: "point.3.connected.trianglepath.dotted") }
                IPhoneAIView().tabItem { Label("AI", systemImage: "sparkles") }
            }.environmentObject(model).task {
                let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!.appending(path: "KnowledgeOS")
                await model.bootstrap(configuration: nil, directory: dir)
            }
        }
    }
}

struct IPhoneRootView: View {
    @EnvironmentObject var model: MobileAppModel
    @State private var showingImporter = false
    var body: some View {
        NavigationStack {
            List(model.filteredLibrary) { item in
                NavigationLink(value: item.id) {
                    VStack(alignment: .leading) {
                        Text(item.title)
                        Text(item.authors.joined(separator: ", ")).font(.caption).foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Library")
            .searchable(text: $model.query)
            .navigationDestination(for: String.self) { id in IPhoneReaderView(documentID: id) }
            .toolbar { ToolbarItemGroup { Button { showingImporter = true } label: { Image(systemName: "square.and.arrow.down") }; Button { Task { await model.synchronize() } } label: { Image(systemName: "arrow.triangle.2.circlepath") } } }
            .fileImporter(isPresented:$showingImporter,allowedContentTypes:[.pdf,.epub,.html,.plainText,.image],allowsMultipleSelection:true){ result in if case .success(let urls)=result { Task { for url in urls { await model.importFile(at:url) } } } }
            .task { await model.processSharedImports() }
        }
    }
}

struct IPhoneReaderView: View {
    let documentID: String
    @EnvironmentObject var model: MobileAppModel
    @State private var document: MobileReaderDocument?
    @State private var session: MobileReaderSession?
    @State private var search = ""
    @State private var results: [MobileDocumentSearchResult] = []
    @State private var showNotes = false

    var body: some View {
        Group {
            if let document, let session {
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        ForEach(document.sections) { section in
                            VStack(alignment: .leading, spacing: 12) {
                                Text(section.title).font(.title2.bold())
                                Text(section.body)
                                    .font(.system(size: 17 * model.readingSettings.fontScale))
                                    .textSelection(.enabled)
                            }
                            .id(section.anchor)
                        }
                    }
                    .padding(.horizontal, model.readingSettings.horizontalMargin)
                }
                .safeAreaInset(edge: .bottom) {
                    HStack {
                        Button { Task { await model.addBookmark(documentId: documentID, sectionId: session.sectionId, anchor: session.anchor, title: document.title) } } label: { Label("Bookmark", systemImage: "bookmark") }
                        Spacer()
                        Button { showNotes = true } label: { Label("Note", systemImage: "highlighter") }
                    }
                    .padding().background(.bar)
                }
                .sheet(isPresented: $showNotes) {
                    AnnotationComposer(documentID: documentID, sectionID: session.sectionId, anchor: session.anchor)
                        .environmentObject(model)
                }
                .searchable(text: $search, prompt: "Find in document")
                .onSubmit(of: .search) { if let reader = model.reader { results = reader.search(search, in: document) } }
            } else { ProgressView("Opening document…") }
        }
        .navigationTitle(model.library.first { $0.id == documentID }?.title ?? "Document")
        .task { if let opened = await model.openReader(documentId: documentID) { document = opened.0; session = opened.1 } }
    }
}

struct AnnotationComposer: View {
    let documentID: String
    let sectionID: String
    let anchor: String
    @EnvironmentObject var model: MobileAppModel
    @Environment(\.dismiss) private var dismiss
    @State private var selectedText = ""
    @State private var note = ""
    @State private var style: MobileAnnotationStyle = .highlight
    @State private var color: MobileAnnotationColor = .yellow
    var body: some View {
        NavigationStack {
            Form {
                TextField("Selected text", text: $selectedText, axis: .vertical)
                TextField("Note", text: $note, axis: .vertical)
                Picker("Style", selection: $style) { ForEach(MobileAnnotationStyle.allCases, id: \.self) { Text($0.rawValue.capitalized) } }
                Picker("Color", selection: $color) { ForEach(MobileAnnotationColor.allCases, id: \.self) { Text($0.rawValue.capitalized) } }
            }
            .navigationTitle("Annotation")
            .toolbar { Button("Save") { Task { await model.addAnnotation(documentId: documentID, sectionId: sectionID, anchor: anchor, text: selectedText, note: note.isEmpty ? nil : note, style: style, color: color); dismiss() } } }
        }
    }
}
#else
import Foundation
@main enum KnowledgeOSiOSValidationApp { static func main() {} }
#endif
