// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "KnowledgeOSMac",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(
            name: "KnowledgeOSMac",
            targets: ["KnowledgeOSMac"]
        )
    ],
    targets: [
        .executableTarget(
            name: "KnowledgeOSMac",
            path: "Sources/KnowledgeOSMac"
        ),
        .testTarget(
            name: "KnowledgeOSMacTests",
            dependencies: ["KnowledgeOSMac"],
            path: "Tests/KnowledgeOSMacTests"
        )
    ]
)
