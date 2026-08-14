# Local OCR Runtime SBOM

The local Master Library Docker image packages only the following OCR runtime
components. The runtime has no OCR network client and performs no model download.

| Component | Pinned version | License | Purpose |
|---|---:|---|---|
| `node:22-alpine` | `sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32` | Node.js MIT; Alpine package licenses vary | Base image |
| `tesseract-ocr` | `5.5.2-r0` | Apache-2.0 | Local OCR executable |
| `tesseract-ocr-data-eng` | `5.5.2-r0` | Apache-2.0 | English language data |
| `tesseract-ocr-data-spa` | `5.5.2-r0` | Apache-2.0 | Spanish language data |
| `poppler-utils` | `25.12.0-r1` | GPL-2.0-or-later | Bounded PDF rasterization and page inspection |

The Dockerfile verifies the executable paths and both language packs during the
image build. At service startup, the local profile composes OCR only after the
same executable/language health check succeeds; otherwise inspection remains a
manual-entry fallback and emits only the redacted `local-ocr/unavailable` event.

OCR is deliberately local-only. Document bytes, extracted text, command stderr,
filesystem paths, and credentials are not sent to external services or exposed
in API responses.
