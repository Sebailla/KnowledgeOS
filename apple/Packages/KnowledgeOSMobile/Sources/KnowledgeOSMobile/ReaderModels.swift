import Foundation

public struct MobileDocumentSection: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let title: String
    public let body: String
    public let anchor: String

    public init(id: String, title: String, body: String, anchor: String) {
        self.id = id
        self.title = title
        self.body = body
        self.anchor = anchor
    }
}

public struct MobileReaderDocument: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let title: String
    public let sections: [MobileDocumentSection]

    public init(id: String, title: String, sections: [MobileDocumentSection]) {
        self.id = id
        self.title = title
        self.sections = sections
    }
}

public struct MobileReaderSession: Codable, Sendable, Equatable {
    public let documentId: String
    public var sectionId: String
    public var anchor: String
    public var progress: Double
    public var searchQuery: String
    public var updatedAt: String

    public init(
        documentId: String,
        sectionId: String,
        anchor: String,
        progress: Double,
        searchQuery: String = "",
        updatedAt: String
    ) {
        self.documentId = documentId
        self.sectionId = sectionId
        self.anchor = anchor
        self.progress = progress
        self.searchQuery = searchQuery
        self.updatedAt = updatedAt
    }
}

public struct MobileReaderPreferences: Codable, Sendable, Equatable {
    public enum Layout: String, Codable, Sendable, CaseIterable {
        case continuous
        case paginated
    }

    public var theme: MobileReadingSettings.Theme
    public var fontScale: Double
    public var lineSpacing: Double
    public var horizontalMargin: Double
    public var columnWidth: Double
    public var layout: Layout

    public init(
        theme: MobileReadingSettings.Theme = .light,
        fontScale: Double = 1,
        lineSpacing: Double = 6,
        horizontalMargin: Double = 24,
        columnWidth: Double = 720,
        layout: Layout = .continuous
    ) {
        self.theme = theme
        self.fontScale = fontScale
        self.lineSpacing = lineSpacing
        self.horizontalMargin = horizontalMargin
        self.columnWidth = columnWidth
        self.layout = layout
    }
}

public enum MobileAnnotationStyle: String, Codable, Sendable, CaseIterable {
    case highlight
    case underline
    case note
}

public enum MobileAnnotationColor: String, Codable, Sendable, CaseIterable {
    case yellow
    case green
    case blue
    case pink
    case orange
}

public struct MobileReaderAnnotation: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let documentId: String
    public let sectionId: String
    public let anchor: String
    public let selectedText: String
    public var note: String?
    public var style: MobileAnnotationStyle
    public var color: MobileAnnotationColor
    public let createdAt: String
    public var updatedAt: String
}

public struct MobileInkPoint: Codable, Sendable, Equatable {
    public let x: Double
    public let y: Double
    public let pressure: Double
}

public struct MobileInkStroke: Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let documentId: String
    public let sectionId: String
    public let anchor: String
    public let color: MobileAnnotationColor
    public let width: Double
    public let points: [MobileInkPoint]
    public let updatedAt: String
}

public struct MobileDocumentSearchResult: Sendable, Equatable, Identifiable {
    public let id: String
    public let sectionId: String
    public let anchor: String
    public let excerpt: String
    public let rangeStart: Int
}
