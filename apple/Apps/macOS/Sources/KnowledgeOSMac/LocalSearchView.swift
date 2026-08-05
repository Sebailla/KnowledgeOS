#if canImport(SwiftUI)
import SwiftUI
import KnowledgeOSCoreBridge

struct LocalSearchView: View {
    @ObservedObject
    var viewModel: LocalSearchViewModel

    @EnvironmentObject
    private var appModel: AppModel

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                TextField(
                    "Search your knowledge",
                    text: $viewModel.query
                )
                .textFieldStyle(.roundedBorder)
                .onSubmit {
                    Task {
                        await viewModel.search()
                    }
                }

                Button("Search") {
                    Task {
                        await viewModel.search()
                    }
                }
            }
            .padding()

            if !viewModel.suggestions.isEmpty {
                ScrollView(.horizontal) {
                    HStack {
                        ForEach(
                            viewModel.suggestions,
                            id: \.self
                        ) { suggestion in
                            Button(suggestion) {
                                viewModel.query =
                                    suggestion
                                Task {
                                    await viewModel
                                        .search()
                                }
                            }
                            .buttonStyle(.bordered)
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.bottom, 8)
            }

            Divider()

            if viewModel.isLoading {
                ProgressView("Searching…")
                    .frame(
                        maxWidth: .infinity,
                        maxHeight: .infinity
                    )
            } else if let error =
                viewModel.errorMessage {
                ContentUnavailableView(
                    "Search failed",
                    systemImage:
                        "exclamationmark.triangle",
                    description: Text(error)
                )
            } else if viewModel.results.isEmpty {
                ContentUnavailableView(
                    "Search",
                    systemImage:
                        "magnifyingglass",
                    description: Text(
                        "Enter a query to search the local index."
                    )
                )
            } else {
                List(viewModel.results) { item in
                    VStack(
                        alignment: .leading,
                        spacing: 6
                    ) {
                        HStack {
                            Text(item.title)
                                .font(.headline)
                            Spacer()
                            Text(
                                String(
                                    format:
                                        "%.1f",
                                    item.score
                                )
                            )
                            .font(.caption)
                            .foregroundStyle(
                                .secondary
                            )
                        }

                        Text(item.snippet)
                            .foregroundStyle(
                                .secondary
                            )

                        Text(
                            item.highlights
                                .joined(
                                    separator: " · "
                                )
                        )
                        .font(.caption)
                        .foregroundStyle(
                            .tint
                        )
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        appModel
                            .openDocumentID =
                            item.id
                    }
                }
            }
        }
    }
}
#endif
