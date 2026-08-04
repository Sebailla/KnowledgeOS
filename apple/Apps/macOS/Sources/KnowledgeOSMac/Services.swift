import Foundation
import KnowledgeOSCoreBridge

protocol LifecycleService: Sendable {
    func start() async throws
    func stop() async
}

protocol LibraryService: LifecycleService {
    func list(
        query: LibraryQuery
    ) async throws -> LibraryPageDTO
    func item(
        id: String
    ) async throws -> LibraryItemDTO
    func recent(
        limit: Int
    ) async throws -> [LibraryItemDTO]
    func favorites(
        limit: Int
    ) async throws -> [LibraryItemDTO]
}
protocol SearchService: LifecycleService {}
protocol DocumentService:LifecycleService { func open(id:String) async throws -> DocumentDescriptorDTO; func page(id:String,pageNumber:Int) async throws -> DocumentPageDTO; func location(id:String) async throws -> DocumentLocationDTO?; func saveLocation(id:String,pageNumber:Int,progress:Double) async throws -> DocumentLocationDTO }
protocol AnnotationService:LifecycleService { func list(documentId:String) async throws->[AnnotationDTO]; func create(id:String,kind:AnnotationKind,anchor:AnnotationAnchorDTO,color:AnnotationColor?,body:String?) async throws->AnnotationDTO; func delete(id:String) async throws->Bool }
protocol WorkspaceService: LifecycleService {}
protocol AIService: LifecycleService {}
protocol KnowledgeGraphService:
LifecycleService {}

extension CoreLibraryAdapter:
LibraryService {}
extension CoreSearchAdapter:
SearchService {}
extension CoreWorkspaceAdapter:
WorkspaceService {}
extension CoreAIAdapter:
AIService {}
extension CoreKnowledgeGraphAdapter:
KnowledgeGraphService {}

extension CoreDocumentAdapter:DocumentService {}

extension CoreAnnotationAdapter:AnnotationService {}
