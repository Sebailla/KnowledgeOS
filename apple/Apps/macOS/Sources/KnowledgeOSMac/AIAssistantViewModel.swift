#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge
@MainActor final class AIAssistantViewModel: ObservableObject {
 @Published private(set) var models:[AIModelDTO]=[]; @Published private(set) var conversation:AIConversationDTO?; @Published private(set) var health:AIRuntimeHealthDTO?; @Published var prompt=""; @Published var selectedModelId:String?; @Published var errorMessage:String?; @Published private(set) var isGenerating=false
 private let bridge:CoreBridge
 init(bridge:CoreBridge){self.bridge=bridge}
 func load() async { do { async let m=bridge.aiModels(); async let h=bridge.aiHealth(); let value=try await(m,h); models=value.0; health=value.1; selectedModelId=value.1.selectedModelId } catch { errorMessage=error.localizedDescription } }
 func send() async { let value=prompt.trimmingCharacters(in:.whitespacesAndNewlines); guard !value.isEmpty else{return}; isGenerating=true; errorMessage=nil; do { conversation=try await bridge.aiChat(message:value,conversationId:conversation?.id,modelId:selectedModelId); prompt="" } catch { errorMessage=error.localizedDescription }; isGenerating=false }
 func newConversation(){conversation=nil}
}
#endif
