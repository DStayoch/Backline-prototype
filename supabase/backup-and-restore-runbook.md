# Backline backup and restore drill

This procedure protects Backline workspace records and uploaded files. Run the drill before launch and at least once every quarter after launch. Never test a restore against the production Supabase project.

## What is covered

- Backline's **Download data backup** is a quick JSON export of the currently loaded workspace records. It is useful as an owner-accessible emergency copy, but it is not a database rollback and does not contain uploaded file contents.
- Supabase database backups protect Postgres data, including the metadata for `job-files`.
- `tools/backup-storage-objects.mjs` creates a separate local copy of the actual private `job-files` objects and writes checksums to `backline-storage-manifest.json`.

Supabase database backups do not include Storage object contents. A complete recovery needs both the database backup and the Storage-object backup.

## Before the drill

1. In the production Supabase dashboard, open **Database > Backups**. Confirm a recent backup exists. Pro, Team, and Enterprise projects receive daily backups; free projects need a manual database dump kept off-site.
2. In Backline Settings, download a **data backup** and store it in an encrypted folder outside the repository.
3. Make an encrypted local folder such as `C:\Backline-backups\2026-09-02` that is excluded from cloud sharing unless that storage is approved for customer data.
4. Get the production project's URL and service-role key from Supabase. The service-role key bypasses RLS: use it only in this local command window, never in Backline source files, GitHub, or browser code.

## Create the Storage-object backup

In PowerShell on your private machine, set the values for the production project and run:

```powershell
$env:BACKLINE_STORAGE_URL = "https://YOUR-PRODUCTION-PROJECT.supabase.co"
$env:BACKLINE_STORAGE_SERVICE_ROLE_KEY = "YOUR-PRODUCTION-SERVICE-ROLE-KEY"
$env:BACKLINE_STORAGE_BACKUP_DIR = "C:\Backline-backups\2026-09-02"
node tools/backup-storage-objects.mjs
```

Record the final object count. Confirm the folder has `backline-storage-manifest.json` plus `job-files\...` contents. Keep that backup and the matching database backup together.

## Restore drill: use a disposable project

1. Create a new, disposable Supabase project named like `backline-restore-drill-20260902`. Do not put its URL into Backline, Supabase Auth, Stripe, or Cloudflare.
2. From the production project's **Database > Backups** page, use Supabase's **Restore to a new project** process for a backup captured before the drill. If that option is unavailable on the current plan, follow Supabase's documented CLI/database-backup restore procedure into the disposable project instead.
3. In the disposable project, confirm the `job-files` bucket and `public.job_files` metadata rows exist. The file rows can exist even though the actual objects have not been restored yet.
4. Change the environment values below to the *disposable project's* URL and service-role key. Keep the same local backup directory, then run:

```powershell
$env:BACKLINE_STORAGE_URL = "https://YOUR-RESTORE-DRILL-PROJECT.supabase.co"
$env:BACKLINE_STORAGE_SERVICE_ROLE_KEY = "YOUR-RESTORE-DRILL-SERVICE-ROLE-KEY"
$env:BACKLINE_STORAGE_BACKUP_DIR = "C:\Backline-backups\2026-09-02"
$env:BACKLINE_STORAGE_CONFIRM_RESTORE = "RESTORE_FILES_TO_TEST_PROJECT"
node tools/restore-storage-objects.mjs
```

5. In the disposable project's SQL Editor, compare the row count to the manifest count:

```sql
select count(*) as job_file_metadata from public.job_files;
select count(*) as stored_objects from storage.objects where bucket_id = 'job-files';
```

6. In **Storage > job-files**, open or download one restored image/PDF and compare it with the production copy. Record the date, database-backup timestamp, manifest object count, restored-object count, and the file you opened.
7. Delete the disposable project after the drill. Keep the written drill record, but never include keys or customer data in that record.

## Real incident response

1. Stop further destructive changes and preserve the latest Storage-object backup.
2. Choose a database restore point immediately before the incident. Restoring production causes downtime; use Supabase's dashboard confirmation and communicate the maintenance window.
3. Restore database data first, then restore the matching `job-files` archive only if files were lost. Do not use `BACKLINE_STORAGE_OVERWRITE=true` unless the incident commander has explicitly approved overwriting existing objects.
4. Verify workspace isolation, billing access, current job count, customer count, file count, one portal link, and one attachment before reopening Backline.
