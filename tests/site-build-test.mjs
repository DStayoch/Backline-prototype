import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Runs the real Cloudflare build script (tools/build-public-site.mjs) into a
// temp folder with fake production values and checks what would be deployed.
const rootFiles = ["index.html", "styles.css", "field-polish.css", "app.js", "manifest.webmanifest", "service-worker.js"];
const fakeProductionUrl = "https://production-example.supabase.co";
const fakeProductionAnonKey = "production-anon-key-placeholder";
const fakePublicAppUrl = "https://backlineoffice.com/app/";

const tempRoot = await mkdtemp(join(tmpdir(), "backline-site-build-"));
const siteDir = join(tempRoot, "app");

function runBuild(env) {
  return spawnSync(process.execPath, ["tools/build-public-site.mjs"], {
    env: { ...process.env, BACKLINE_APP_OUT_DIR: siteDir, ...env },
    encoding: "utf8"
  });
}

try {
  const missing = runBuild({ BACKLINE_SUPABASE_URL: "", BACKLINE_SUPABASE_ANON_KEY: "" });
  assert.notEqual(missing.status, 0, "The site build must fail when Supabase build variables are missing.");
  const secretKey = runBuild({ BACKLINE_SUPABASE_URL: fakeProductionUrl, BACKLINE_SUPABASE_ANON_KEY: "sb_secret_example" });
  assert.notEqual(secretKey.status, 0, "The site build must refuse a secret Supabase key.");

  const build = runBuild({ BACKLINE_SUPABASE_URL: fakeProductionUrl, BACKLINE_SUPABASE_ANON_KEY: fakeProductionAnonKey });
  assert.equal(build.status, 0, `The site build should succeed: ${build.stderr}`);

  for (const file of [...rootFiles, "supabase-config.js"]) {
    assert.ok(existsSync(join(siteDir, file)), `Site build should include ${file}.`);
  }
  for (const file of rootFiles) {
    const source = (await readFile(file, "utf8")).replace(/\r\n/g, "\n");
    const built = (await readFile(join(siteDir, file), "utf8")).replace(/\r\n/g, "\n");
    assert.equal(built, source, `Built ${file} must match the tested root ${file}.`);
  }

  for (const asset of [
    "assets/backline-icon-transparent.png",
    "assets/backline-pwa-192.png",
    "assets/backline-pwa-512.png",
    "assets/backline-wordmark.png",
    "assets/backline-wordmark-dark.png",
    "assets/backline-full-logo-transparent.png"
  ]) {
    assert.ok(existsSync(join(siteDir, asset)), `Site build should include ${asset}.`);
  }

  for (const excluded of [
    "supabase-config.local.example.js",
    "supabase-config.production.example.js",
    "supabase-schema.sql",
    "production-launch-checklist.md",
    "tools",
    "tests",
    ".github"
  ]) {
    assert.equal(existsSync(join(siteDir, excluded)), false, `Site build should not include ${excluded}.`);
  }

  const index = await readFile(join(siteDir, "index.html"), "utf8");
  const config = await readFile(join(siteDir, "supabase-config.js"), "utf8");
  const app = await readFile(join(siteDir, "app.js"), "utf8");
  const manifest = await readFile(join(siteDir, "manifest.webmanifest"), "utf8");
  const serviceWorker = await readFile(join(siteDir, "service-worker.js"), "utf8");

  assert.match(index, /<script src="supabase-config\.js"><\/script>/, "Built index should load generated Supabase config.");
  assert.match(index, /<script src="app\.js\?v=/, "Built index should load the cache-tagged app bundle.");
  assert.match(index, /<link rel="manifest" href="manifest\.webmanifest">/, "Built index should expose the PWA manifest.");
  assert.match(index, /<meta name="theme-color" content="#162234">/, "Built index should set the install theme color.");
  assert.match(index, /assets\/backline-icon-transparent\.png/, "Built index should reference included favicon asset.");
  assert.match(manifest, /"display":\s*"standalone"/, "PWA manifest should open Backline as a standalone app.");
  assert.match(manifest, /assets\/backline-pwa-192\.png/, "PWA manifest should include the 192px icon.");
  assert.match(manifest, /assets\/backline-pwa-512\.png/, "PWA manifest should include the 512px icon.");
  assert.match(serviceWorker, /const BACKLINE_CACHE = "backline-pwa-/, "Service worker should version its cache.");
  assert.match(serviceWorker, /self\.addEventListener\("fetch"/, "Service worker should handle offline fetch fallback.");
  assert.match(config, /environment:\s*"production"/, "Generated config should identify production.");
  assert.match(config, /field-polish\.css\?v=20260624-flat-meta-labels/, "Generated config should load the field polish stylesheet.");
  assert.match(config, new RegExp(fakeProductionUrl.replace(/\./g, "\\.")), "Generated config should include production Supabase URL.");
  assert.match(config, new RegExp(fakeProductionAnonKey), "Generated config should include production Supabase anon key.");
  assert.match(config, new RegExp(fakePublicAppUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "Generated config should include hosted Backline app URL.");
  assert.doesNotMatch(config, /YOUR-PRODUCTION-PROJECT|YOUR-PROJECT|uwgklcnwjsmmwndoqdam|sb_publishable_/i, "Generated config should not contain placeholders or development values.");
  assert.match(app, /warnIfUnsafeProductionCustomerLink/, "Artifact app should include production customer-link safety warning.");
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

console.log("Site build test passed.");
