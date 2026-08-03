# @knowledgeos/sync-local-production

Production composition for Master → Local synchronization.

Connects:

- Master HTTP range client;
- SQLite transfer descriptors and checkpoints;
- filesystem staging with fsync;
- priority scheduler;
- verified Local Library acquisition;
- content-addressed local storage.
