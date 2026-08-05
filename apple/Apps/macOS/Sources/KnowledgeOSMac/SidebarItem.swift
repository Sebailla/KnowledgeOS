import Foundation

enum SidebarItem: String, CaseIterable, Identifiable {
    case library
    case recent
    case favorites
    case search
    case knowledgeGraph
    case ai
    case importFiles
    case exportFiles

    var id: String { rawValue }

    var title: String {
        switch self {
        case .library: "Library"
        case .recent: "Recent"
        case .favorites: "Favorites"
        case .search: "Search"
        case .knowledgeGraph: "Knowledge Graph"
        case .ai: "AI"
        case .importFiles: "Import"
        case .exportFiles: "Export"
        }
    }

    var systemImage: String {
        switch self {
        case .library: "books.vertical"
        case .recent: "clock"
        case .favorites: "star"
        case .search: "magnifyingglass"
        case .knowledgeGraph: "point.3.connected.trianglepath.dotted"
        case .ai: "sparkles"
        case .importFiles: "square.and.arrow.down"
        case .exportFiles: "square.and.arrow.up"
        }
    }
}
