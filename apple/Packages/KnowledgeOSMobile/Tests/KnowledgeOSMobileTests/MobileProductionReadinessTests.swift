import XCTest
@testable import KnowledgeOSMobile
final class MobileProductionReadinessTests:XCTestCase {
 func testDownloadPolicyRequiresWifiForLargeFiles() async throws {
  let dir=FileManager.default.temporaryDirectory.appending(path:UUID().uuidString); let store=try MobileLocalStore(directory:dir); let coordinator=MobileProductionCoordinator(store:store,rootDirectory:dir)
  await coordinator.updateNetwork(.init(kind:.cellular,expensive:true)); let cellular=await coordinator.canDownload(size:60_000_000); XCTAssertFalse(cellular)
  await coordinator.updateNetwork(.init(kind:.wifi)); let wifi=await coordinator.canDownload(size:60_000_000); XCTAssertTrue(wifi)
 }
 func testDiagnosticsExcludeCredentials() async throws {
  let dir=FileManager.default.temporaryDirectory.appending(path:UUID().uuidString); let store=try MobileLocalStore(directory:dir); let coordinator=MobileProductionCoordinator(store:store,rootDirectory:dir); let report=await coordinator.diagnostics(serverConfigured:true); XCTAssertEqual(report.applicationVersion,"0.40.0"); XCTAssertTrue(report.serverConfigured)
 }
}
