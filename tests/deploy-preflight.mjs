import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const [
  gitignore,
  siteBuildScript,
  wranglerConfig,
  siteHeaders,
  readme,
  launchChecklist,
  betaDeploymentGuide,
  supabaseProductionSetup,
  localConfigExample,
  productionConfigExample,
  genericConfigExample,
  packageJson,
  siteBuildTest,
  css,
  fieldPolish
] = await Promise.all([
  readFile(".gitignore", "utf8"),
  readFile("tools/build-public-site.mjs", "utf8"),
  readFile("wrangler.jsonc", "utf8"),
  readFile("public-site/_headers", "utf8"),
  readFile("README.md", "utf8"),
  readFile("production-launch-checklist.md", "utf8"),
  readFile("beta-deployment-guide.md", "utf8"),
  readFile("supabase-production-setup.md", "utf8"),
  readFile("supabase-config.local.example.js", "utf8"),
  readFile("supabase-config.production.example.js", "utf8"),
  readFile("supabase-config.example.js", "utf8"),
  readFile("package.json", "utf8"),
  readFile("tests/site-build-test.mjs", "utf8"),
  readFile("styles.css", "utf8"),
  readFile("field-polish.css", "utf8")
]);

assert.match(gitignore, /^supabase-config\.js$/m, "Local Supabase config must stay ignored.");
assert.match(gitignore, /^public-site\/app\/$/m, "The generated Cloudflare app copy should not be committed.");
assert.equal(existsSync(".github/workflows/pages.yml"), false, "Cloudflare is the only production host; GitHub Pages must stay retired.");

assert.match(siteBuildScript, /BACKLINE_SUPABASE_URL/, "Cloudflare build must read the production Supabase URL from build variables.");
assert.match(siteBuildScript, /BACKLINE_SUPABASE_ANON_KEY/, "Cloudflare build must read the production Supabase anon key from build variables.");
assert.match(siteBuildScript, /const publicAppUrl = "https:\/\/backlineoffice\.com\/app\/"/, "Cloudflare build must set the hosted app URL for auth callbacks.");
assert.match(packageJson, /"cloudflare:build":\s*"[^"]*npm test && npm run build:site"/, "Cloudflare build must run the full test suite before building the site.");
assert.match(wranglerConfig, /"directory":\s*"\.\/public-site"/, "Cloudflare should upload only the public site folder.");
assert.match(siteHeaders, /X-Frame-Options: DENY/, "The site must refuse to be framed.");
assert.match(siteHeaders, /frame-ancestors 'none'/, "The site CSP must block framing.");
assert.match(siteHeaders, /\/app\/\*\r?\n\s+Content-Security-Policy(-Report-Only)?: default-src 'self'/, "The app must ship a content security policy.");
assert.match(fieldPolish, /html\[data-theme="dark"\],\s*body\.dark\s*\{/, "Polish overrides must follow the app's html[data-theme=dark] selector.");
assert.match(fieldPolish, /--scan-card-bg:\s*#111e2f/, "Dark polish cards should use a dark surface.");
assert.match(fieldPolish, /\.customer-card > span:first-child\s*\{[\s\S]*?display:\s*grid;[\s\S]*?gap:\s*6px;/, "Customer card contact info should stay stacked with readable spacing.");
assert.match(fieldPolish, /\.customer-card strong\s*\{[\s\S]*?font-size:\s*0\.98rem;/, "Customer names should stay prominent in the customer list.");
for (const alias of ["--text", "--text-muted", "--accent", "--primary", "--primary-soft", "--soft-blue", "--red", "--danger-soft", "--green-dark", "--amber-dark", "--radius-sm"]) {
  assert.match(css, new RegExp(`${alias}:`), `Theme CSS should define ${alias} for older shared UI rules.`);
}

assert.match(localConfigExample, /environment:\s*"local"/, "Local config example must identify itself as local.");
assert.match(localConfigExample, /YOUR-LOCAL-OR-DEV-PROJECT/, "Local config example should use placeholder project values.");
assert.match(productionConfigExample, /environment:\s*"production"/, "Production config example must identify itself as production.");
assert.match(productionConfigExample, /YOUR-PRODUCTION-PROJECT/, "Production config example should use placeholder project values.");
assert.match(productionConfigExample, /publicAppUrl:\s*"https:\/\/YOUR-DOMAIN\.com\/app\/"/, "Production config example should define the hosted app URL for auth callbacks.");
assert.match(genericConfigExample, /environment:\s*"local"/, "Generic config example should identify itself as local by default.");
assert.match(genericConfigExample, /YOUR-PROJECT/, "Generic config example should use placeholder project values.");

for (const [name, content] of [
  ["local config example", localConfigExample],
  ["production config example", productionConfigExample],
  ["generic config example", genericConfigExample]
]) {
  assert.doesNotMatch(content, /uwgklcnwjsmmwndoqdam/i, `${name} must not contain the active development project URL.`);
  assert.doesNotMatch(content, /sb_publishable_/i, `${name} must not contain a real publishable key.`);
}

assert.match(readme, /supabase-config\.local\.example\.js/, "README should document the local config template.");
assert.match(readme, /supabase-config\.production\.example\.js/, "README should document the production config template.");
assert.match(readme, /BACKLINE_SUPABASE_URL/, "README should document the Pages production variable.");
assert.match(readme, /BACKLINE_SUPABASE_ANON_KEY/, "README should document the Pages production secret.");
assert.match(readme, /beta-deployment-guide\.md/, "README should link the beta deployment guide.");
assert.match(readme, /supabase-production-setup\.md/, "README should link the Supabase production setup helper.");
assert.match(launchChecklist, /Production project is separate from local\/dev testing project/, "Launch checklist should prevent environment mixing.");
assert.match(launchChecklist, /BACKLINE_SUPABASE_URL/, "Launch checklist should include the Pages production variable.");
assert.match(launchChecklist, /BACKLINE_SUPABASE_ANON_KEY/, "Launch checklist should include the Pages production secret.");
assert.match(launchChecklist, /Supabase Auth Site URL is `https:\/\/backlineoffice\.com\/app\/`/, "Launch checklist should include the hosted auth Site URL.");
assert.match(launchChecklist, /Google OAuth provider is enabled in Supabase/, "Launch checklist should include Google OAuth setup.");
assert.match(launchChecklist, /Facebook OAuth provider is enabled in Supabase/, "Launch checklist should include Facebook OAuth setup.");
assert.match(launchChecklist, /tests\/real-shop-workflow-test\.mjs/, "Launch checklist should include the real shop workflow audit.");
assert.match(launchChecklist, /Phone And SMS/, "Launch checklist should require an explicit phone and SMS beta decision.");
assert.match(launchChecklist, /customer-facing links never use `127\.0\.0\.1`, `localhost`, or `file:\/\/`/, "Launch checklist should block local customer-facing production links.");
assert.match(betaDeploymentGuide, /BACKLINE_SUPABASE_URL/, "Beta deployment guide should document the Pages Supabase URL variable.");
assert.match(betaDeploymentGuide, /BACKLINE_SUPABASE_ANON_KEY/, "Beta deployment guide should document the Pages Supabase anon key secret.");
assert.match(betaDeploymentGuide, /supabase-schema-24-public-link-guardrails\.sql/, "Beta deployment guide should use the latest schema cutoff.");
assert.match(betaDeploymentGuide, /never `localhost`, `127\.0\.0\.1`, or `file:\/\/`/, "Beta deployment guide should block local customer-facing production links.");
assert.match(supabaseProductionSetup, /supabase-schema-24-public-link-guardrails\.sql/, "Supabase setup helper should use the latest schema cutoff.");
assert.match(supabaseProductionSetup, /supabase-schema-07a-team-tables\.sql/, "Supabase setup helper should document the split team schema fallback.");
assert.match(supabaseProductionSetup, /insert into public\.platform_admins/, "Supabase setup helper should document Foundry bootstrap SQL.");
assert.match(supabaseProductionSetup, /RESEND_API_KEY/, "Supabase setup helper should document invite email secrets.");
assert.match(supabaseProductionSetup, /BACKLINE_SUPABASE_URL/, "Supabase setup helper should document hosted config variables.");
assert.match(supabaseProductionSetup, /https:\/\/backlineoffice\.com\/app\//, "Supabase setup helper should document the hosted auth return URL.");
assert.match(supabaseProductionSetup, /Enable Google And Facebook OAuth/, "Supabase setup helper should document OAuth provider setup.");
assert.match(readme, /Google and Facebook sign-in through Supabase OAuth/, "README should document OAuth provider setup.");
assert.match(packageJson, /"deploy:preflight":\s*"node tests\/deploy-preflight\.mjs"/, "package.json should expose the deploy preflight check.");
assert.match(packageJson, /node tests\/site-build-test\.mjs/, "package.json test script should include the site build test.");
assert.match(siteBuildTest, /"supabase-config\.local\.example\.js"/, "Site build test should exclude local Supabase config.");
assert.match(siteBuildTest, /"supabase-config\.production\.example\.js"/, "Site build test should exclude production config template.");
assert.match(siteBuildTest, /"tests"/, "Site build test should exclude repo test files.");
assert.match(siteBuildTest, /Generated config should not contain placeholders or development values/, "Site build test should reject placeholder/dev config values.");
assert.match(siteBuildTest, /warnIfUnsafeProductionCustomerLink/, "Site build test should require production customer-link safety.");

console.log("Deploy preflight passed.");
