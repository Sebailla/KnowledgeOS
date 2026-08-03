import type {
  CommandReceipt,
  RegisterLocalSourceCommand,
} from "@knowledgeos/contracts";
import {
  KnowledgeObject,
  LocalLibrary,
  PublicationVersion,
  SourceItem,
  type KnowledgeObjectRepository,
  type LocalLibraryRepository,
  type PublicationVersionRepository,
  type SourceItemRepository,
  DomainEventFactory,
} from "@knowledgeos/domain";
import type {
  ContentFingerprint,
  ProvenanceRecord,
} from "@knowledgeos/domain-types";
import type {
  CommandHandler,
  ExecutionContext,
  UnitOfWork,
} from "@knowledgeos/kernel";
import type { CommittedEventPublisher } from "../ports/event-publisher.js";
import type { LibraryIdentityService } from "../ports/library-identity.js";
import { libraryNotFound } from "../errors.js";

export interface RegisterLocalSourceDependencies {
  readonly knowledgeObjects: KnowledgeObjectRepository;
  readonly sources: SourceItemRepository;
  readonly publications: PublicationVersionRepository;
  readonly localLibraries: LocalLibraryRepository;
  readonly identities: LibraryIdentityService;
  readonly events: DomainEventFactory;
  readonly unitOfWork: UnitOfWork;
  readonly publisher: CommittedEventPublisher;
}

export class RegisterLocalSourceHandler
implements CommandHandler<RegisterLocalSourceCommand> {
  public constructor(
    private readonly dependencies: RegisterLocalSourceDependencies,
  ) {}

  async handle(
    command: RegisterLocalSourceCommand,
    context: ExecutionContext,
  ): Promise<CommandReceipt> {
    const localLibrary = await this.dependencies.localLibraries.get(
      command.payload.localLibraryId,
    );
    if (!localLibrary) throw libraryNotFound(command.payload.localLibraryId);

    const knowledgeObjectId = this.dependencies.identities.knowledgeObjectId();
    const publicationId = this.dependencies.identities.publicationId();
    const sourceVersionId =
      command.payload.sourceVersionId ?? this.dependencies.identities.versionId();
    const objectVersionId = this.dependencies.identities.versionId();
    const title =
      command.payload.title?.trim() ||
      command.payload.originalFilename?.trim() ||
      "Untitled publication";
    const provenance: ProvenanceRecord[] = [
      {
        kind: "user",
        occurredAt: context.clock.nowIso(),
        evidence: {
          operationId: command.commandId,
          localLibraryId: command.payload.localLibraryId,
        },
      },
    ];

    const registeredEvent = this.dependencies.events.create(
      "knowledge-object.registered",
      knowledgeObjectId,
      objectVersionId,
      context.correlationId,
      { title, localLibraryId: command.payload.localLibraryId },
    );
    const knowledgeObject = KnowledgeObject.register(
      {
        id: knowledgeObjectId,
        title,
        authority: { scope: "local-library", kind: "user" },
        provenance,
        status: "registered",
      },
      registeredEvent,
    );

    const source = SourceItem.create({
      id: command.payload.sourceItemId,
      versionId: sourceVersionId,
      contentFingerprint:
        command.payload.contentFingerprint as ContentFingerprint,
      mediaType: command.payload.mediaType ?? "application/octet-stream",
      byteLength: command.payload.byteLength ?? 0,
      custody: "local-authoritative",
      provenance,
      ...(command.payload.originalFilename === undefined
        ? {}
        : { originalFilename: command.payload.originalFilename }),
    });

    const publication = PublicationVersion.create({
      publicationId,
      versionId: objectVersionId,
      knowledgeObjectId,
      sourceItemId: command.payload.sourceItemId,
      sequence: 1,
      label: "Initial local publication",
    });

    const membershipEvent = this.dependencies.events.create(
      "local-library.membership-added",
      command.payload.localLibraryId,
      objectVersionId,
      context.correlationId,
      { knowledgeObjectId, sourceItemId: command.payload.sourceItemId },
    );
    localLibrary.addMembership(
      {
        localLibraryId: command.payload.localLibraryId,
        knowledgeObjectId,
        sourceItemId: command.payload.sourceItemId,
        sourceVersionId,
        state: "available",
      },
      membershipEvent,
    );

    await this.dependencies.unitOfWork.run(async () => {
      await this.dependencies.sources.save(source);
      await this.dependencies.knowledgeObjects.save(knowledgeObject);
      await this.dependencies.publications.save(publication);
      await this.dependencies.localLibraries.save(localLibrary);
    });

    const events = [
      ...knowledgeObject.pullEvents(),
      ...localLibrary.pullEvents(),
    ];
    await this.dependencies.publisher.publish(events, context);

    return {
      commandId: command.commandId,
      accepted: true,
    };
  }
}
