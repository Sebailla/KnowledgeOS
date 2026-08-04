import Foundation

public actor CoreProcessController:
CoreTransport {
    private let executableURL: URL
    private let arguments: [String]
    private let timeout: UInt64

    private var process: Process?
    private var input: FileHandle?
    private var output: FileHandle?

    public init(
        executableURL: URL,
        arguments: [String],
        timeout: TimeInterval = 15
    ) {
        self.executableURL = executableURL
        self.arguments = arguments
        self.timeout =
            UInt64(timeout * 1_000_000_000)
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
        process.standardInput = stdin
        process.standardOutput = stdout
        process.standardError =
            FileHandle.standardError

        try process.run()

        self.process = process
        input = stdin.fileHandleForWriting
        output = stdout.fileHandleForReading
    }

    public func stop() async {
        input?.closeFile()
        output?.closeFile()

        if process?.isRunning == true {
            process?.terminate()
            process?.waitUntilExit()
        }

        process = nil
        input = nil
        output = nil
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
