import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const index = readFileSync("index.html", "utf8");
const app = readFileSync("app.js", "utf8");
const manifest = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
const serviceWorker = readFileSync("service-worker.js", "utf8");
const server = readFileSync("server.js", "utf8");

function pngSize(path) {
  const bytes = readFileSync(path);
  assert.equal(bytes.toString("ascii", 1, 4), "PNG", `${path} should be a PNG file.`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

assert.match(index, /<link rel="manifest" href="manifest\.webmanifest">/);
assert.match(index, /<meta name="theme-color" content="#162234">/);
assert.match(index, /<meta name="apple-mobile-web-app-capable" content="yes">/);

assert.equal(manifest.name, "Backline");
assert.equal(manifest.short_name, "Backline");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.scope, "./");
assert.equal(manifest.start_url, "./?source=pwa");
assert.equal(manifest.theme_color, "#162234");
assert.ok(manifest.icons.some((icon) => icon.src === "assets/backline-pwa-192.png" && icon.sizes === "192x192"));
assert.ok(manifest.icons.some((icon) => icon.src === "assets/backline-pwa-512.png" && icon.sizes === "512x512" && icon.purpose.includes("maskable")));
assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === "./?source=pwa#inbox"));
assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === "./?source=pwa#schedule"));

assert.deepEqual(pngSize("assets/backline-pwa-192.png"), { width: 192, height: 192 });
assert.deepEqual(pngSize("assets/backline-pwa-512.png"), { width: 512, height: 512 });

assert.match(app, /function registerBacklineServiceWorker\(\)/);
assert.match(app, /navigator\.serviceWorker\s+\.register\("\.\/service-worker\.js\?v=20260826-job-action-state", \{ scope: "\.\/" \}\)/);
assert.match(app, /#\(dashboard\|schedule\|inbox\|money\|followups\|communications\|jobsdb\|customers\|team\|activity\|insights\|creator\)/);
assert.match(app, /activateView\(viewMatch\[1\]\)/);
assert.match(app, /const DATABASE_VERSION = 7/);
assert.match(app, /const SECURE_OFFLINE_SNAPSHOT_STORE = "secureOfflineSnapshots"/);
assert.match(app, /const OFFLINE_UNLOCK_PROFILE_STORE = "offlineUnlockProfiles"/);
assert.match(app, /async function saveSecureOfflineSnapshot/);
assert.match(app, /async function restoreSecureOfflineSnapshot/);
assert.match(app, /async function purgeLegacyPlainOfflineSnapshots/);
assert.match(app, /async function syncPendingOfflineChanges/);
assert.match(app, /async function unlockOfflineWorkspace/);
assert.match(app, /Never retain a readable workspace snapshot/);
assert.doesNotMatch(app, /writeStoreRecord\(db, SECURE_OFFLINE_SNAPSHOT_STORE/);
assert.match(app, /Offline - saved to this device; sync pending/);
assert.match(app, /window\.addEventListener\("online"/);

assert.match(serviceWorker, /const BACKLINE_CACHE = "backline-pwa-20260826-22"/);
assert.match(serviceWorker, /"\.\/manifest\.webmanifest"/);
assert.match(serviceWorker, /"\.\/assets\/backline-pwa-192\.png"/);
assert.match(serviceWorker, /"\.\/assets\/backline-pwa-512\.png"/);
assert.match(serviceWorker, /self\.addEventListener\("install"/);
assert.match(serviceWorker, /self\.addEventListener\("activate"/);
assert.match(serviceWorker, /self\.addEventListener\("fetch"/);
assert.match(serviceWorker, /request\.mode === "navigate"/);

assert.match(server, /"\.webmanifest": "application\/manifest\+json; charset=utf-8"/);

console.log("PWA readiness contracts passed.");
