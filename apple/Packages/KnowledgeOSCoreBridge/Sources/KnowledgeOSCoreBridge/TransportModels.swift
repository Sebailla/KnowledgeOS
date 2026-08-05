import Foundation

public struct TransportConfigurationDTO:
Codable, Sendable, Equatable {
    public let baseURL: String
    public let token: String?
    public let timeoutMilliseconds: Int?
    public let maxAttempts: Int?

    public init(
        baseURL: String,
        token: String? = nil,
        timeoutMilliseconds: Int? = 10_000,
        maxAttempts: Int? = 3
    ) {
        self.baseURL = baseURL
        self.token = token
        self.timeoutMilliseconds =
            timeoutMilliseconds
        self.maxAttempts = maxAttempts
    }

    var jsonValue: JSONValue {
        var value: [String: JSONValue] = [
            "baseURL": .string(baseURL)
        ]

        if let token {
            value["token"] = .string(token)
        }

        if let timeoutMilliseconds {
            value["timeoutMilliseconds"] =
                .number(
                    Double(timeoutMilliseconds)
                )
        }

        if let maxAttempts {
            value["maxAttempts"] =
                .number(Double(maxAttempts))
        }

        return .object(value)
    }
}

public struct TransportHealthDTO:
Codable, Sendable, Equatable {
    public let status: String
    public let protocolVersion: String
    public let serverVersion: String
    public let latencyMilliseconds: Int
    public let authenticated: Bool
}
