import Foundation

enum ReleaseEnvironment {
    struct HostConfiguration {
        let executableURL: URL
        let arguments: [String]
        let environment: [String: String]
        let logURL: URL
    }

    static func hostConfiguration(
        fileManager: FileManager = .default,
        bundle: Bundle = .main
    ) throws -> HostConfiguration {
        let support = try applicationSupportDirectory(
            fileManager: fileManager
        )
        let logs = support.appendingPathComponent(
            "Logs",
            isDirectory: true
        )
        try fileManager.createDirectory(
            at: logs,
            withIntermediateDirectories: true
        )

        let data = support.appendingPathComponent(
            "Data",
            isDirectory: true
        )
        try fileManager.createDirectory(
            at: data,
            withIntermediateDirectories: true
        )

        let logURL = logs.appendingPathComponent(
            "macos-core-host.log"
        )

        if let resources = bundle.resourceURL {
            let node = resources
                .appendingPathComponent("Runtime/node")
            let host = resources
                .appendingPathComponent(
                    "CoreHost/apps/macos-core-host/dist/main.js"
                )

            if fileManager.isExecutableFile(
                atPath: node.path
            ), fileManager.fileExists(
                atPath: host.path
            ) {
                return HostConfiguration(
                    executableURL: node,
                    arguments: [host.path],
                    environment: environment(
                        dataDirectory: data,
                        hostRoot: resources
                            .appendingPathComponent("CoreHost")
                    ),
                    logURL: logURL
                )
            }
        }

        let root = URL(
            fileURLWithPath:
                fileManager.currentDirectoryPath
        )
        let host = root.appendingPathComponent(
            "apps/macos-core-host/dist/main.js"
        )

        guard fileManager.fileExists(
            atPath: host.path
        ) else {
            throw ReleaseEnvironmentError
                .hostNotFound(host.path)
        }

        return HostConfiguration(
            executableURL: URL(
                fileURLWithPath: "/usr/bin/env"
            ),
            arguments: ["node", host.path],
            environment: environment(
                dataDirectory: data,
                hostRoot: root
            ),
            logURL: logURL
        )
    }

    static func applicationSupportDirectory(
        fileManager: FileManager = .default
    ) throws -> URL {
        guard let base = fileManager.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first else {
            throw ReleaseEnvironmentError
                .applicationSupportUnavailable
        }

        let directory = base.appendingPathComponent(
            "KnowledgeOS",
            isDirectory: true
        )
        try fileManager.createDirectory(
            at: directory,
            withIntermediateDirectories: true
        )
        return directory
    }

    private static func environment(
        dataDirectory: URL,
        hostRoot: URL
    ) -> [String: String] {
        var value = ProcessInfo.processInfo.environment
        value["KNOWLEDGEOS_DATA_DIR"] =
            dataDirectory.path
        value["KNOWLEDGEOS_HOST_ROOT"] =
            hostRoot.path
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
