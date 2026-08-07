# Import Source Command v2

**Project:** KnowledgeOS  
**Section:** Implementation / Import and Acquisition / 04-Contracts  
**Document:** ImportSourceCommand  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** macOS Core Host  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the versioned, path-free command that hands a transient macOS-staged source to the Core Host. This command ends at `ProcessingQueued`; it is not the durable import or registration contract.

## 2. Command Shape

```ts
type StagedImportRequestV2 = {
  contractVersion: 2;
  operationId: string;
  idempotencyKey: string;
  source: { kind: "staged-file"; capability: string };
  name: string;
  byteLength: number;
  sha256: string;
  mediaType?: string;
  extension?: string;
  runOCR?: boolean;
};
```

`source.capability` identifies an entry under the app-controlled staging root. It is opaque to callers and is not a Domain identity. The command MUST NOT carry a source path, source bytes, or text content.

## 3. Acceptance and Rejection

The Core Host accepts only `contractVersion: 2`. Before queueing, it validates the command shape, resolves the capability under its configured staging root, reads metadata, checks expiry, verifies that the source is a regular non-symlink file, opens it with no-follow semantics, and verifies its byte length and SHA-256 checksum from the opened descriptor.

| Condition | Result | Queue / ownership transfer |
|---|---|---|
| Missing, v1, or other unsupported version | `IMPORT_CONTRACT_VERSION_UNSUPPORTED` | No |
| `content`, `bytes`, or `path` supplied; malformed required fields | `INVALID_IMPORT_REQUEST` | No |
| Invalid capability; root escape; symlink; non-regular source; malformed or expired metadata; no-follow-open failure; length or checksum mismatch | `STAGED_SOURCE_REJECTED` | No |
| All validation succeeds | Processing lease and `ProcessingQueued` | Yes |

Rejected requests SHALL not read a source outside the staging root, queue processing, or create a lease.

## 4. Response and Lease

A successful command returns:

```ts
type QueuedStagedImport = {
  operationId: string;
  leaseId: string;
  state: "ProcessingQueued";
};
```

The corresponding processing lease is owned by `core-host` and binds the opaque capability to an open descriptor. The lease survives the immediate command only to allow the next processor to read the validated staged file. `import.release` accepts `leaseId`; release is idempotent, closes the descriptor, and deletes the staged entry.

`ProcessingQueued` MUST NOT claim durable source persistence, local registration, Local Library membership, parsing, reader/search creation, `Ready`, PDF/EPUB processing, or streaming IPC.

## 5. Compatibility and Observability

Version 1 is deliberately rejected rather than translated because it carried source content instead of a staged capability. A compatibility fixture is shared by the TypeScript contract and Swift bridge tests.

Logs and diagnostics MAY record stable error codes, operation IDs, lifecycle state, and safe validation categories. They MUST NOT record source bytes, absolute paths, or capabilities.

## 6. Traceability

- [Durable Import Pipeline](../02-TechnicalDesign/ImportPipeline.md)
- [Staging Area](../05-Persistence/StagingArea.md)
- `packages/contracts/src/import.ts`
- `apps/macos-core-host/src/router.ts`
- `apps/macos-core-host/src/stagedSourceResolver.ts`
- `packages/import/src/jobs/ImportJobManager.ts`
- `openspec/changes/durable-import/specs/staged-source-import-contract/spec.md`
