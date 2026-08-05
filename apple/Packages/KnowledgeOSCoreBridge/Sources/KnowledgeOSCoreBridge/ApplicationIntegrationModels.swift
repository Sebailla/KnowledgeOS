import Foundation

public struct ApplicationServiceStatusDTO:
Codable, Sendable, Equatable, Identifiable {
    public let id: String
    public let status: String
    public let detail: String?
}

public struct ApplicationStatusDTO:
Codable, Sendable, Equatable {
    public let status: String
    public let phase: String
    public let protocolVersion: String
    public let hostVersion: String
    public let startedAt: String
    public let uptimeMilliseconds: Int
    public let services:
        [ApplicationServiceStatusDTO]
}

public struct ConfigurationIssueDTO:
Codable, Sendable, Equatable, Identifiable {
    public var id: String {
        code
    }

    public let severity: String
    public let code: String
    public let message: String
}

public struct ConfigurationValidationDTO:
Codable, Sendable, Equatable {
    public let valid: Bool
    public let issues:
        [ConfigurationIssueDTO]
}

public struct ApplicationEnvironmentDTO:
Codable, Sendable, Equatable {
    public let platform: String
    public let architecture: String
    public let nodeVersion: String
    public let dataDirectory: String
}

public struct ApplicationDiagnosticsDTO:
Codable, Sendable, Equatable {
    public let status: String
    public let phase: String
    public let protocolVersion: String
    public let hostVersion: String
    public let startedAt: String
    public let uptimeMilliseconds: Int
    public let services:
        [ApplicationServiceStatusDTO]
    public let environment:
        ApplicationEnvironmentDTO
    public let configuration:
        ConfigurationValidationDTO
}

public struct ApplicationAboutDTO:
Codable, Sendable, Equatable {
    public let name: String
    public let applicationVersion: String
    public let hostVersion: String
    public let protocolVersion: String
    public let copyright: String
}
