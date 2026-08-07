import Foundation

public actor CoreProcessController: CoreTransport {
    private struct PendingResponse {
        let id: String
        let continuation: CheckedContinuation<CoreResponse, Error>
        let deadline: Task<Void, Never>
    }

    private let executableURL: URL
    private let arguments: [String]
    private let timeout: UInt64
    private let environment: [String: String]?
    private let standardErrorURL: URL?

    private var process: Process?
    private var input: FileHandle?
    private var output: FileHandle?
    private var errorOutput: FileHandle?
    private var responseBuffer = Data()
    private var pending: [PendingResponse] = []
    private var responseChunkContinuation: AsyncStream<Data>.Continuation?
    private var responseReaderTask: Task<Void, Never>?

    public init(
        executableURL: URL,
        arguments: [String],
        timeout: TimeInterval = 15,
        environment: [String: String]? = nil,
        standardErrorURL: URL? = nil
    ) {
        self.executableURL = executableURL
        self.arguments = arguments
        self.timeout = UInt64(timeout * 1_000_000_000)
        self.environment = environment
        self.standardErrorURL = standardErrorURL
    }

    public func start() async throws {
        guard process == nil else { return }

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
            _ = FileManager.default.createFile(atPath: standardErrorURL.path, contents: nil)
            errorHandle = try FileHandle(forWritingTo: standardErrorURL)
            errorHandle?.seekToEndOfFile()
            process.standardError = errorHandle
        } else {
            process.standardError = FileHandle.standardError
        }

        try process.run()
        self.process = process
        input = stdin.fileHandleForWriting
        output = stdout.fileHandleForReading
        errorOutput = errorHandle
        responseBuffer.removeAll(keepingCapacity: true)
        installReader(on: stdout.fileHandleForReading)
    }

    public func stop() async {
        finishTransport(with: .terminated, terminateProcess: true)
    }

    public func send(_ request: CoreRequest) async throws -> CoreResponse {
        guard process?.isRunning == true, let input else {
            throw CoreBridgeError.unavailable
        }
        try Task.checkCancellation()

        input.write(try JSONEncoder().encode(request))
        input.write(Data([0x0A]))

        return try await withTaskCancellationHandler(operation: {
            try await withCheckedThrowingContinuation { continuation in
                let deadline = Task { [weak self] in
                    try? await Task.sleep(nanoseconds: self?.timeout ?? 0)
                    await self?.failRequest(id: request.id, with: .timeout)
                }
                pending.append(PendingResponse(id: request.id, continuation: continuation, deadline: deadline))
            }
        }, onCancel: {
            Task { await self.failRequest(id: request.id, with: .cancelled) }
        })
    }

    private func installReader(on output: FileHandle) {
        let chunks = AsyncStream<Data> { continuation in
            responseChunkContinuation = continuation
        }
        responseReaderTask = Task { [weak self] in
            for await chunk in chunks {
                await self?.receive(chunk)
            }
            await self?.receiveEndOfFile()
        }
        output.readabilityHandler = { [responseChunkContinuation] handle in
            let chunk = handle.availableData
            if chunk.isEmpty {
                responseChunkContinuation?.finish()
            } else {
                responseChunkContinuation?.yield(chunk)
            }
        }
    }

    private func receive(_ chunk: Data) {
        responseBuffer.append(chunk)
        while let delimiter = responseBuffer.firstIndex(of: 0x0A) {
            let frame = Data(responseBuffer[..<delimiter])
            responseBuffer.removeSubrange(...delimiter)
            guard !frame.isEmpty else { continue }
            guard let response = try? JSONDecoder().decode(CoreResponse.self, from: frame) else {
                finishTransport(with: .invalidResponse, terminateProcess: true)
                return
            }
            settleNext(with: response)
        }
    }

    private func receiveEndOfFile() {
        guard process != nil else { return }
        finishTransport(with: .terminated, terminateProcess: false)
    }

    private func settleNext(with response: CoreResponse) {
        guard !pending.isEmpty else { return }
        let next = pending.removeFirst()
        next.deadline.cancel()
        guard response.id == next.id else {
            next.continuation.resume(throwing: CoreBridgeError.invalidResponse)
            finishTransport(with: .invalidResponse, terminateProcess: true)
            return
        }
        next.continuation.resume(returning: response)
    }

    private func failRequest(id: String, with error: CoreBridgeError) {
        guard pending.contains(where: { $0.id == id }) else { return }
        finishTransport(with: error, terminateProcess: true)
    }

    private func finishTransport(with error: CoreBridgeError, terminateProcess: Bool) {
        let requests = pending
        pending.removeAll()
        responseBuffer.removeAll(keepingCapacity: true)
        responseChunkContinuation?.finish()
        responseChunkContinuation = nil
        responseReaderTask?.cancel()
        responseReaderTask = nil
        output?.readabilityHandler = nil
        input?.closeFile()
        output?.closeFile()
        errorOutput?.closeFile()

        if terminateProcess, process?.isRunning == true {
            process?.terminate()
            process?.waitUntilExit()
        }

        process = nil
        input = nil
        output = nil
        errorOutput = nil
        for request in requests {
            request.deadline.cancel()
            request.continuation.resume(throwing: error)
        }
    }
}
