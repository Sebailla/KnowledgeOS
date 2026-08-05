import Foundation

public struct MobileDocumentNavigator: Sendable {
    public init() {}

    public func document(from item: MobileLibraryItem) -> MobileReaderDocument {
        let content = item.localContent ?? item.summary
        let sections = split(content: content)
        return MobileReaderDocument(id: item.id, title: item.title, sections: sections)
    }

    public func search(_ query: String, in document: MobileReaderDocument) -> [MobileDocumentSearchResult] {
        let normalized = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !normalized.isEmpty else { return [] }
        var results: [MobileDocumentSearchResult] = []
        for section in document.sections {
            let body = section.body as NSString
            var searchRange = NSRange(location: 0, length: body.length)
            while searchRange.length > 0 {
                let found = body.range(of: normalized, options: .caseInsensitive, range: searchRange)
                guard found.location != NSNotFound else { break }
                let start = max(0, found.location - 50)
                let end = min(body.length, found.location + found.length + 90)
                results.append(.init(
                    id: "\(section.id):\(found.location)",
                    sectionId: section.id,
                    anchor: section.anchor,
                    excerpt: body.substring(with: NSRange(location: start, length: end - start)),
                    rangeStart: found.location
                ))
                let next = found.location + max(found.length, 1)
                searchRange = NSRange(location: next, length: max(0, body.length - next))
            }
        }
        return results
    }

    public func section(after id: String, in document: MobileReaderDocument) -> MobileDocumentSection? {
        guard let index = document.sections.firstIndex(where: { $0.id == id }), index + 1 < document.sections.count else { return nil }
        return document.sections[index + 1]
    }

    public func section(before id: String, in document: MobileReaderDocument) -> MobileDocumentSection? {
        guard let index = document.sections.firstIndex(where: { $0.id == id }), index > 0 else { return nil }
        return document.sections[index - 1]
    }

    private func split(content: String) -> [MobileDocumentSection] {
        let lines = content.components(separatedBy: .newlines)
        var sections: [MobileDocumentSection] = []
        var title = "Document"
        var body: [String] = []
        func appendSection() {
            let text = body.joined(separator: "\n").trimmingCharacters(in: .whitespacesAndNewlines)
            guard !text.isEmpty else { return }
            let index = sections.count
            sections.append(.init(id: "section:\(index)", title: title, body: text, anchor: "section-\(index)"))
        }
        for line in lines {
            if line.hasPrefix("#") {
                appendSection()
                title = line.drop(while: { $0 == "#" || $0 == " " }).description
                body = []
            } else {
                body.append(line)
            }
        }
        appendSection()
        if sections.isEmpty {
            sections = [.init(id: "section:0", title: "Document", body: content, anchor: "section-0")]
        }
        return sections
    }
}
