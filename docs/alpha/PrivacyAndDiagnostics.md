# Privacy and Diagnostics

Diagnostics are disabled by default and require explicit evaluator consent.

Allowed diagnostic fields:

- application and protocol versions;
- platform and operating-system version;
- synchronization phase and queue sizes;
- error codes and operation durations;
- migration status;
- aggregate storage usage;
- import/export job states.

Prohibited fields:

- document content;
- annotations and prompts;
- authentication tokens and credentials;
- private file paths;
- personal identifiers not required for support.

The evaluator may inspect and delete a diagnostic package before sharing it.
