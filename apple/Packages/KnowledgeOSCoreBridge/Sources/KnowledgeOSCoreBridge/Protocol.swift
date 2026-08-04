import Foundation

public enum CoreProtocol {
    public static let version = "1.0"
}

public enum JSONValue:
Codable, Sendable, Equatable {
    case string(String)
    case number(Double)
    case bool(Bool)
    case object([String: JSONValue])
    case array([JSONValue])
    case null

    public init(from decoder: Decoder) throws {
        let container =
            try decoder.singleValueContainer()

        if container.decodeNil() {
            self = .null
        } else if let value =
            try? container.decode(Bool.self) {
            self = .bool(value)
        } else if let value =
            try? container.decode(Double.self) {
            self = .number(value)
        } else if let value =
            try? container.decode(String.self) {
            self = .string(value)
        } else if let value =
            try? container.decode(
                [String: JSONValue].self
            ) {
            self = .object(value)
        } else {
            self = .array(
                try container.decode(
                    [JSONValue].self
                )
            )
        }
    }

    public func encode(
        to encoder: Encoder
    ) throws {
        var container =
            encoder.singleValueContainer()

        switch self {
        case .string(let value):
            try container.encode(value)
        case .number(let value):
            try container.encode(value)
        case .bool(let value):
            try container.encode(value)
        case .object(let value):
            try container.encode(value)
        case .array(let value):
            try container.encode(value)
        case .null:
            try container.encodeNil()
        }
    }
}

public struct CoreRequest:
Codable, Sendable {
    public let version: String
    public let id: String
    public let method: String
    public let params: JSONValue?

    public init(
        id: String = UUID().uuidString,
        method: String,
        params: JSONValue? = nil
    ) {
        self.version = CoreProtocol.version
        self.id = id
        self.method = method
        self.params = params
    }
}

public struct CoreResponse:
Codable, Sendable {
    public struct Failure:
    Codable, Sendable {
        public let code: String
        public let message: String

        public init(
            code: String,
            message: String
        ) {
            self.code = code
            self.message = message
        }
    }

    public let version: String
    public let id: String
    public let result: JSONValue?
    public let error: Failure?

    public init(
        version: String,
        id: String,
        result: JSONValue?,
        error: Failure?
    ) {
        self.version = version
        self.id = id
        self.result = result
        self.error = error
    }
}
