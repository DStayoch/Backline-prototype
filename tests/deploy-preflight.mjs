import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  gitignore,
  pagesWorkflow,
  readme,
  launchChecklist,
  betaDeploymentGuide,
  supabaseProductionSetup,
  localConfigExample,
  productionConfigExample,
  genericConfigExample,
  packageJson,
  pagesArtifactTest,
  css,
  fieldPolish
] = await Promise.all([
  readFile(".gitignore", "utf8"),
  readFile(".github/workflows/pages.yml", "utf8"),
  readFile("README.md", "utf8"),
  readFile("production-launch-checklist.md", "utf8"),
  readFile("beta-deployment-guide.md", "utf8"),
  readFile("supabase-production-setup.md", "utf8"),
  readFile("supabase-config.local.example.js", "utf8"),
  readFile("supabase-config.production.example.js", "utf8"),
  readFile("supabase-config.example.js", "utf8"),
  readFile("package.json", "utf8"),
  readFile("tests/pages-artifact-test.mjs", "utf8"),
  readFile("styles.css", "utf8"),
  readFile("field-polish.css", "utf8")
]);

assert.match(gitignore, /^supabase-config\.js$/m, "Local Supabase config must stay ignored.");
assert.match(gitignore, /^_site\/$/m, "Generated Pages output should not be committed.");

assert.match(pagesWorkflow, /BACKLINE_SUPABASE_URL/, "Pages deploy must read the production Supabase URL from GitHub settings.");
assert.match(pagesWorkflow, /BACKLINE_SUPABASE_ANON_KEY/, "Pages deploy must read the production Supabase anon key from GitHub settings.");
assert.match(pagesWorkflow, /test:\s+name: Production test gate[\s\S]*?run: npm test/s, "Pages deploy must run the full test suite before publishing.");
assert.match(pagesWorkflow, /deploy:\s+needs: test/s, "Pages deployment must depend on the successful production test gate.");
assert.match(pagesWorkflow, /cat > _site\/supabase-config\.js/, "Pages deploy must generate production supabase-config.js.");
assert.match(pagesWorkflow, /publicAppUrl: "https:\/\/backlineoffice\.com\/app\/"/, "Pages deploy must set the hosted app URL for auth callbacks.");
assert.match(pagesWorkflow, /path: _site/, "Pages deploy should upload only the prepared static site.");
assert.match(pagesWorkflow, /cp index\.html backline-home\.html styles\.css field-polish\.css app\.js manifest\.webmanifest service-worker\.js _site\//, "Pages deploy should copy core app, home page, polish, and PWA files into _site.");
assert.match(pagesWorkflow, /cp -R assets _site\/assets/, "Pages deploy should include visual assets.");
assert.doesNotMatch(pagesWorkflow, /path: \./, "Pages deploy should not upload the whole repository.");
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
assert.match(packageJson, /node tests\/pages-artifact-test\.mjs/, "package.json test script should include the Pages artifact dry-run.");
assert.match(pagesArtifactTest, /"supabase-config\.local\.example\.js"/, "Pages artifact test should exclude local Supabase config.");
assert.match(pagesArtifactTest, /"supabase-config\.production\.example\.js"/, "Pages artifact test should exclude production config template.");
assert.match(pagesArtifactTest, /"tests"/, "Pages artifact test should exclude repo test files.");
assert.match(pagesArtifactTest, /Generated config should not contain placeholders or development values/, "Pages artifact test should reject placeholder/dev config values.");
assert.match(pagesArtifactTest, /warnIfUnsafeProductionCustomerLink/, "Pages artifact test should require production customer-link safety.");

console.log("Deploy preflight passed.");
