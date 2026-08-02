# @knowledgeos/sync-master-http

HTTP byte-range client for Master Library acquisition.

Validates:

- `HEAD`;
- `Content-Length`;
- `ETag`;
- `Content-Type`;
- `206 Partial Content`;
- `Content-Range`;
- exact returned byte length.
