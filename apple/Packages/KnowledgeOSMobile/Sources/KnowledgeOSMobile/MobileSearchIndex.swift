import Foundation

public struct MobileSearchIndex: Sendable {
    private var documents: [String: MobileSearchDocument]

    public init(documents: [MobileSearchDocument] = []) {
        self.documents = Dictionary(uniqueKeysWithValues: documents.map { ($0.id, $0) })
    }

    public mutating func rebuild(from library: [MobileLibraryItem]) {
        documents = Dictionary(uniqueKeysWithValues: library.map { item in
            (item.id, MobileSearchDocument(id: item.id, title: item.title, body: item.localContent ?? item.summary, authors: item.authors, tags: [], availability: item.availability))
        })
    }

    public mutating func upsert(_ document: MobileSearchDocument) { documents[document.id] = document }
    public mutating func remove(id: String) { documents.removeValue(forKey: id) }
    public var allDocuments: [MobileSearchDocument] { Array(documents.values) }

    public func search(_ query: String, availability: MobileAvailability? = nil, limit: Int = 50) -> [MobileSearchResult] {
        let terms = tokenize(query)
        return documents.values.compactMap { document in
            if let availability, document.availability != availability { return nil }
            let title = normalize(document.title)
            let body = normalize(document.body)
            let authors = normalize(document.authors.joined(separator: " "))
            let score = terms.reduce(0.0) { total, term in
                total + (title.contains(term) ? 6 : 0) + (authors.contains(term) ? 3 : 0) + Double(body.components(separatedBy: term).count - 1)
            }
            if !terms.isEmpty && score == 0 { return nil }
            return MobileSearchResult(id: document.id, title: document.title, score: score, snippet: snippet(document.body, terms), highlights: terms.filter { title.contains($0) || body.contains($0) }, availability: document.availability)
        }.sorted { $0.score == $1.score ? $0.title < $1.title : $0.score > $1.score }.prefix(limit).map { $0 }
    }

    public func suggestions(_ prefix: String, limit: Int = 8) -> [String] {
        let value = normalize(prefix)
        return Array(Set(documents.values.flatMap { [$0.title] + $0.authors }.filter { normalize($0).contains(value) })).sorted().prefix(limit).map { $0 }
    }
}

private func normalize(_ value: String) -> String { value.folding(options: [.diacriticInsensitive, .caseInsensitive], locale: .current).lowercased() }
private func tokenize(_ value: String) -> [String] { Array(Set(normalize(value).split(whereSeparator: { !$0.isLetter && !$0.isNumber }).map(String.init).filter { $0.count > 1 })) }
private func snippet(_ body: String, _ terms: [String]) -> String {
    guard let term = terms.first, let range = normalize(body).range(of: term) else { return String(body.prefix(180)) }
    let offset = normalize(body).distance(from: normalize(body).startIndex, to: range.lowerBound)
    let start = max(0, offset - 50)
    return String(body.dropFirst(start).prefix(200))
}
