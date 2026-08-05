FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-workspace.yaml tsconfig.base.json turbo.json ./
COPY packages ./packages
COPY apps/local-library-production ./apps/local-library-production
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @knowledgeos/local-library-production... build
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S knowledgeos && adduser -S knowledgeos -G knowledgeos
COPY --from=build /workspace/apps/local-library-production/dist ./apps/local-library-production/dist
COPY --from=build /workspace/apps/local-library-production/package.json ./apps/local-library-production/package.json
COPY --from=build /workspace/packages ./packages
USER knowledgeos
CMD ["node","apps/local-library-production/dist/index.js"]
