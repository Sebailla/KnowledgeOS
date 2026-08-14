FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS master-storage-build
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
# The Import Engine's metadata boundary is built independently for this image.
# Copy every workspace package manifest/source before installation so pnpm can
# resolve Import's workspace dependency graph from the frozen lockfile.
COPY packages ./packages
COPY apps/master-library-direct-streaming-server/package.json apps/master-library-direct-streaming-server/package.json
COPY apps/master-library-local-browser/package.json apps/master-library-local-browser/package.json
RUN corepack enable && pnpm install --frozen-lockfile \
  --filter @knowledgeos/master-library-direct-streaming-server... \
  --filter @knowledgeos/import... \
  --filter @knowledgeos/ocr...
COPY apps/master-library-direct-streaming-server apps/master-library-direct-streaming-server
COPY apps/master-library-local-browser apps/master-library-local-browser
COPY packages/master-library-local-development-auth packages/master-library-local-development-auth
RUN pnpm --filter @knowledgeos/contracts build \
 && pnpm --filter @knowledgeos/master-storage build \
 && pnpm --filter @knowledgeos/master-storage-node-stream build \
 && pnpm --filter @knowledgeos/master-library-local-development-auth build \
 && pnpm --filter @knowledgeos/master-library-local-browser build \
 && pnpm --filter @knowledgeos/import run build:metadata \
 && pnpm --filter @knowledgeos/ocr build \
 && pnpm --filter @knowledgeos/master-library-direct-streaming-server build

FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32
ARG TESSERACT_OCR_VERSION=5.5.2-r0
ARG POPPLER_UTILS_VERSION=25.12.0-r1
RUN apk add --no-cache \
  tesseract-ocr=${TESSERACT_OCR_VERSION} \
  tesseract-ocr-data-eng=${TESSERACT_OCR_VERSION} \
  tesseract-ocr-data-spa=${TESSERACT_OCR_VERSION} \
  poppler-utils=${POPPLER_UTILS_VERSION} \
 && test "$(tesseract --version | head -1)" = "tesseract ${TESSERACT_OCR_VERSION%-r*}" \
 && tesseract --list-langs | grep -Fx eng \
 && tesseract --list-langs | grep -Fx spa \
 && test -x /usr/bin/pdfinfo \
 && test -x /usr/bin/pdftoppm
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8081 MASTER_LIBRARY_FILES_ROOT=/var/lib/knowledgeos/master-library
WORKDIR /app
COPY deployment/runtime/master-library-protected-server.mjs /app/server.mjs
COPY deployment/runtime/master-library-local-browser-server.mjs /app/local-browser-server.mjs
COPY deployment/runtime/master-library-migrate.mjs /app/migrate.mjs
COPY deployment/runtime/master-library-fixture-seed.mjs /app/fixture-seed.mjs
COPY --from=master-storage-build /workspace/node_modules /app/workspace/node_modules
COPY --from=master-storage-build /workspace/packages/master-storage /app/workspace/packages/master-storage
COPY --from=master-storage-build /workspace/packages/master-storage-node-stream /app/workspace/packages/master-storage-node-stream
COPY --from=master-storage-build /workspace/apps/master-library-direct-streaming-server /app/workspace/apps/master-library-direct-streaming-server
COPY --from=master-storage-build /workspace/apps/master-library-local-browser /app/workspace/apps/master-library-local-browser
COPY --from=master-storage-build /workspace/packages/master-library-local-development-auth /app/workspace/packages/master-library-local-development-auth
COPY --from=master-storage-build /workspace/packages/master-library-streaming-server /app/workspace/packages/master-library-streaming-server
COPY --from=master-storage-build /workspace/packages/import/dist/metadata /app/workspace/packages/import/dist/metadata
COPY --from=master-storage-build /workspace/packages/import/node_modules /app/workspace/packages/import/node_modules
COPY --from=master-storage-build /workspace/packages/ocr/dist/tesseract /app/workspace/packages/ocr/dist/tesseract
COPY --from=master-storage-build /workspace/packages/contracts /app/workspace/packages/contracts
COPY --from=master-storage-build /workspace/packages/domain-types /app/workspace/packages/domain-types
RUN mkdir -p /var/lib/knowledgeos/master-library /var/lib/knowledgeos/operations && chown -R node:node /var/lib/knowledgeos /app
USER node
EXPOSE 8081
CMD ["node", "/app/server.mjs"]
