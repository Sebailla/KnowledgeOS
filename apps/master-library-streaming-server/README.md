# @knowledgeos/master-library-streaming-server

Real Node HTTP streaming runtime for authoritative Master Library content.

## Upload

`POST /v1/master-library/stream`

Metadata is supplied in `x-knowledgeos-*` headers and raw publication bytes form the request body.

## Download

`GET|HEAD /v1/master-library/publications/:publicationId/versions/:versionId/content`

Supports:

- `Content-Length`
- `ETag`
- `If-None-Match`
- `Accept-Ranges`
- single byte range
- backpressure-aware response writes
