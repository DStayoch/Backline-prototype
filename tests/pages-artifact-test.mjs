import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const rootFiles = ["index.html", "backline-home.html", "styles.css", "field-polish.css", "app.js", "manifest.webmanifest", "service-worker.js"];
const fakeProductionUrl = "https://production-example.supabase.co";
const fakeProductionAnonKey = "production-anon-key-placeholder";
const fakePublicAppUrl = "https://backlineoffice.com/app/";

const siteDir = await mkdtemp(join(tmpdir(), "backline-pages-artifact-"));

try {
  for (const file of rootFiles) {
    await cp(file, join(siteDir, file));
  }
  await cp("assets", join(siteDir, "assets"), { recursive: true });
  await writeFile(join(siteDir, "supabase-config.js"), `window.BACKLINE_SUPABASE_CONFIG = {
  environment: "production",
  url: "${fakeProductionUrl}",
  anonKey: "${fakeProductionAnonKey}",
  publicAppUrl: "${fakePublicAppUrl}"
};
(function () {
  if (document.querySelector('link[href^="field-polish.css"]')) return;
  var polish = document.createElement("link");
  polish.rel = "stylesheet";
  polish.href = "field-polish.css?v=20260624-flat-meta-labels";
  document.head.appendChild(polish);
})();
`);

  for (const file of [...rootFiles, "supabase-config.js"]) {
    assert.ok(existsSync(join(siteDir, file)), `Pages artifact should include ${file}.`);
  }

  for (const asset of [
    "assets/backline-icon-transparent.png",
    "assets/backline-pwa-192.png",
    "assets/backline-pwa-512.png",
    "assets/backline-wordmark.png",
    "assets/backline-wordmark-dark.png",
    "assets/backline-full-logo-transparent.png"
  ]) {
    assert.ok(existsSync(join(siteDir, asset)), `Pages artifact should include ${asset}.`);
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
    assert.equal(existsSync(join(siteDir, excluded)), false, `Pages artifact should not include ${excluded}.`);
  }

  const index = await readFile(join(siteDir, "index.html"), "utf8");
  const config = await readFile(join(siteDir, "supabase-config.js"), "utf8");
  const app = await readFile(join(siteDir, "app.js"), "utf8");
  const manifest = await readFile(join(siteDir, "manifest.webmanifest"), "utf8");
  const serviceWorker = await readFile(join(siteDir, "service-worker.js"), "utf8");

  assert.match(index, /<script src="supabase-config\.js"><\/script>/, "Artifact index should load generated Supabase config.");
  assert.match(index, /<script src="app\.js\?v=/, "Artifact index should load the cache-tagged app bundle.");
  assert.match(index, /<link rel="manifest" href="manifest\.webmanifest">/, "Artifact index should expose the PWA manifest.");
  assert.match(index, /<meta name="theme-color" content="#162234">/, "Artifact index should set the install theme color.");
  assert.match(index, /assets\/backline-icon-transparent\.png/, "Artifact index should reference included favicon asset.");
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
  await rm(siteDir, { recursive: true, force: true });
}

console.log("Pages artifact dry-run passed.");
