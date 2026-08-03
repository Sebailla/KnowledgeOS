# @knowledgeos/master-library-server

Transport-neutral HTTP application for the Master Library.

## Initial endpoints

- `POST /v1/master-library/publications`
- `GET /v1/master-library/publications/:publicationId`
- `GET /v1/master-library/publications/:publicationId/versions`
- `GET /v1/master-library/publications/:publicationId/versions/:versionId/content`
- `GET /health/live`

Registration accepts Base64 content only for the initial executable boundary. Streaming upload replaces it in the next transport block.
