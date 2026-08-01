# Swift Generation Boundary

Swift models SHALL be generated from language-neutral schemas emitted from `@knowledgeos/contracts`.

Generated Swift code may include:

- `Codable` value types;
- tagged enums;
- request and response DTOs;
- error envelopes;
- contract-version constants.

Generated Swift code SHALL NOT include:

- TypeScript branded-type machinery;
- Node.js APIs;
- repositories;
- business services;
- provider implementations.

Swift-specific convenience wrappers remain handwritten outside generated sources.
