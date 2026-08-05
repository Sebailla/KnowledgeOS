import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

public struct MobileServerConfiguration:Codable,Sendable,Equatable { public let baseURL:URL; public let token:String?; public init(baseURL:URL,token:String?=nil){self.baseURL=baseURL;self.token=token} }
public enum MobileHTTPError:Error,LocalizedError { case invalidResponse,server(Int,String),insecureTransport; public var errorDescription:String?{switch self{case .invalidResponse:"Invalid server response.";case .server(let s,let m):"Server error \(s): \(m)";case .insecureTransport:"Production servers must use HTTPS."}} }

public actor MobileHTTPClient {
    private var configuration:MobileServerConfiguration; private let session:URLSession
    public init(configuration:MobileServerConfiguration,session:URLSession = .shared){self.configuration=configuration;self.session=session}
    public func update(configuration:MobileServerConfiguration){self.configuration=configuration}
    public func send<Result:Decodable>(_ path:String,method:String="GET",body:Data?=nil,headers:[String:String]=[:],as type:Result.Type) async throws -> Result {
        if configuration.baseURL.scheme != "https" && configuration.baseURL.host != "127.0.0.1" && configuration.baseURL.host != "localhost" { throw MobileHTTPError.insecureTransport }
        var request=URLRequest(url:configuration.baseURL.appending(path:path));request.httpMethod=method;request.httpBody=body;request.timeoutInterval=30;request.setValue("application/json",forHTTPHeaderField:"Accept");if body != nil{request.setValue("application/json",forHTTPHeaderField:"Content-Type")};if let token=configuration.token{request.setValue("Bearer \(token)",forHTTPHeaderField:"Authorization")};for (k,v) in headers{request.setValue(v,forHTTPHeaderField:k)}
        let(data,response)=try await session.data(for:request);guard let http=response as? HTTPURLResponse else{throw MobileHTTPError.invalidResponse};guard(200..<300).contains(http.statusCode)else{throw MobileHTTPError.server(http.statusCode,String(data:data,encoding:.utf8) ?? "Unknown error")};return try JSONDecoder().decode(Result.self,from:data)
    }
}
