import Foundation

enum ReleaseEnvironment {
    struct HostConfiguration {
        let executableURL: URL
        let arguments: [String]
        let environment: [String: String]
        let logURL: URL
        let lockURL: URL
    }

    static func hostConfiguration(
        fileManager: FileManager = .default,
        bundle: Bundle = .main
    ) throws -> HostConfiguration {
        let support = try applicationSupportDirectory(fileManager: fileManager)
        let directories = try createDataDirectories(in: support, fileManager: fileManager)
        try rotateLog(at: directories.logs.appendingPathComponent("macos-core-host.log"), fileManager: fileManager)

        let logURL = directories.logs.appendingPathComponent("macos-core-host.log")
        let lockURL = support.appendingPathComponent("knowledgeos.lock")

        if let resources = bundle.resourceURL {
            let node = resources.appendingPathComponent("Runtime/node")
            let host = resources.appendingPathComponent("CoreHost/apps/macos-core-host/dist/main.js")

            if fileManager.isExecutableFile(atPath: node.path), fileManager.fileExists(atPath: host.path) {
                return HostConfiguration(
                    executableURL: node,
                    arguments: [host.path],
                    environment: environment(directories: directories, hostRoot: resources.appendingPathComponent("CoreHost")),
                    logURL: logURL,
                    lockURL: lockURL
                )
            }
        }

        let root = URL(fileURLWithPath: fileManager.currentDirectoryPath)
        let host = root.appendingPathComponent("apps/macos-core-host/dist/main.js")
        guard fileManager.fileExists(atPath: host.path) else {
            throw ReleaseEnvironmentError.hostNotFound(host.path)
        }

        return HostConfiguration(
            executableURL: URL(fileURLWithPath: "/usr/bin/env"),
            arguments: ["node", host.path],
            environment: environment(directories: directories, hostRoot: root),
            logURL: logURL,
            lockURL: lockURL
        )
    }

    static func applicationSupportDirectory(fileManager: FileManager = .default) throws -> URL {
        guard let base = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first else {
            throw ReleaseEnvironmentError.applicationSupportUnavailable
        }
        let directory = base.appendingPathComponent("KnowledgeOS", isDirectory: true)
        try fileManager.createDirectory(at: directory, withIntermediateDirectories: true)
        return directory
    }

    private struct Directories {
        let data: URL
        let database: URL
        let cache: URL
        let logs: URL
        let imports: URL
        let exports: URL
        let models: URL
        let diagnostics: URL
    }

    private static func createDataDirectories(in support: URL, fileManager: FileManager) throws -> Directories {
        func make(_ name: String) throws -> URL {
            let url = support.appendingPathComponent(name, isDirectory: true)
            try fileManager.createDirectory(at: url, withIntermediateDirectories: true)
            return url
        }
        return try Directories(
            data: make("Data"),
            database: make("Database"),
            cache: make("Cache"),
            logs: make("Logs"),
            imports: make("Imports"),
            exports: make("Exports"),
            models: make("Models"),
            diagnostics: make("Diagnostics")
        )
    }

    private static func rotateLog(at logURL: URL, fileManager: FileManager) throws {
        guard let size = try? fileManager.attributesOfItem(atPath: logURL.path)[.size] as? NSNumber,
              size.intValue > 5 * 1024 * 1024 else { return }
        let backup = logURL.deletingPathExtension().appendingPathExtension("1.log")
        try? fileManager.removeItem(at: backup)
        try fileManager.moveItem(at: logURL, to: backup)
    }

    private static func environment(directories: Directories, hostRoot: URL) -> [String: String] {
        var value = ProcessInfo.processInfo.environment
        value["KNOWLEDGEOS_DATA_DIR"] = directories.data.path
        value["KNOWLEDGEOS_DATABASE_DIR"] = directories.database.path
        value["KNOWLEDGEOS_CACHE_DIR"] = directories.cache.path
        value["KNOWLEDGEOS_LOG_DIR"] = directories.logs.path
        value["KNOWLEDGEOS_IMPORT_DIR"] = directories.imports.path
        value["KNOWLEDGEOS_EXPORT_DIR"] = directories.exports.path
        value["KNOWLEDGEOS_MODEL_DIR"] = directories.models.path
        value["KNOWLEDGEOS_DIAGNOSTICS_DIR"] = directories.diagnostics.path
        value["KNOWLEDGEOS_HOST_ROOT"] = hostRoot.path
        value["NODE_ENV"] = "production"
        return value
    }
}

enum ReleaseEnvironmentError: LocalizedError {
    case hostNotFound(String)
    case applicationSupportUnavailable

    var errorDescription: String? {
        switch self {
        case .hostNotFound(let path):
            "KnowledgeOS Core Host was not found at \(path)."
        case .applicationSupportUnavailable:
            "The Application Support directory is unavailable."
        }
    }
}
