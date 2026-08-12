FROM node:26-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json turbo.json ./
COPY packages ./packages
COPY apps/sync-server ./apps/sync-server
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @knowledgeos/sync-server... build

FROM node:26-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
WORKDIR /app
COPY --from=build /workspace /app
USER node
EXPOSE 8080
CMD ["node", "apps/sync-server/dist/runtime.js"]
