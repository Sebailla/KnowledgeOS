// swift-tools-version: 5.10
import PackageDescription
let package = Package(
    name: "KnowledgeOSiOS",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.executable(name:"KnowledgeOSiOS",targets:["KnowledgeOSiOS"])],
    dependencies:[.package(path:"../../Packages/KnowledgeOSMobile")],
    targets:[
        .executableTarget(name:"KnowledgeOSiOS",dependencies:["KnowledgeOSMobile"]),
        .testTarget(name:"KnowledgeOSiOSTests",dependencies:["KnowledgeOSiOS"])
    ]
)
