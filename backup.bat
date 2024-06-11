echo off
echo 'Generate backup file name'
set HH=%time:~0,2%
set MM=%time:~3,2%
SET SS=%time:~6,2%
SET MS=%time:~9,2%

set BACKUP_FILE=%date%-%HH%%MM%%SS%%MS%.sql

echo 'Backup path: %BACKUP_FILE%'
echo 'Creating a backup ...'

set PGPASSWORD=%PG_PASS%
pg_dump -U my_user -d artworks > "%BACKUP_FILE%"

echo 'Backup successfully created: %BACKUP_FILE%'