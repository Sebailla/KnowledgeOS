FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-workspace.yaml tsconfig.base.json turbo.json ./
COPY packages ./packages
COPY apps/sync-server ./apps/sync-server
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @knowledgeos/sync-server... build
FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=8787
WORKDIR /app
RUN addgroup -S knowledgeos && adduser -S knowledgeos -G knowledgeos
COPY --from=build /workspace/apps/sync-server/dist ./apps/sync-server/dist
COPY --from=build /workspace/apps/sync-server/package.json ./apps/sync-server/package.json
COPY --from=build /workspace/packages ./packages
USER knowledgeos
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:8787/health || exit 1
CMD ["node","apps/sync-server/dist/index.js"]
