import assert from "node:assert/strict";
import test from "node:test";

import {
  AggregateRoot,
  AndSpecification,
  DomainInvariantError,
  DomainValidationError,
  EntityId,
  NotSpecification,
  OrSpecification,
  PredicateSpecification,
  ValidationCollector,
  ValueObject,
  failure,
  success,
  unwrap,
  type DomainEvent,
} from "../src/index.js";

class TestId extends EntityId {
  public static create(value: string): TestId {
    return new TestId(value);
  }
}

class Name extends ValueObject<{ readonly value: string }> {
  public static create(value: string): Name {
    return new Name({ value });
  }
}

class TestAggregate extends AggregateRoot<TestId> {
  public static create(id: TestId): TestAggregate {
    return new TestAggregate(id);
  }

  public rename(name: string): void {
    const event: DomainEvent = {
      eventId: `event:${this.version + 1}`,
      type: "renamed",
      aggregateId: this.id.value,
      aggregateVersion: this.version + 1,
      occurredAt: "2026-08-03T00:00:00.000Z",
      payload: { name },
      metadata: {},
    };

    this.record(event);
  }
}

test("typed identities compare by type and value", () => {
  assert.equal(
    TestId.create("object:1").equals(TestId.create("object:1")),
    true,
  );

  assert.equal(
    TestId.create("object:1").equals(TestId.create("object:2")),
    false,
  );
});

test("empty identities are rejected", () => {
  assert.throws(
    () => TestId.create("   "),
    DomainInvariantError,
  );
});

test("value objects compare structurally", () => {
  assert.equal(
    Name.create("KnowledgeOS").equals(Name.create("KnowledgeOS")),
    true,
  );
});

test("aggregate records versioned domain events", () => {
  const aggregate =
    TestAggregate.create(TestId.create("aggregate:1"));

  aggregate.rename("KnowledgeOS");

  assert.equal(aggregate.version, 1);
  assert.equal(aggregate.uncommittedEvents.length, 1);

  aggregate.clearUncommittedEvents();

  assert.equal(aggregate.uncommittedEvents.length, 0);
});

test("specifications compose deterministically", () => {
  const positive =
    new PredicateSpecification<number>((value) => value > 0);

  const even =
    new PredicateSpecification<number>((value) => value % 2 === 0);

  assert.equal(
    new AndSpecification(positive, even).isSatisfiedBy(4),
    true,
  );

  assert.equal(
    new OrSpecification(positive, even).isSatisfiedBy(-2),
    true,
  );

  assert.equal(
    new NotSpecification(positive).isSatisfiedBy(-1),
    true,
  );
});

test("validation collector groups domain issues", () => {
  const collector =
    new ValidationCollector()
      .require(false, "title", "is required")
      .require(false, "ownerId", "is required");

  assert.equal(collector.all.length, 2);

  assert.throws(
    () => collector.throwIfInvalid(),
    DomainValidationError,
  );
});

test("domain results unwrap success and throw failure", () => {
  assert.equal(unwrap(success(42)), 42);

  assert.throws(
    () => unwrap(failure(new Error("failed"))),
  );
});
