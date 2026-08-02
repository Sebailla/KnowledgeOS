# @knowledgeos/master-library-direct-streaming-server

Real Node HTTP server that streams authoritative publication files directly from the NAS filesystem.

## Improvements over the buffered runtime

- does not load full publications into memory;
- opens bounded file streams for byte ranges;
- preserves `HEAD`, `ETag`, `If-None-Match` and `206`;
- honors HTTP backpressure;
- validates catalog byte length before streaming.
