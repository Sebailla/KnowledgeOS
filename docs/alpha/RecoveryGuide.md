# Closed Alpha Recovery Guide

## Client recovery

1. Stop the application.
2. Preserve a copy of diagnostics and local state.
3. Restore the latest known-good backup.
4. Restart services before clients.
5. Confirm checkpoint progression and library counts.

## NAS recovery

1. Stop production services.
2. Verify the PostgreSQL and authoritative-files volumes independently.
3. Restore PostgreSQL using `restore-production.sh`.
4. Restore authoritative files from the matching backup set.
5. Validate checksums and start services.
6. Run the E2E convergence test.
