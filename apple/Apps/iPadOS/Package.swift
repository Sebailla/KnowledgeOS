// swift-tools-version: 5.10
import PackageDescription
let package = Package(
    name: "KnowledgeOSiPadOS",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.executable(name:"KnowledgeOSiPadOS",targets:["KnowledgeOSiPadOS"])],
    dependencies:[.package(path:"../../Packages/KnowledgeOSMobile")],
    targets:[
        .executableTarget(name:"KnowledgeOSiPadOS",dependencies:["KnowledgeOSMobile"]),
        .testTarget(name:"KnowledgeOSiPadOSTests",dependencies:["KnowledgeOSiPadOS"])
    ]
)
