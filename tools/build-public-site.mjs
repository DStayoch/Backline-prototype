// Assembles public-site/app/ from the root app files so Cloudflare serves the
// same release that the tests checked. public-site/app/ is generated, never
// committed. Run by Cloudflare Workers Builds; see deployment-notes.md.
import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const appDir = process.env.BACKLINE_APP_OUT_DIR || "public-site/app";
const appFiles = ["index.html", "styles.css", "field-polish.css", "app.js", "manifest.webmanifest", "service-worker.js"];
const publicAppUrl = "https://backlineoffice.com/app/";

const supabaseUrl = String(process.env.BACKLINE_SUPABASE_URL || "").trim();
const anonKey = String(process.env.BACKLINE_SUPABASE_ANON_KEY || "").trim();
if (!supabaseUrl || !anonKey) {
  console.error("Missing BACKLINE_SUPABASE_URL or BACKLINE_SUPABASE_ANON_KEY build variable.");
  process.exit(1);
}
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(supabaseUrl)) {
  console.error("BACKLINE_SUPABASE_URL must look like https://<project>.supabase.co");
  process.exit(1);
}
if (/service_role|sb_secret_/i.test(anonKey)) {
  console.error("BACKLINE_SUPABASE_ANON_KEY looks like a secret key. Use the publishable/anon key.");
  process.exit(1);
}

await rm(appDir, { recursive: true, force: true });
await mkdir(appDir, { recursive: true });
for (const file of appFiles) {
  await cp(file, `${appDir}/${file}`);
}
await cp("assets", `${appDir}/assets`, { recursive: true });

await writeFile(`${appDir}/supabase-config.js`, `window.BACKLINE_SUPABASE_CONFIG = {
  environment: "production",
  url: ${JSON.stringify(supabaseUrl)},
  anonKey: ${JSON.stringify(anonKey)},
  publicAppUrl: ${JSON.stringify(publicAppUrl)}
};
(function () {
  if (document.querySelector('link[href^="field-polish.css"]')) return;
  var polish = document.createElement("link");
  polish.rel = "stylesheet";
  polish.href = "field-polish.css?v=20260624-flat-meta-labels";
  document.head.appendChild(polish);
})();
`);

console.log(`Built ${appDir} for ${publicAppUrl}`);
