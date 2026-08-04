#if canImport(SwiftUI)
import XCTest
import KnowledgeOSCoreBridge
@testable import KnowledgeOSMac
actor TestDocumentService:DocumentService { func start() async throws{}; func stop() async{}; func open(id:String) async throws -> DocumentDescriptorDTO { DocumentDescriptorDTO(id:id,title:"KnowledgeOS",authors:["Team"],pageCount:2,format:.markdown,sections:[],metadata:[:]) }; func page(id:String,pageNumber:Int) async throws -> DocumentPageDTO { DocumentPageDTO(documentId:id,pageNumber:pageNumber,pageCount:2,content:"Page \(pageNumber)",format:.markdown) }; func location(id:String) async throws -> DocumentLocationDTO? { nil }; func saveLocation(id:String,pageNumber:Int,progress:Double) async throws -> DocumentLocationDTO { DocumentLocationDTO(documentId:id,pageNumber:pageNumber,progress:progress,updatedAt:"2026-08-04") } }
@MainActor final class DocumentReaderViewModelTests:XCTestCase { func testNavigation() async { let vm=DocumentReaderViewModel(service:TestDocumentService()); await vm.open(id:"d1"); XCTAssertEqual(vm.page?.pageNumber,1); await vm.nextPage(); XCTAssertEqual(vm.page?.pageNumber,2); XCTAssertEqual(vm.progress,1) } }
#endif
