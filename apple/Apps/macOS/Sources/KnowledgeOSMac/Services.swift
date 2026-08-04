import Foundation
import KnowledgeOSCoreBridge

protocol LifecycleService: Sendable {
    func start() async throws
    func stop() async
}

protocol LibraryService: LifecycleService {}
protocol SearchService: LifecycleService {}
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
