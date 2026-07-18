

# Master Library Unit Tests

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Testing

**Document:** Unit Tests

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the unit testing strategy for every module of the KnowledgeOS Master Library.

Unit Tests verify the correctness of the smallest independently testable units of behavior.

They provide the first automated validation layer and are the primary mechanism for preventing regressions.

---

# 2. Scope

Unit Tests apply to:

* Domain Models;
* Value Objects;
* Aggregates;
* Services;
* Application Commands;
* Queries;
* Validators;
* Mappers;
* Serializers;
* Parsers;
* Repositories (behavior through abstractions);
* Utility classes;
* State machines;
* Calculations.

Infrastructure integration is outside the scope of Unit Tests.

---

# 3. Objectives

Unit Tests aim to verify:

* correctness;
* determinism;
* business rules;
* edge cases;
* boundary conditions;
* failure handling;
* invariant preservation;
* idempotency.

---

# 4. Principles

Every Unit Test shall be:

* deterministic;
* isolated;
* repeatable;
* independent;
* automated;
* fast;
* observable.

No Unit Test shall require:

* internet access;
* server availability;
* filesystem mutation outside controlled temporary resources;
* shared databases;
* external AI providers.

---

# 5. Unit Definition

A unit is the smallest architectural element that can be validated independently.

Examples include:

* Value Object;
* Aggregate behavior;
* Domain Service;
* Validator;
* Parser;
* Mapper;
* Policy;
* Strategy;
* Formatter;
* State transition.

---

# 6. Test Naming

Test names shall describe behavior.

Preferred format:

```text
should_<expected_behavior>_when_<condition>
```

Example:

```text
should_reject_invalid_checksum_when_length_is_incorrect
```

Names shall describe behavior rather than implementation.

---

# 7. Test Structure

Every Unit Test follows:

```text
Arrange

↓

Act

↓

Assert
```

Additional cleanup shall be minimal.

---

# 8. One Assertion Rule

A test should verify one logical behavior.

Multiple assertions are acceptable only when validating one coherent outcome.

Large scenario tests belong in higher testing levels.

---

# 9. Test Independence

Each test creates its own state.

Tests shall never depend on:

* execution order;
* previous tests;
* static mutable state;
* shared caches.

---

# 10. Deterministic Inputs

Unit Tests shall avoid nondeterministic inputs.

Examples requiring control:

* current time;
* UUID generation;
* random numbers;
* filesystem ordering;
* locale;
* timezone.

These dependencies shall be injectable.

---

# 11. Domain Testing

Domain tests verify:

* invariants;
* business rules;
* state transitions;
* validation;
* identity;
* relationships.

Domain behavior shall be tested independently of persistence.

---

# 12. Value Objects

Every Value Object shall validate:

* creation;
* equality;
* normalization;
* validation;
* serialization;
* immutability.

---

# 13. Aggregates

Aggregate tests verify:

* valid creation;
* command execution;
* invariant preservation;
* invalid command rejection;
* emitted events;
* state transitions.

---

# 14. Domain Services

Domain Services verify:

* deterministic output;
* rule evaluation;
* calculations;
* conflict detection;
* decision policies.

---

# 15. Validators

Every validator shall test:

* valid input;
* invalid input;
* null values;
* empty values;
* maximum values;
* minimum values;
* malformed input.

---

# 16. State Machines

State machine tests validate:

* legal transitions;
* illegal transitions;
* terminal states;
* restart behavior;
* idempotent transitions.

---

# 17. Identity Rules

Identity tests verify:

* uniqueness;
* equality;
* serialization;
* comparison;
* invalid identifiers.

Identity behavior shall never depend on storage paths.

---

# 18. Parser Tests

Parsers shall test:

* valid documents;
* malformed documents;
* empty documents;
* unsupported versions;
* invalid encoding;
* unexpected structures.

Malformed input shall never crash the parser.

---

# 19. Serializer Tests

Serializers verify:

* round-trip consistency;
* optional fields;
* missing fields;
* unknown fields;
* version compatibility.

---

# 20. Mapper Tests

Mappers verify:

* complete mapping;
* missing values;
* null handling;
* invalid values;
* version differences.

---

# 21. Command Tests

Application Commands verify:

* validation;
* execution;
* emitted events;
* resulting state;
* rejection conditions.

---

# 22. Query Tests

Queries verify:

* filtering;
* ordering;
* pagination logic;
* projection mapping;
* invalid parameters.

---

# 23. Policy Tests

Policies verify:

* accepted cases;
* rejected cases;
* conflicting rules;
* precedence.

---

# 24. Strategy Tests

Strategies verify:

* selection;
* execution;
* fallback behavior;
* unsupported inputs.

---

# 25. Utility Tests

Utility functions verify:

* correctness;
* limits;
* malformed input;
* performance assumptions.

---

# 26. Error Tests

Every public unit shall test failure scenarios.

Failures shall produce deterministic error classifications.

---

# 27. Exception Testing

Tests verify:

* expected exception;
* message when appropriate;
* error classification;
* state preservation.

---

# 28. Boundary Testing

Boundary cases include:

* minimum values;
* maximum values;
* empty collections;
* single items;
* large collections.

---

# 29. Nullability

Where null values are supported or rejected, explicit tests shall exist.

---

# 30. Immutability

Immutable types shall verify that operations never modify existing instances.

---

# 31. Idempotency

Repeated execution shall produce identical results when appropriate.

---

# 32. Floating Point

Floating-point calculations shall use explicit tolerances.

Exact comparison is prohibited where mathematically inappropriate.

---

# 33. Locale

Formatting behavior shall verify multiple locales where supported.

---

# 34. Time

Time-dependent behavior shall use injected clocks.

System time shall never be called directly during testing.

---

# 35. Randomness

Random behavior shall use deterministic seeds.

---

# 36. Fixtures

Fixtures shall be:

* minimal;
* reusable;
* readable;
* immutable where practical.

---

# 37. Test Data Builders

Complex objects should use builders rather than large inline constructors.

---

# 38. Mock Usage

Mocks are permitted only for architectural boundaries.

Business logic shall not be mocked.

---

# 39. Fake Implementations

Prefer fakes over mocks when realistic behavior improves validation.

---

# 40. Assertions

Assertions shall verify observable behavior rather than implementation details.

---

# 41. Snapshot Testing

Snapshot testing may be used only for deterministic serialized outputs.

Snapshots shall not replace behavioral assertions.

---

# 42. Code Coverage

Coverage shall prioritize:

* critical logic;
* high-risk components;
* synchronization rules;
* recovery rules.

Coverage percentage alone is insufficient.

---

# 43. Regression Tests

Every resolved defect shall generate a permanent Unit Test whenever applicable.

---

# 44. Performance Expectations

Unit Tests should execute within milliseconds.

Slow tests belong to higher testing levels.

---

# 45. Parallel Execution

Unit Tests shall support parallel execution.

Hidden shared state is prohibited.

---

# 46. Logging

Logging output shall not normally be asserted unless it is contractual behavior.

---

# 47. Test Review

Every new architectural capability shall include corresponding Unit Tests during code review.

---

# 48. Anti-Patterns

The following are prohibited:

* sleeping to wait for behavior;
* depending on execution order;
* real network calls;
* shared mutable fixtures;
* filesystem dependencies without isolation;
* nondeterministic assertions;
* hidden retries.

---

# 49. Required Coverage

Every module shall include Unit Tests for:

* successful execution;
* validation failures;
* boundary conditions;
* exceptional conditions;
* invariant preservation.

---

# 50. Unit Test Invariants

The following invariants are mandatory:

* Unit Tests are deterministic;
* Unit Tests are isolated;
* business rules are never mocked;
* failures are reproducible;
* architectural boundaries are respected;
* behavior is validated instead of implementation details;
* every regression is permanently covered;
* tests remain fast enough for continuous execution.

---

# 51. Related Documents

* `README.md`
* `TestStrategy.md`
* `IntegrationTests.md`
* `ContractTests.md`
* `RecoveryTests.md`
* `PerformanceTests.md`

---

# 52. Status

**Approved**

The Unit Testing strategy is frozen as the foundational validation layer of the KnowledgeOS Master Library.

Every architectural component shall demonstrate deterministic, isolated and reproducible behavior through automated unit testing before progressing to higher validation levels.
