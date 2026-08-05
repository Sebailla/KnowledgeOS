# KnowledgeOS Production Deployment

The authoritative Master Library runs in containers on the NAS. PostgreSQL and authoritative files use independent persistent volumes:

- `knowledgeos_postgres`
- `knowledgeos_master_files`

Create `secrets/postgres_password.txt` and `secrets/sync_token.txt`, copy `env.example` to `.env`, then run `scripts/deployment/start-production.sh`.
