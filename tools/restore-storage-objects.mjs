import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const bucket = "job-files";
const projectUrl = String(process.env.BACKLINE_STORAGE_URL || "").replace(/\/$/, "");
const serviceRoleKey = String(process.env.BACKLINE_STORAGE_SERVICE_ROLE_KEY || "");
const backupDirectory = String(process.env.BACKLINE_STORAGE_BACKUP_DIR || "");
const confirmation = String(process.env.BACKLINE_STORAGE_CONFIRM_RESTORE || "");
const overwrite = String(process.env.BACKLINE_STORAGE_OVERWRITE || "").toLowerCase() === "true";

if (!projectUrl || !serviceRoleKey || !backupDirectory) {
  throw new Error("Set BACKLINE_STORAGE_URL, BACKLINE_STORAGE_SERVICE_ROLE_KEY, and BACKLINE_STORAGE_BACKUP_DIR before restoring Storage objects.");
}
if (confirmation !== "RESTORE_FILES_TO_TEST_PROJECT") {
  throw new Error("Set BACKLINE_STORAGE_CONFIRM_RESTORE=RESTORE_FILES_TO_TEST_PROJECT. Never restore files into the production project during a drill.");
}

function objectUrl(objectPath) {
  return `${projectUrl}/storage/v1/object/${bucket}/${objectPath.split("/").map(encodeURIComponent).join("/")}`;
}

async function storageRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {})
    }
  });
  return response;
}

const manifestPath = path.join(backupDirectory, "backline-storage-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (manifest.format !== "backline-storage-backup" || manifest.bucket !== bucket || !Array.isArray(manifest.objects)) {
  throw new Error("This directory does not contain a valid Backline job-files backup manifest.");
}

let restored = 0;
for (const object of manifest.objects) {
  const objectPath = String(object?.path || "");
  if (!objectPath || objectPath.startsWith("/") || objectPath.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Unsafe Storage object path in manifest: ${objectPath}`);
  }
  const bytes = await readFile(path.join(backupDirectory, bucket, ...objectPath.split("/")));
  const checksum = createHash("sha256").update(bytes).digest("hex");
  if (checksum !== object.sha256) throw new Error(`Checksum mismatch for ${objectPath}. Stop and recreate the backup.`);

  const response = await storageRequest(objectUrl(objectPath), {
    method: "POST",
    headers: {
      "Content-Type": object.contentType || "application/octet-stream",
      "x-upsert": String(overwrite)
    },
    body: bytes
  });
  if (!response.ok) throw new Error(`Could not restore ${objectPath} (${response.status}): ${await response.text()}`);
  restored += 1;
  console.log(`Restored ${objectPath}`);
}

console.log(`Storage restore complete: ${restored} object(s) restored to ${projectUrl}. Verify object count and open one file before closing the drill.`);
