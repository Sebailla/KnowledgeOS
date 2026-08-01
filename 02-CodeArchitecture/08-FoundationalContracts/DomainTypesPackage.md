# Domain Types Package

## Purpose

`@knowledgeos/domain-types` contains immutable value types that carry identity, authority, privacy, provenance, time, versioning and stable errors.

## Rules

- No runtime dependency is permitted.
- No repository or framework type is permitted.
- Branded types provide compile-time nominal identity.
- Validation helpers may reject malformed primitive values.
- Types must serialize into language-neutral primitives.
- Swift generation consumes schemas derived from these types, not TypeScript-specific implementation details.
