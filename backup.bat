echo off
echo 'Generate backup file name'

set CUR_YYYY=%date:~10,4%
set CUR_MM=%date:~4,2%
set CUR_DD=%date:~7,2%
set CUR_HH=%time:~0,2%
if %CUR_HH% lss 10 (set CUR_HH=0%time:~1,1%)
set CUR_NN=%time:~3,2%
set CUR_SS=%time:~6,2%

set BACKUP_FILE=%CUR_YYYY%-%CUR_MM%-%CUR_DD%_%CUR_HH%-%CUR_NN%-%CUR_SS%.sql

echo 'Backup path: %BACKUP_FILE%'
echo 'Creating a backup ...'

set PGPASSWORD=%PG_PASS%
pg_dump -U my_user -d artworks > "%BACKUP_FILE%"

echo 'Backup successfully created: %BACKUP_FILE%'