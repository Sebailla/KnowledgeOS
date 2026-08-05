FROM node:22-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8081 MASTER_LIBRARY_FILES_ROOT=/var/lib/knowledgeos/master-library
WORKDIR /app
COPY deployment/runtime/master-library-server.mjs /app/server.mjs
RUN mkdir -p /var/lib/knowledgeos/master-library && chown -R node:node /var/lib/knowledgeos /app
USER node
EXPOSE 8081
CMD ["node", "/app/server.mjs"]
