import Foundation

enum SidebarItem: String, CaseIterable, Identifiable {
    case library
    case recent
    case favorites
    case search
    case knowledgeGraph
    case ai

    var id: String { rawValue }

    var title: String {
        switch self {
        case .library: "Library"
        case .recent: "Recent"
        case .favorites: "Favorites"
        case .search: "Search"
        case .knowledgeGraph: "Knowledge Graph"
        case .ai: "AI"
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
        }
    }
}
