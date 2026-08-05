# Recovery Exercises

Required Alpha exercises:

1. Restore PostgreSQL from a dated backup into an isolated volume.
2. Restore authoritative Master Library files into an isolated volume.
3. Start services and validate checksums before reconnecting clients.
4. Simulate temporary PostgreSQL unavailability and verify retry behavior.
5. Simulate temporary file-volume unavailability and verify no destructive writes occur.
6. Rebuild Search and Knowledge Graph from authoritative library state.
7. Record recovery point objective, recovery time objective and observed duration.

Do not run destructive exercises against the only production copy.
