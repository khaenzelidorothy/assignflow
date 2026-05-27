#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$TIMESTAMP"

mkdir -p $BACKUP_DIR

echo "Backing up database..."
docker-compose exec postgres pg_dump -U assignflow assignflow > "$BACKUP_DIR/database.sql"

echo "Backup saved to $BACKUP_DIR"
