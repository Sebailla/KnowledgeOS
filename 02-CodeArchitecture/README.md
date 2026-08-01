# KnowledgeOS V5 Code Architecture

**Project:** KnowledgeOS  
**Section:** Code Architecture / Root  
**Document:** README  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

V5 maps the approved V4 architecture to the physical source repository.

## 2. Technology Boundary

- **Swift and SwiftUI:** macOS, iPhone and iPad applications.
- **TypeScript and Node.js:** KnowledgeOS Server, optional Web Application, shared wire contracts, code generation and tooling.
- **PostgreSQL:** Master Catalog persistence.
- **Container runtime:** NAS deployment.
- **CloudKit:** approved Apple Personal Knowledge synchronization profile.

The repository is a polyglot monorepo. `pnpm` and Turborepo coordinate TypeScript workspaces; Xcode and Swift Package Manager coordinate Apple code. Neither toolchain owns the other.

## 3. Physical Structure

```text
KnowledgeOS/
├── apps/
│   ├── server/
│   └── web/
├── apple/
│   ├── KnowledgeOS.xcworkspace/
│   ├── Apps/
│   │   ├── macOS/
│   │   ├── iOS/
│   │   └── iPadOS/
│   └── Packages/
├── packages/
│   ├── contracts/
│   ├── domain-types/
│   ├── client-sdk/
│   ├── plugin-sdk/
│   ├── observability/
│   ├── testing/
│   └── tooling/
├── services/
│   ├── api/
│   ├── workers/
│   ├── scheduler/
│   └── providers/
├── infrastructure/
├── deployment/
├── tools/
├── tests/
├── 00-Architecture/
├── 01-Implementation/
└── 02-CodeArchitecture/
```

## 4. Governing Rule

Code SHALL implement V4. V5 MAY refine physical packaging and language-specific interfaces, but SHALL NOT redefine identity, authority, acquisition, synchronization, UDM, DPM or Engine ownership.
