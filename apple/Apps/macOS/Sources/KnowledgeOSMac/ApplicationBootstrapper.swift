import Foundation

actor ApplicationBootstrapper {
    enum BootstrapError: LocalizedError {
        case alreadyRunning
        case coreUnavailable

        var errorDescription: String? {
            switch self {
            case .alreadyRunning:
                return "KnowledgeOS is already running."
            case .coreUnavailable:
                return "KnowledgeOS Core could not be initialized."
            }
        }
    }

    private(set) var isRunning = false
    private var services: AppServices?

    func start() async throws {
        guard !isRunning else {
            throw BootstrapError.alreadyRunning
        }

        let services = AppServices.makeDefault()

        try await services.start()

        self.services = services
        self.isRunning = true
    }

    func stop() async {
        guard isRunning else {
            return
        }

        await services?.stop()
        services = nil
        isRunning = false
    }
}
