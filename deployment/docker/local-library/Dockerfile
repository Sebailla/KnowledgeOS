FROM node:22-alpine
ENV NODE_ENV=production LOCAL_LIBRARY_ROOT=/var/lib/knowledgeos/local-library
WORKDIR /app
COPY deployment/runtime/local-library-maintenance.mjs /app/maintenance.mjs
RUN mkdir -p /var/lib/knowledgeos/local-library && chown -R node:node /var/lib/knowledgeos /app
USER node
CMD ["node", "/app/maintenance.mjs"]
