import CryptoKit
import Foundation

struct StagedImport: Sendable {
    let capability: String
    let entryURL: URL
    let sourceURL: URL
    let metadataURL: URL
    let byteLength: Int
    let sha256: String
}

final class ImportStagingService {
    private let root: URL
    private let retention: TimeInterval
    private let fileManager: FileManager
    private var coreOwned = Set<String>()

    init(root: URL, retention: TimeInterval = 24 * 60 * 60, fileManager: FileManager = .default) {
        self.root = root.appendingPathComponent("Staging", isDirectory: true)
        self.retention = retention
        self.fileManager = fileManager
    }

    func stage(source: URL, recoverableFailure: Bool = false) throws -> StagedImport {
        let input = try FileHandle(forReadingFrom: source)
        defer { try? input.close() }
        return try stage(name: source.lastPathComponent, recoverableFailure: recoverableFailure) { output, hasher, count in
            while true {
                let chunk = try input.read(upToCount: 64 * 1024) ?? Data()
                if chunk.isEmpty { break }
                try output.write(contentsOf: chunk)
                hasher.update(data: chunk)
                count += chunk.count
            }
        }
    }

    func stage(bytes: Data, name: String, recoverableFailure: Bool = false) throws -> StagedImport {
        try stage(name: name, recoverableFailure: recoverableFailure) { output, hasher, count in
            try output.write(contentsOf: bytes)
            hasher.update(data: bytes)
            count += bytes.count
        }
    }

    func transferCleanupOwnership(for capability: String) throws {
        let entry = root.appendingPathComponent(capability, isDirectory: true)
        try Data().write(to: entry.appendingPathComponent(".core-owned"), options: .atomic)
        coreOwned.insert(capability)
    }

    func releaseOwnership(for capability: String) {
        coreOwned.remove(capability)
        try? fileManager.removeItem(at: root.appendingPathComponent(capability, isDirectory: true))
    }

    func cleanupForRestart() throws { try cleanup(now: .distantFuture) }

    func cleanup(now: Date = Date()) throws {
        guard fileManager.fileExists(atPath: root.path) else { return }
        for entry in try fileManager.contentsOfDirectory(at: root, includingPropertiesForKeys: [.contentModificationDateKey]) {
            let capability = entry.lastPathComponent
            guard !isCoreOwned(capability, entry: entry) else { continue }
            let metadata = entry.appendingPathComponent("metadata.json")
            let expiration = (try? JSONDecoder().decode(Metadata.self, from: Data(contentsOf: metadata)))?.expiresAt ?? .distantPast
            if expiration <= now { try? fileManager.removeItem(at: entry) }
        }
    }

    private func isCoreOwned(_ capability: String, entry: URL) -> Bool {
        coreOwned.contains(capability)
            || fileManager.fileExists(atPath: entry.appendingPathComponent(".core-owned").path)
    }

    private func stage(name: String, recoverableFailure: Bool, copy: (FileHandle, inout SHA256, inout Int) throws -> Void) throws -> StagedImport {
        try fileManager.createDirectory(at: root, withIntermediateDirectories: true)
        let capability = UUID().uuidString.replacingOccurrences(of: "-", with: "")
        let entry = root.appendingPathComponent(capability, isDirectory: true)
        let temporary = root.appendingPathComponent(".\(capability).tmp", isDirectory: true)
        try fileManager.createDirectory(at: temporary, withIntermediateDirectories: true)
        do {
            let source = temporary.appendingPathComponent("source")
            fileManager.createFile(atPath: source.path, contents: nil)
            let output = try FileHandle(forWritingTo: source)
            defer { try? output.close() }
            var hasher = SHA256()
            var byteLength = 0
            try copy(output, &hasher, &byteLength)
            let expiry = Date().addingTimeInterval(recoverableFailure ? retention : 0)
            let metadata = Metadata(byteLength: byteLength, sha256: hasher.finalize().map { String(format: "%02x", $0) }.joined(), expiresAt: expiry)
            try JSONEncoder().encode(metadata).write(to: temporary.appendingPathComponent("metadata.json"), options: .atomic)
            try fileManager.moveItem(at: temporary, to: entry)
            return StagedImport(capability: capability, entryURL: entry, sourceURL: entry.appendingPathComponent("source"), metadataURL: entry.appendingPathComponent("metadata.json"), byteLength: byteLength, sha256: metadata.sha256)
        } catch { try? fileManager.removeItem(at: temporary); throw error }
    }

    private struct Metadata: Codable { let byteLength: Int; let sha256: String; let expiresAt: Date }
}
