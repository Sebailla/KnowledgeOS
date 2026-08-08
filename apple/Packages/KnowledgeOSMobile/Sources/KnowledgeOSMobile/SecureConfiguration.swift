import Foundation

public enum SecureConfigurationError: Error, Equatable {
    case insecureEndpoint
}

public final class SecureConfiguration: @unchecked Sendable {
    private let defaults: UserDefaults
    private let credentialStore: MobileCredentialStore
    private let endpointKey: String

    public init(
        defaults: UserDefaults = .standard,
        credentialStore: MobileCredentialStore = DefaultMobileCredentialStore(),
        endpointKey: String = "com.knowledgeos.mobile.service-endpoint"
    ) {
        self.defaults = defaults
        self.credentialStore = credentialStore
        self.endpointKey = endpointKey
    }

    public func load() throws -> MobileServerConfiguration? {
        guard let value = defaults.string(forKey: endpointKey),
              let endpoint = URL(string: value)
        else {
            return nil
        }

        try validate(endpoint)
        return MobileServerConfiguration(
            baseURL: endpoint,
            token: try credentialStore.token()
        )
    }

    public func save(_ configuration: MobileServerConfiguration) throws {
        try validate(configuration.baseURL)
        defaults.set(configuration.baseURL.absoluteString, forKey: endpointKey)

        if let token = configuration.token, !token.isEmpty {
            try credentialStore.saveToken(token)
        } else {
            try credentialStore.clear()
        }
    }

    public func clear() throws {
        defaults.removeObject(forKey: endpointKey)
        try credentialStore.clear()
    }

    private func validate(_ endpoint: URL) throws {
        guard endpoint.scheme == "https", endpoint.host != nil else {
            throw SecureConfigurationError.insecureEndpoint
        }
    }
}
