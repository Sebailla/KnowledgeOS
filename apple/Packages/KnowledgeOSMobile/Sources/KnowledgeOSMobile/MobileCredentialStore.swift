import Foundation
#if canImport(Security)
import Security
#endif

public protocol MobileCredentialStore:Sendable { func saveToken(_ token:String) throws; func token() throws -> String?; func clear() throws }

public final class DefaultMobileCredentialStore:MobileCredentialStore,@unchecked Sendable {
    private let service="com.knowledgeos.mobile"; private let account="sync-token"
    public init(){}
    public func saveToken(_ token:String) throws {
        #if canImport(Security)
        let data=Data(token.utf8); let query:[String:Any]=[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:service,kSecAttrAccount as String:account]
        SecItemDelete(query as CFDictionary); var add=query; add[kSecValueData as String]=data; let status=SecItemAdd(add as CFDictionary,nil); guard status==errSecSuccess else{throw MobileCredentialError.keychain(status)}
        #else
        try token.data(using:.utf8)?.write(to:fallbackURL(),options:.atomic)
        #endif
    }
    public func token() throws -> String? {
        #if canImport(Security)
        let query:[String:Any]=[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:service,kSecAttrAccount as String:account,kSecReturnData as String:true,kSecMatchLimit as String:kSecMatchLimitOne]
        var result:AnyObject?; let status=SecItemCopyMatching(query as CFDictionary,&result); if status==errSecItemNotFound{return nil}; guard status==errSecSuccess,let data=result as? Data else{throw MobileCredentialError.keychain(status)}; return String(data:data,encoding:.utf8)
        #else
        guard let data=try? Data(contentsOf:fallbackURL()) else{return nil}; return String(data:data,encoding:.utf8)
        #endif
    }
    public func clear() throws {
        #if canImport(Security)
        let query:[String:Any]=[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:service,kSecAttrAccount as String:account]; SecItemDelete(query as CFDictionary)
        #else
        try? FileManager.default.removeItem(at:fallbackURL())
        #endif
    }
    private func fallbackURL()->URL { FileManager.default.temporaryDirectory.appending(path:"knowledgeos-mobile-token") }
}
public enum MobileCredentialError:Error { case keychain(Int32) }
