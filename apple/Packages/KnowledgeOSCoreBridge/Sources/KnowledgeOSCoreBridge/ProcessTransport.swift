import Foundation

public actor CoreProcessController:
CoreTransport {
    private let executableURL: URL
    private let arguments: [String]
    private let timeout: UInt64
    private let environment: [String: String]?
    private let standardErrorURL: URL?

    private var process: Process?
    private var input: FileHandle?
    private var output: FileHandle?
    private var errorOutput: FileHandle?

    public init(
        executableURL: URL,
        arguments: [String],
        timeout: TimeInterval = 15,
        environment: [String: String]? = nil,
        standardErrorURL: URL? = nil
    ) {
        self.executableURL = executableURL
        self.arguments = arguments
        self.timeout =
            UInt64(timeout * 1_000_000_000)
        self.environment = environment
        self.standardErrorURL = standardErrorURL
    }

    public func start() async throws {
        guard process == nil else {
            return
        }

        let process = Process()
        let stdin = Pipe()
        let stdout = Pipe()

        process.executableURL = executableURL
        process.arguments = arguments
        process.environment = environment
        process.standardInput = stdin
        process.standardOutput = stdout

        var errorHandle: FileHandle?
        if let standardErrorURL {
            _ = FileManager.default.createFile(
                atPath: standardErrorURL.path,
                contents: nil
            )
            errorHandle = try FileHandle(
                forWritingTo: standardErrorURL
            )
            errorHandle?.seekToEndOfFile()
            process.standardError = errorHandle
        } else {
            process.standardError =
                FileHandle.standardError
        }

        try process.run()

        self.process = process
        self.errorOutput = errorHandle
        input = stdin.fileHandleForWriting
        output = stdout.fileHandleForReading
    }

    public func stop() async {
        input?.closeFile()
        output?.closeFile()
        errorOutput?.closeFile()

        if process?.isRunning == true {
            process?.terminate()
            process?.waitUntilExit()
        }

        process = nil
        input = nil
        output = nil
        errorOutput = nil
    }

    public func send(
        _ request: CoreRequest
    ) async throws -> CoreResponse {
        guard
            process?.isRunning == true,
            let input,
            let output
        else {
            throw CoreBridgeError.unavailable
        }

        input.write(
            try JSONEncoder().encode(request)
        )
        input.write(Data([0x0A]))

        return try await withThrowingTaskGroup(
            of: CoreResponse.self
        ) { group in
            group.addTask {
                let data = output.availableData

                guard !data.isEmpty else {
                    throw CoreBridgeError.terminated
                }

                return try JSONDecoder().decode(
                    CoreResponse.self,
                    from: data
                )
            }

            group.addTask {
                try await Task.sleep(
                    nanoseconds: self.timeout
                )
                throw CoreBridgeError.timeout
            }

            let response = try await group.next()
            group.cancelAll()

            guard let response else {
                throw CoreBridgeError
                    .invalidResponse
            }

            return response
        }
    }
}
