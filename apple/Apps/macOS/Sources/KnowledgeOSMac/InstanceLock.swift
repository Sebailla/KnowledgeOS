import Foundation

final class InstanceLock {
    private let url: URL
    private var acquired = false

    init(url: URL) {
        self.url = url
    }

    func acquire() throws {
        let payload = "\(ProcessInfo.processInfo.processIdentifier)\n"
        if FileManager.default.fileExists(atPath: url.path) {
            throw InstanceLockError.alreadyRunning
        }
        try payload.data(using: .utf8)?.write(to: url, options: .atomic)
        acquired = true
    }

    func release() {
        guard acquired else { return }
        try? FileManager.default.removeItem(at: url)
        acquired = false
    }
}

enum InstanceLockError: LocalizedError {
    case alreadyRunning
    var errorDescription: String? { "Another KnowledgeOS instance is already running." }
}
