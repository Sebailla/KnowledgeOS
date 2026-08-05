import Foundation

public actor MobileImportCoordinator {
    public let maximumFileSize: Int
    private let store: MobileLocalStore
    private let filesDirectory: URL
    private var cancelled = Set<String>()

    public init(store: MobileLocalStore, directory: URL, maximumFileSize: Int = 250 * 1024 * 1024) throws {
        self.store=store;self.maximumFileSize=maximumFileSize;self.filesDirectory=directory.appending(path:"ImportedDocuments",directoryHint:.isDirectory)
        try FileManager.default.createDirectory(at: filesDirectory, withIntermediateDirectories: true)
    }

    public func detectFormat(name: String) throws -> MobileImportFormat {
        let ext=URL(fileURLWithPath:name).pathExtension.lowercased()
        if ["app","dmg","pkg","exe","sh","command","bin"].contains(ext) { throw MobileImportError.executableRejected }
        switch ext {
        case "pdf": return .pdf
        case "epub": return .epub
        case "md","markdown": return .markdown
        case "html","htm": return .html
        case "txt","text": return .text
        case "png","jpg","jpeg","heic","tiff","webp": return .image
        default: throw MobileImportError.unsupportedFormat
        }
    }

    public func importData(name: String, data: Data) async throws -> MobileImportResult {
        let safe=try sanitize(name);let format=try detectFormat(name:safe)
        guard data.count <= maximumFileSize else { throw MobileImportError.fileTooLarge }
        let checksum=SHA256Digest.hex(data)
        let now=ISO8601DateFormatter().string(from:Date())
        let existing=await store.current().importJobs.first{$0.checksum==checksum && $0.state == .completed}
        if let existing { return .init(job:.init(id:UUID().uuidString,originalName:name,sanitizedName:safe,format:format,checksum:checksum,size:data.count,state:.duplicate,progress:1,createdAt:now,updatedAt:now,documentId:existing.documentId,localPath:existing.localPath,error:"Duplicate content"),libraryItem:nil) }
        let id=UUID().uuidString
        var job=MobileImportJob(id:id,originalName:name,sanitizedName:safe,format:format,checksum:checksum,size:data.count,state:.copying,progress:0.25,createdAt:now,updatedAt:now,documentId:nil,localPath:nil,error:nil)
        try await store.saveImportJob(job)
        if cancelled.contains(id) { job.state = .cancelled; job.updatedAt=ISO8601DateFormatter().string(from:Date());try await store.saveImportJob(job);return .init(job:job,libraryItem:nil) }
        let destination=filesDirectory.appending(path:"\(checksum.prefix(16))-\(safe)")
        try data.write(to:destination,options:[.atomic,.completeFileProtection])
        let documentId="mobile-import:\(checksum.prefix(24))"
        let content=textContent(format:format,data:data)
        let item=MobileLibraryItem(id:documentId,title:URL(fileURLWithPath:safe).deletingPathExtension().lastPathComponent,availability:.local,localContent:content)
        try await store.upsertLibraryItem(item)
        let payload=try JSONEncoder().encode(["entityType":"document","entityId":documentId,"operationType":"create","checksum":checksum])
        try await store.enqueue(.init(id:"import:\(checksum)",method:"POST",payload:payload,idempotencyKey:"import:\(checksum)",createdAt:now))
        job.state = .completed;job.progress=1;job.documentId=documentId;job.localPath=destination.path();job.updatedAt=ISO8601DateFormatter().string(from:Date())
        try await store.saveImportJob(job)
        return .init(job:job,libraryItem:item)
    }

    public func importFile(at url: URL) async throws -> MobileImportResult {
        let data=try Data(contentsOf:url);return try await importData(name:url.lastPathComponent,data:data)
    }

    public func processSharedRequests() async -> [MobileImportResult] {
        let requests=await store.current().shareRequests.filter{$0.sourcePath != nil || $0.textContent != nil || $0.sharedURL != nil}
        var results:[MobileImportResult]=[]
        for request in requests {
            do {
                if let path=request.sourcePath { results.append(try await importFile(at:URL(fileURLWithPath:path))) }
                else if let text=request.textContent { results.append(try await importData(name:request.originalName.isEmpty ? "Shared Text.txt":request.originalName,data:Data(text.utf8))) }
                else if let value=request.sharedURL { results.append(try await importData(name:"Shared URL.txt",data:Data(value.utf8))) }
                try await store.removeShareRequest(id:request.id)
            } catch { }
        }
        return results
    }

    public func cancel(jobId:String) { cancelled.insert(jobId) }
    public func history() async -> [MobileImportJob] { await store.current().importJobs.sorted{$0.createdAt > $1.createdAt} }

    private func sanitize(_ name:String) throws -> String {
        let leaf=URL(fileURLWithPath:name).lastPathComponent
        guard !leaf.isEmpty, leaf != ".", leaf != ".." else { throw MobileImportError.invalidName }
        let safe=leaf.replacingOccurrences(of:"/",with:"-").replacingOccurrences(of:"\\",with:"-")
        guard !safe.contains("..") else { throw MobileImportError.invalidName }
        return safe
    }

    private func textContent(format:MobileImportFormat,data:Data)->String? {
        switch format { case .markdown,.html,.text: String(data:data,encoding:.utf8); default:nil }
    }
}

public enum SHA256Digest {
    public static func hex(_ data:Data)->String { hash(Array(data)).map{String(format:"%02x",$0)}.joined() }
    private static func hash(_ bytes:[UInt8])->[UInt8] {
        let k:[UInt32]=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]
        var m=bytes;let bitLength=UInt64(m.count)*8;m.append(0x80);while m.count%64 != 56 {m.append(0)};m += (0..<8).reversed().map{UInt8((bitLength >> UInt64($0*8)) & 0xff)}
        var h:[UInt32]=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]
        for chunk in stride(from:0,to:m.count,by:64){var w=[UInt32](repeating:0,count:64);for i in 0..<16{let j=chunk+i*4;w[i]=UInt32(m[j])<<24|UInt32(m[j+1])<<16|UInt32(m[j+2])<<8|UInt32(m[j+3])};for i in 16..<64{let s0=ror(w[i-15],7)^ror(w[i-15],18)^(w[i-15]>>3);let s1=ror(w[i-2],17)^ror(w[i-2],19)^(w[i-2]>>10);w[i]=w[i-16]&+s0&+w[i-7]&+s1};var a=h[0],b=h[1],c=h[2],d=h[3],e=h[4],f=h[5],g=h[6],hh=h[7];for i in 0..<64{let s1=ror(e,6)^ror(e,11)^ror(e,25);let ch=(e&f)^((~e)&g);let t1=hh&+s1&+ch&+k[i]&+w[i];let s0=ror(a,2)^ror(a,13)^ror(a,22);let maj=(a&b)^(a&c)^(b&c);let t2=s0&+maj;hh=g;g=f;f=e;e=d&+t1;d=c;c=b;b=a;a=t1&+t2};h=[h[0]&+a,h[1]&+b,h[2]&+c,h[3]&+d,h[4]&+e,h[5]&+f,h[6]&+g,h[7]&+hh]}
        return h.flatMap{v in [UInt8(v>>24),UInt8((v>>16)&255),UInt8((v>>8)&255),UInt8(v&255)]}
    }
    private static func ror(_ x:UInt32,_ n:UInt32)->UInt32 {(x>>n)|(x<<(32-n))}
}

#if canImport(UIKit)
import UIKit
public enum SecurityScopedAccessManager {
    public static func withAccess<T>(to url:URL, operation:()->T)throws->T { let started=url.startAccessingSecurityScopedResource();defer{if started{url.stopAccessingSecurityScopedResource()}};return operation() }
}
#endif
