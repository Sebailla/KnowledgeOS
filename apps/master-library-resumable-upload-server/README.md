# @knowledgeos/master-library-resumable-upload-server

HTTP runtime for durable resumable uploads.

## Endpoints

- `POST /v1/master-library/upload-sessions`
- `PUT /v1/master-library/upload-sessions/:sessionId/chunks/:index`
- `GET /v1/master-library/upload-sessions/:sessionId`
- `POST /v1/master-library/upload-sessions/:sessionId/complete`
- `DELETE /v1/master-library/upload-sessions/:sessionId`
