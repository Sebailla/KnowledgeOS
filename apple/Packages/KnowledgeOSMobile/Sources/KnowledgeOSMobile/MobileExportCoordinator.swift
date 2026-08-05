import Foundation
#if canImport(CryptoKit)
import CryptoKit
#endif

public actor MobileExportCoordinator {
    private let store: MobileLocalStore
    private let directory: URL

    public init(
        store: MobileLocalStore,
        directory: URL
    ) throws {
        self.store = store
        self.directory = directory.appending(path: "Exports")
        try FileManager.default.createDirectory(
            at: self.directory,
            withIntermediateDirectories: true
        )
    }

    public func formats() -> [MobileExportFormat] {
        MobileExportFormat.allCases
    }

    public func export(
        document: MobileLibraryItem,
        format: MobileExportFormat,
        includeAnnotations: Bool = true,
        includeBookmarks: Bool = true
    ) async throws -> MobileExportJob {
        let now = ISO8601DateFormatter().string(from: Date())
        let id = UUID().uuidString
        let fileName = "\(sanitize(document.title)).\(fileExtension(format))"
        let content = render(document: document, format: format)
        let checksum = sha256(Data(content.utf8))
        let manifest = MobileExportManifest(
            version: 1,
            format: format,
            createdAt: now,
            sourceIDs: [document.id],
            checksum: checksum
        )
        try Data(content.utf8).write(
            to: directory.appending(path: fileName),
            options: .atomic
        )
        let job = MobileExportJob(
            id: id,
            format: format,
            title: document.title,
            state: .completed,
            progress: 1,
            createdAt: now,
            updatedAt: now,
            fileName: fileName,
            content: content,
            checksum: checksum,
            manifest: manifest,
            error: nil
        )
        try await store.saveExportJob(job)
        return job
    }

    public func history() async -> [MobileExportJob] {
        await store.current().exportJobs.sorted {
            $0.createdAt > $1.createdAt
        }
    }

    public func fileURL(for job: MobileExportJob) -> URL {
        directory.appending(path: job.fileName)
    }

    private func render(
        document: MobileLibraryItem,
        format: MobileExportFormat
    ) -> String {
        let body = document.localContent ?? ""
        switch format {
        case .markdown:
            return "# \(document.title)\n\n\(body)"
        case .html:
            return "<!doctype html><html><body><h1>\(escape(document.title))</h1><pre>\(escape(body))</pre></body></html>"
        case .text:
            return "\(document.title)\n\n\(body)"
        case .pdf:
            return "%PDF-KNOWLEDGEOS\n\(document.title)\n\(body)"
        case .knowledgePackage:
            let object: [String: String] = [
                "type": "knowledgeos-package",
                "title": document.title,
                "body": body,
            ]
            let data = try? JSONEncoder().encode(object)
            return data.flatMap { String(data: $0, encoding: .utf8) } ?? "{}"
        }
    }

    private func fileExtension(_ format: MobileExportFormat) -> String {
        switch format {
        case .markdown: return "md"
        case .html: return "html"
        case .text: return "txt"
        case .pdf: return "pdf"
        case .knowledgePackage: return "knowledgeos.json"
        }
    }

    private func sanitize(_ value: String) -> String {
        let cleaned = value
            .lowercased()
            .replacingOccurrences(
                of: "[^a-z0-9]+",
                with: "-",
                options: .regularExpression
            )
            .trimmingCharacters(in: CharacterSet(charactersIn: "-"))
        return cleaned.isEmpty ? "export" : cleaned
    }

    private func escape(_ value: String) -> String {
        value
            .replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    private func sha256(_ data: Data) -> String {
        #if canImport(CryptoKit)
        return SHA256.hash(data: data)
            .map { String(format: "%02x", $0) }
            .joined()
        #else
        let hash = data.reduce(UInt64(2166136261)) {
            ($0 ^ UInt64($1)) &* 16777619
        }
        return String(format: "%064llx", hash)
        #endif
    }
}

public enum MobileDeepLinkRouter {
    public static func parse(_ url: URL) -> MobileDeepLink? {
        guard url.scheme == "knowledgeos" else { return nil }
        let host = url.host ?? ""
        let parts = url.pathComponents.filter { $0 != "/" }
        switch host {
        case "document":
            guard let id = parts.first else { return nil }
            if parts.count >= 3, parts[1] == "anchor" {
                return .document(id: id, anchor: parts[2])
            }
            return .document(id: id, anchor: nil)
        case "search":
            let query = URLComponents(
                url: url,
                resolvingAgainstBaseURL: false
            )?.queryItems?.first(where: { $0.name == "q" })?.value ?? ""
            return .search(query)
        case "graph":
            guard parts.count >= 2, parts[0] == "node" else { return nil }
            return .graphNode(parts[1])
        case "conversation":
            return parts.first.map(MobileDeepLink.conversation)
        case "import":
            return .importFiles
        case "export":
            return parts.first.map(MobileDeepLink.export)
        default:
            return nil
        }
    }

    public static func url(for link: MobileDeepLink) -> URL? {
        switch link {
        case let .document(id, anchor):
            if let anchor {
                return URL(string: "knowledgeos://document/\(id)/anchor/\(anchor)")
            }
            return URL(string: "knowledgeos://document/\(id)")
        case let .search(query):
            var components = URLComponents(string: "knowledgeos://search")
            components?.queryItems = [URLQueryItem(name: "q", value: query)]
            return components?.url
        case let .graphNode(id):
            return URL(string: "knowledgeos://graph/node/\(id)")
        case let .conversation(id):
            return URL(string: "knowledgeos://conversation/\(id)")
        case .importFiles:
            return URL(string: "knowledgeos://import")
        case let .export(id):
            return URL(string: "knowledgeos://export/\(id)")
        }
    }
}
