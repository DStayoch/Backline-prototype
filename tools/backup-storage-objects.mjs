import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const bucket = "job-files";
const projectUrl = String(process.env.BACKLINE_STORAGE_URL || "").replace(/\/$/, "");
const serviceRoleKey = String(process.env.BACKLINE_STORAGE_SERVICE_ROLE_KEY || "");
const backupDirectory = String(process.env.BACKLINE_STORAGE_BACKUP_DIR || "");

if (!projectUrl || !serviceRoleKey || !backupDirectory) {
  throw new Error("Set BACKLINE_STORAGE_URL, BACKLINE_STORAGE_SERVICE_ROLE_KEY, and BACKLINE_STORAGE_BACKUP_DIR before creating a Storage backup.");
}

function objectUrl(objectPath) {
  return `${projectUrl}/storage/v1/object/${bucket}/${objectPath.split("/").map(encodeURIComponent).join("/")}`;
}

function safeObjectPath(objectPath) {
  const normalized = String(objectPath || "").replace(/\\/g, "/");
  if (!normalized || normalized.startsWith("/") || normalized.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Unsafe Storage object path: ${objectPath}`);
  }
  return normalized;
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
  if (!response.ok) {
    throw new Error(`Storage request failed (${response.status}): ${await response.text()}`);
  }
  return response;
}

async function listObjects(prefix = "") {
  const objects = [];
  let offset = 0;
  while (true) {
    const response = await storageRequest(`${projectUrl}/storage/v1/object/list/${bucket}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: "name", order: "asc" } })
    });
    const page = await response.json();
    if (!Array.isArray(page) || page.length === 0) break;
    objects.push(...page);
    if (page.length < 1000) break;
    offset += page.length;
  }
  return objects;
}

async function collectObjectPaths(prefix = "", output = []) {
  const entries = await listObjects(prefix);
  for (const entry of entries) {
    const name = String(entry?.name || "");
    if (!name) continue;
    const objectPath = `${prefix}${name}`;
    if (!entry.id) {
      await collectObjectPaths(`${objectPath}/`, output);
      continue;
    }
    output.push({ path: safeObjectPath(objectPath), metadata: entry.metadata || {} });
  }
  return output;
}

const objects = await collectObjectPaths();
const manifest = {
  format: "backline-storage-backup",
  version: 1,
  createdAt: new Date().toISOString(),
  sourceProjectUrl: projectUrl,
  bucket,
  objects: []
};

for (const object of objects) {
  const response = await storageRequest(objectUrl(object.path));
  const bytes = Buffer.from(await response.arrayBuffer());
  const destination = path.join(backupDirectory, bucket, ...object.path.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  manifest.objects.push({
    path: object.path,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    contentType: response.headers.get("content-type") || object.metadata.mimetype || "application/octet-stream"
  });
  console.log(`Backed up ${object.path}`);
}

await mkdir(backupDirectory, { recursive: true });
await writeFile(path.join(backupDirectory, "backline-storage-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Storage backup complete: ${manifest.objects.length} object(s) saved to ${backupDirectory}`);
