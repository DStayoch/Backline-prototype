import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Cloudflare serves public-site/app while the direct app host serves the root files.
// Keep both routes on the same release so a user cannot receive an older mobile app.
const sharedFiles = [
  "index.html",
  "app.js",
  "styles.css",
  "field-polish.css",
  "manifest.webmanifest",
  "service-worker.js"
];

for (const file of sharedFiles) {
  const source = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const deployedArtifact = readFileSync(`public-site/app/${file}`, "utf8").replace(/\r\n/g, "\n");
  assert.equal(
    deployedArtifact,
    source,
    `public-site/app/${file} is out of sync with ${file}. Update both release paths before deploying.`
  );
}

console.log("Deployment artifact parity passed.");
