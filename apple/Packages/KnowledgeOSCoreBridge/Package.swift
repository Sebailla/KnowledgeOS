// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "KnowledgeOSCoreBridge",
    platforms: [.macOS(.v14)],
    products: [
        .library(
            name: "KnowledgeOSCoreBridge",
            targets: ["KnowledgeOSCoreBridge"]
        )
    ],
    targets: [
        .target(
            name: "KnowledgeOSCoreBridge"
        ),
        .testTarget(
            name: "KnowledgeOSCoreBridgeTests",
            dependencies: ["KnowledgeOSCoreBridge"]
        )
    ]
)
