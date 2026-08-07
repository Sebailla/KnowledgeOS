#if canImport(SwiftUI)
import Foundation
@MainActor enum DeepLinkCoordinator { static func handle(_ url:URL,appModel:AppModel){ guard url.scheme=="knowledgeos" else{return}; let parts=url.pathComponents.filter { $0 != "/" }; switch url.host { case "document": if let id=parts.first{appModel.openDocument(id:id)}; case "search": if let q=URLComponents(url:url,resolvingAgainstBaseURL:false)?.queryItems?.first(where:{$0.name=="q"})?.value{appModel.searchText=q;appModel.select(.search)}; case "graph":appModel.select(.knowledgeGraph); case "conversation":appModel.select(.ai); case "import":appModel.select(.importFiles); case "export":appModel.select(.exportFiles); default:break } } }
#endif
