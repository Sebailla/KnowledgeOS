import type {
  AcquisitionAccepted,
  CommandReceipt,
  RequestAcquisitionCommand,
} from "@knowledgeos/contracts";
import {
  Acquisition,
  DomainEventFactory,
  type AcquisitionRepository,
  type LocalLibraryRepository,
} from "@knowledgeos/domain";
import type {
  CommandHandler,
  ExecutionContext,
  UnitOfWork,
} from "@knowledgeos/kernel";
import { libraryNotFound, publicationNotFound } from "../errors.js";
import type { MasterCatalogReader } from "../ports/catalog.js";
import type { CommittedEventPublisher } from "../ports/event-publisher.js";
import type { LibraryIdentityService } from "../ports/library-identity.js";

export interface RequestAcquisitionDependencies {
  readonly acquisitions: AcquisitionRepository;
  readonly localLibraries: LocalLibraryRepository;
  readonly catalog: MasterCatalogReader;
  readonly identities: LibraryIdentityService;
  readonly events: DomainEventFactory;
  readonly unitOfWork: UnitOfWork;
  readonly publisher: CommittedEventPublisher;
}

export class RequestAcquisitionHandler
implements CommandHandler<RequestAcquisitionCommand> {
  public constructor(private readonly dependencies: RequestAcquisitionDependencies) {}

  async handle(
    command: RequestAcquisitionCommand,
    context: ExecutionContext,
  ): Promise<CommandReceipt & AcquisitionAccepted> {
    const localLibrary = await this.dependencies.localLibraries.get(
      command.payload.targetLocalLibraryId,
    );
    if (!localLibrary) throw libraryNotFound(command.payload.targetLocalLibraryId);

    const catalogRecord = await this.dependencies.catalog.get(
      command.payload.publicationId,
    );
    if (!catalogRecord) throw publicationNotFound(command.payload.publicationId);

    const acquisitionId = this.dependencies.identities.acquisitionId();
    const versionId = this.dependencies.identities.versionId();
    const event = this.dependencies.events.create(
      "acquisition.requested",
      acquisitionId,
      versionId,
      context.correlationId,
      {
        publicationId: command.payload.publicationId,
        targetLocalLibraryId: command.payload.targetLocalLibraryId,
      },
    );
    const acquisition = Acquisition.request(
      {
        id: acquisitionId,
        publicationId: command.payload.publicationId,
        requestedVersionId:
          command.payload.requestedVersionId ?? catalogRecord.versionId,
        targetLocalLibraryId: command.payload.targetLocalLibraryId,
        status: "requested",
        transferredBytes: 0,
      },
      event,
    );

    await this.dependencies.unitOfWork.run(async () => {
      await this.dependencies.acquisitions.save(acquisition);
    });
    await this.dependencies.publisher.publish(
      acquisition.pullEvents(),
      context,
    );

    return {
      commandId: command.commandId,
      accepted: true,
      acquisitionId,
    };
  }
}
