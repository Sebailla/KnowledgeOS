FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-workspace.yaml tsconfig.base.json turbo.json ./
COPY packages ./packages
COPY apps/master-library-direct-streaming-server ./apps/master-library-direct-streaming-server
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @knowledgeos/master-library-direct-streaming-server... build
FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=8790
WORKDIR /app
RUN addgroup -S knowledgeos && adduser -S knowledgeos -G knowledgeos
COPY --from=build /workspace/apps/master-library-direct-streaming-server/dist ./apps/master-library-direct-streaming-server/dist
COPY --from=build /workspace/apps/master-library-direct-streaming-server/package.json ./apps/master-library-direct-streaming-server/package.json
COPY --from=build /workspace/packages ./packages
USER knowledgeos
EXPOSE 8790
CMD ["node","apps/master-library-direct-streaming-server/dist/index.js"]
