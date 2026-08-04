import KnowledgeOSCoreBridge
import Foundation

actor ApplicationBootstrapper {
    enum BootstrapError: LocalizedError {
        case alreadyRunning
        case coreUnavailable

        var errorDescription: String? {
            switch self {
            case .alreadyRunning:
                "KnowledgeOS is already running."
            case .coreUnavailable:
                "KnowledgeOS Core could not be initialized."
            }
        }
    }

    typealias ServicesFactory =
        @Sendable () throws -> AppServices

    private let servicesFactory:
        ServicesFactory

    private(set) var isRunning = false
    private var services: AppServices?

    init(
        servicesFactory:
            @escaping ServicesFactory = {
                try AppServices.makeDefault()
            }
    ) {
        self.servicesFactory =
            servicesFactory
    }

    func start() async throws {
        guard !isRunning else {
            throw BootstrapError.alreadyRunning
        }

        let services =
            try servicesFactory()

        try await services.start()

        self.services = services
        self.isRunning = true
    }

    func runningState() -> Bool {
        isRunning
    }

    func annotationService() async -> AnnotationService? { services?.annotations }

    func coreBridge() async -> CoreBridge? { services?.bridge }

    func documentService() async -> DocumentService? { services?.document }

    func libraryService()
    async -> LibraryService? {
        services?.library
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
