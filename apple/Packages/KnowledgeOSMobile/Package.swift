// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "KnowledgeOSMobile",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "KnowledgeOSMobile", targets: ["KnowledgeOSMobile"])
    ],
    dependencies: [
        .package(path: "../KnowledgeOSCoreBridge")
    ],
    targets: [
        .target(
            name: "KnowledgeOSMobile",
            dependencies: ["KnowledgeOSCoreBridge"]
        ),
        .testTarget(
            name: "KnowledgeOSMobileTests",
            dependencies: ["KnowledgeOSMobile"]
        )
    ]
)
