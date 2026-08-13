FROM node:22-alpine AS master-storage-build
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/master-storage/package.json packages/master-storage/package.json
COPY packages/master-storage-node-stream/package.json packages/master-storage-node-stream/package.json
COPY apps/master-library-direct-streaming-server/package.json apps/master-library-direct-streaming-server/package.json
COPY apps/master-library-local-browser/package.json apps/master-library-local-browser/package.json
COPY packages/master-library-local-development-auth/package.json packages/master-library-local-development-auth/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/domain-types/package.json packages/domain-types/package.json
COPY packages/master-library-streaming-server/package.json packages/master-library-streaming-server/package.json
RUN corepack enable && pnpm install --frozen-lockfile --filter @knowledgeos/master-library-direct-streaming-server...
COPY packages/master-storage packages/master-storage
COPY packages/master-storage-node-stream packages/master-storage-node-stream
COPY packages/contracts packages/contracts
COPY packages/domain-types packages/domain-types
COPY packages/master-library-streaming-server packages/master-library-streaming-server
COPY apps/master-library-direct-streaming-server apps/master-library-direct-streaming-server
COPY apps/master-library-local-browser apps/master-library-local-browser
COPY packages/master-library-local-development-auth packages/master-library-local-development-auth
RUN pnpm --filter @knowledgeos/contracts build \
 && pnpm --filter @knowledgeos/master-storage build \
 && pnpm --filter @knowledgeos/master-storage-node-stream build \
 && pnpm --filter @knowledgeos/master-library-local-development-auth build \
 && pnpm --filter @knowledgeos/master-library-local-browser build \
 && pnpm --filter @knowledgeos/master-library-direct-streaming-server build

FROM node:22-alpine
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
COPY --from=master-storage-build /workspace/packages/contracts /app/workspace/packages/contracts
COPY --from=master-storage-build /workspace/packages/domain-types /app/workspace/packages/domain-types
RUN mkdir -p /var/lib/knowledgeos/master-library /var/lib/knowledgeos/operations && chown -R node:node /var/lib/knowledgeos /app
USER node
EXPOSE 8081
CMD ["node", "/app/server.mjs"]
