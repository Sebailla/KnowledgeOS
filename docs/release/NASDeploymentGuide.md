# NAS Deployment Guide

Use `deployment/production/compose.yaml`. PostgreSQL data and authoritative library files use independent volumes. Validate `.env`, start with `scripts/deployment/start-production.sh`, verify with `scripts/deployment/validate-production.sh`, and schedule `backup-production.sh`. Restoration must be tested before promotion to stable.
