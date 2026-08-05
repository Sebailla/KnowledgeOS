#if canImport(SwiftUI)
import SwiftUI

struct AboutView: View {
    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        VStack(spacing: 18) {
            Image(
                systemName:
                    "books.vertical.fill"
            )
            .font(.system(size: 54))

            Text("KnowledgeOS")
                .font(.largeTitle.bold())

            if let about =
                appModel
                    .applicationStatusViewModel?
                    .about {
                Text(
                    "Application \(about.applicationVersion)"
                )

                Text(
                    "Host \(about.hostVersion) · Protocol \(about.protocolVersion)"
                )
                .foregroundStyle(
                    .secondary
                )

                Text(about.copyright)
                    .font(.caption)
                    .foregroundStyle(
                        .secondary
                    )
            }

            Text(
                "Offline-first personal knowledge platform."
            )
            .multilineTextAlignment(
                .center
            )
        }
        .padding(36)
        .frame(
            minWidth: 420,
            minHeight: 320
        )
    }
}
#endif
