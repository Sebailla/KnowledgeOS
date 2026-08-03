import assert from "node:assert/strict";
import test from "node:test";
import type {
  CorrelationId,
  EventId,
  IsoTimestamp,
  LocalLibraryId,
  OperationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import { DomainEventFactory, LocalLibrary } from "@knowledgeos/domain";
import {
  CancellationSource,
  FixedClock,
  InMemoryCommandBus,
  InMemoryQueryBus,
  MonotonicIdGenerator,
  PassthroughUnitOfWork,
  type ExecutionContext,
} from "@knowledgeos/kernel";
import {
  CollectingEventPublisher,
  GetLocalAvailabilityHandler,
  InMemoryKnowledgeObjectRepository,
  InMemoryLocalLibraryRepository,
  InMemoryPublicationVersionRepository,
  InMemorySourceItemRepository,
  KernelLibraryIdentityService,
  RegisterLocalSourceHandler,
} from "../src/index.js";

const clock = new FixedClock(new Date("2026-08-01T00:00:00.000Z"));
const ids = new MonotonicIdGenerator(clock, "test");
const context: ExecutionContext = {
  operationId: "operation:test" as OperationId,
  correlationId: "correlation:test" as CorrelationId,
  privacyClass: "publication",
  clock,
  cancellation: CancellationSource.none(),
  metadata: {},
};

function eventFactory(): DomainEventFactory {
  return new DomainEventFactory({
    eventId: () => ids.eventId() as EventId,
    now: () => clock.nowIso() as IsoTimestamp,
    contractVersion: "5.0.0" as never,
  });
}

test("register local source creates offline membership", async () => {
  const libraries = new InMemoryLocalLibraryRepository();
  const libraryId = "local-library:test" as LocalLibraryId;
  await libraries.save(LocalLibrary.rehydrate({ id: libraryId, name: "Local", memberships: [] }));
  const knowledgeObjects = new InMemoryKnowledgeObjectRepository();
  const sources = new InMemorySourceItemRepository();
  const publications = new InMemoryPublicationVersionRepository();
  const publisher = new CollectingEventPublisher();
  const handler = new RegisterLocalSourceHandler({
    knowledgeObjects,
    sources,
    publications,
    localLibraries: libraries,
    identities: new KernelLibraryIdentityService(ids),
    events: eventFactory(),
    unitOfWork: new PassthroughUnitOfWork(),
    publisher,
  });

  await handler.handle({
    type: "library.register-local-source",
    commandId: context.operationId,
    contractVersion: "5.0.0" as never,
    context: {} as never,
    payload: {
      localLibraryId: libraryId,
      sourceItemId: "source-item:test" as SourceItemId,
      contentFingerprint: "sha256:test",
      title: "Test Publication",
      mediaType: "application/pdf",
      byteLength: 100,
      sourceVersionId: "version:source" as VersionId,
    },
  }, context);

  const saved = await libraries.get(libraryId);
  const membership = saved?.listMemberships()[0];
  assert.ok(membership);
  const availability = await new GetLocalAvailabilityHandler(libraries).handle({
    type: "library.get-local-availability",
    queryId: context.operationId,
    contractVersion: "5.0.0" as never,
    context: {} as never,
    parameters: { localLibraryId: libraryId, knowledgeObjectId: membership.knowledgeObjectId },
  }, context);
  assert.equal(availability.availability.state, "local-available");
  assert.equal(availability.availability.readableOffline, true);
  assert.equal(publisher.events.length, 2);
});
