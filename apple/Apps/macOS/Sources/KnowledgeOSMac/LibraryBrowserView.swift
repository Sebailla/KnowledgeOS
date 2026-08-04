#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

struct LibraryBrowserView: View {
    @EnvironmentObject private var appModel: AppModel
    @ObservedObject
    var viewModel: LibraryViewModel

    private let columns = [
        GridItem(
            .adaptive(minimum: 180),
            spacing: 16
        )
    ]

    var body: some View {
        VStack(spacing: 0) {
            controls

            Divider()

            content
        }
        .task {
            await viewModel.load()
        }
        .onChange(
            of: viewModel.queryText
        ) {
            Task {
                await viewModel
                    .reloadForQuery()
            }
        }
        .onChange(
            of: viewModel.sort
        ) {
            Task {
                await viewModel
                    .reloadForQuery()
            }
        }
        .onChange(
            of: viewModel.availability
        ) {
            Task {
                await viewModel
                    .reloadForQuery()
            }
        }
    }

    private var controls:
    some View {
        HStack {
            Picker(
                "Availability",
                selection:
                    $viewModel.availability
            ) {
                Text("All")
                    .tag(
                        LibraryAvailability?
                            .none
                    )

                ForEach(
                    LibraryAvailability
                        .allCases,
                    id: \.self
                ) { item in
                    Text(
                        item.displayName
                    )
                    .tag(
                        Optional(item)
                    )
                }
            }
            .frame(width: 180)

            Picker(
                "Sort",
                selection: $viewModel.sort
            ) {
                ForEach(
                    LibrarySort.allCases,
                    id: \.self
                ) { item in
                    Text(item.displayName)
                        .tag(item)
                }
            }
            .frame(width: 180)

            Spacer()

            Picker(
                "View",
                selection:
                    $viewModel.presentation
            ) {
                Image(
                    systemName:
                        "square.grid.2x2"
                )
                .tag(
                    LibraryViewModel
                        .Presentation.grid
                )

                Image(
                    systemName:
                        "list.bullet"
                )
                .tag(
                    LibraryViewModel
                        .Presentation.list
                )
            }
            .pickerStyle(.segmented)
            .frame(width: 90)

            Text(
                "\(viewModel.total) items"
            )
            .foregroundStyle(.secondary)
        }
        .padding()
    }

    @ViewBuilder
    private var content:
    some View {
        if viewModel.isLoading &&
            viewModel.items.isEmpty {
            ProgressView("Loading Library…")
                .frame(
                    maxWidth: .infinity,
                    maxHeight: .infinity
                )
        } else if let message =
            viewModel.errorMessage {
            ContentUnavailableView(
                "Library could not be loaded",
                systemImage:
                    "exclamationmark.triangle",
                description: Text(message)
            )
        } else if viewModel.items.isEmpty {
            ContentUnavailableView(
                "No Library Items",
                systemImage: "books.vertical",
                description: Text(
                    "Adjust the search or filters."
                )
            )
        } else {
            switch viewModel.presentation {
            case .grid:
                grid
            case .list:
                list
            }
        }
    }

    private var grid:
    some View {
        ScrollView {
            LazyVGrid(
                columns: columns,
                spacing: 16
            ) {
                ForEach(
                    viewModel.items
                ) { item in
                    LibraryCardView(
                        item: item,
                        isSelected:
                            viewModel
                                .selectedItemID ==
                            item.id
                    )
                    .onTapGesture {
                        viewModel
                            .selectedItemID =
                            item.id
                    }
                    .onTapGesture(count: 2) { appModel.openDocumentID = item.id }
                }
            }
            .padding()
        }
    }

    private var list:
    some View {
        List(
            viewModel.items,
            selection:
                $viewModel.selectedItemID
        ) { item in
            LibraryRowView(item: item)
                .tag(item.id)
        }
    }
}

private struct LibraryCardView:
View {
    let item: LibraryItemDTO
    let isSelected: Bool

    var body: some View {
        VStack(alignment: .leading) {
            RoundedRectangle(
                cornerRadius: 12
            )
            .fill(.quaternary)
            .aspectRatio(
                0.72,
                contentMode: .fit
            )
            .overlay {
                Image(
                    systemName:
                        item.kind.systemImage
                )
                .font(.system(size: 42))
                .foregroundStyle(.secondary)
            }

            Text(item.title)
                .font(.headline)
                .lineLimit(2)

            Text(
                item.authors.joined(
                    separator: ", "
                )
            )
            .font(.caption)
            .foregroundStyle(.secondary)
            .lineLimit(1)

            Label(
                item.availability.displayName,
                systemImage:
                    item.availability
                        .systemImage
            )
            .font(.caption2)
            .foregroundStyle(.secondary)
        }
        .padding(10)
        .background(
            isSelected
                ? Color.accentColor
                    .opacity(0.14)
                : Color.clear,
            in: RoundedRectangle(
                cornerRadius: 14
            )
        )
    }
}

private struct LibraryRowView:
View {
    let item: LibraryItemDTO

    var body: some View {
        HStack {
            Image(
                systemName:
                    item.kind.systemImage
            )
            .frame(width: 28)

            VStack(alignment: .leading) {
                Text(item.title)
                Text(
                    item.authors.joined(
                        separator: ", "
                    )
                )
                .font(.caption)
                .foregroundStyle(.secondary)
            }

            Spacer()

            if item.favorite {
                Image(systemName: "star.fill")
                    .foregroundStyle(.yellow)
            }

            Label(
                item.availability.displayName,
                systemImage:
                    item.availability
                        .systemImage
            )
            .font(.caption)
            .foregroundStyle(.secondary)
        }
    }
}

private extension LibraryAvailability {
    var displayName: String {
        switch self {
        case .local: "Local"
        case .masterLibrary: "Master Library"
        case .both: "Local + Master"
        case .unavailable: "Unavailable"
        }
    }

    var systemImage: String {
        switch self {
        case .local: "internaldrive"
        case .masterLibrary: "externaldrive.connected.to.line.below"
        case .both: "arrow.triangle.2.circlepath"
        case .unavailable: "exclamationmark.circle"
        }
    }
}

private extension LibraryItemKind {
    var systemImage: String {
        switch self {
        case .book: "book.closed"
        case .paper: "doc.text"
        case .document: "doc.richtext"
        case .web: "globe"
        case .note: "note.text"
        }
    }
}

private extension LibrarySort {
    var displayName: String {
        switch self {
        case .titleAscending: "Title A–Z"
        case .titleDescending: "Title Z–A"
        case .updatedDescending: "Recently Updated"
        case .createdDescending: "Recently Added"
        }
    }
}
#endif
