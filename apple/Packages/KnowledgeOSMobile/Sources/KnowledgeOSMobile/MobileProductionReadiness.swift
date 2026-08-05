import Foundation
#if canImport(Network)
import Network
#endif
#if canImport(LocalAuthentication)
import LocalAuthentication
#endif

public enum MobileNetworkKind: String, Codable, Sendable { case offline, wifi, cellular, wired, other }
public struct MobileNetworkState: Codable, Sendable, Equatable {
    public let kind: MobileNetworkKind
    public let expensive: Bool
    public let constrained: Bool
    public init(kind: MobileNetworkKind, expensive: Bool = false, constrained: Bool = false) { self.kind=kind; self.expensive=expensive; self.constrained=constrained }
}

public struct MobileStoragePolicy: Codable, Sendable, Equatable {
    public var quotaBytes: Int64
    public var wifiOnlyLargeDownloads: Bool
    public var largeDownloadThresholdBytes: Int64
    public init(quotaBytes:Int64 = 5_000_000_000, wifiOnlyLargeDownloads:Bool = true, largeDownloadThresholdBytes:Int64 = 50_000_000) {
        self.quotaBytes=quotaBytes; self.wifiOnlyLargeDownloads=wifiOnlyLargeDownloads; self.largeDownloadThresholdBytes=largeDownloadThresholdBytes
    }
}

public struct MobileDiagnosticsReport: Codable, Sendable, Equatable {
    public let applicationVersion: String
    public let schemaVersion: Int
    public let network: MobileNetworkState
    public let serverConfigured: Bool
    public let pendingOperations: Int
    public let pendingConflicts: Int
    public let libraryItems: Int
    public let importJobs: Int
    public let exportJobs: Int
    public let storageBytes: Int64
    public let generatedAt: String
}

public actor MobileProductionCoordinator {
    private let store: MobileLocalStore
    private let rootDirectory: URL
    private(set) public var network = MobileNetworkState(kind: .offline)
    public var storagePolicy = MobileStoragePolicy()

    public init(store: MobileLocalStore, rootDirectory: URL) { self.store=store; self.rootDirectory=rootDirectory }

    public func updateNetwork(_ state: MobileNetworkState) { network=state }
    public func canDownload(size:Int64) -> Bool {
        if size > storagePolicy.quotaBytes { return false }
        if storagePolicy.wifiOnlyLargeDownloads && size >= storagePolicy.largeDownloadThresholdBytes { return network.kind == .wifi || network.kind == .wired }
        return network.kind != .offline
    }

    public func diagnostics(serverConfigured: Bool) async -> MobileDiagnosticsReport {
        let snapshot = await store.current()
        return MobileDiagnosticsReport(applicationVersion:"0.40.0",schemaVersion:snapshot.schemaVersion,network:network,serverConfigured:serverConfigured,pendingOperations:snapshot.offlineOperations.count,pendingConflicts:snapshot.conflicts.filter{$0.state == .pending}.count,libraryItems:snapshot.library.count,importJobs:snapshot.importJobs.count,exportJobs:snapshot.exportJobs.count,storageBytes:directorySize(rootDirectory),generatedAt:ISO8601DateFormatter().string(from:Date()))
    }

    public func clearCaches() throws {
        let cache=rootDirectory.appending(path:"Cache",directoryHint:.isDirectory)
        if FileManager.default.fileExists(atPath:cache.path()) { try FileManager.default.removeItem(at:cache) }
        try FileManager.default.createDirectory(at:cache,withIntermediateDirectories:true)
    }

    public func excludeCacheFromBackup() throws {
        let cache=rootDirectory.appending(path:"Cache",directoryHint:.isDirectory)
        try FileManager.default.createDirectory(at:cache,withIntermediateDirectories:true)
        var values=URLResourceValues(); values.isExcludedFromBackup=true; var mutable=cache; try mutable.setResourceValues(values)
    }
}

public final class MobileNetworkMonitor: @unchecked Sendable {
    public var onChange: (@Sendable (MobileNetworkState) -> Void)?
    #if canImport(Network)
    private let monitor=NWPathMonitor(); private let queue=DispatchQueue(label:"com.knowledgeos.network")
    public func start(){ monitor.pathUpdateHandler={ [weak self] path in
        let kind:MobileNetworkKind = path.status != .satisfied ? .offline : path.usesInterfaceType(.wifi) ? .wifi : path.usesInterfaceType(.cellular) ? .cellular : path.usesInterfaceType(.wiredEthernet) ? .wired : .other
        self?.onChange?(.init(kind:kind,expensive:path.isExpensive,constrained:path.isConstrained))
    }; monitor.start(queue:queue) }
    public func stop(){ monitor.cancel() }
    #else
    public init(){}
    public func start(){}
    public func stop(){}
    #endif
}

public enum MobileBiometricLock {
    public static func authenticate(reason:String) async -> Bool {
        #if canImport(LocalAuthentication)
        let context=LAContext(); var error:NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,error:&error) else { return false }
        return (try? await context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,localizedReason:reason)) ?? false
        #else
        return false
        #endif
    }
}

private func directorySize(_ url:URL) -> Int64 {
    guard let enumerator=FileManager.default.enumerator(at:url,includingPropertiesForKeys:[.fileSizeKey],options:[.skipsHiddenFiles]) else{return 0}
    var total:Int64=0
    for case let file as URL in enumerator { total += Int64((try? file.resourceValues(forKeys:[.fileSizeKey]).fileSize) ?? 0) }
    return total
}
