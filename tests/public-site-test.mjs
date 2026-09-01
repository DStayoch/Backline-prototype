import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("public-site/index.html", "utf8");
const privacy = readFileSync("public-site/privacy.html", "utf8");
const terms = readFileSync("public-site/terms.html", "utf8");
const legalCss = readFileSync("public-site/legal.css", "utf8");

assert.match(page, /mailto:support@backlineoffice\.com/, "The public site should expose the verified support route.");
assert.match(page, /<h3>Solo<\/h3>/, "Public pricing should use the Solo plan name.");
assert.match(page, /<h3>Crew<\/h3>/, "Public pricing should use the Crew plan name.");
assert.match(page, /<h3>Shop<\/h3>/, "Public pricing should use the Shop plan name.");
assert.match(page, /\$49 \/ month/, "Public pricing should match the Solo price.");
assert.match(page, /\$99 \/ month/, "Public pricing should match the Crew price.");
assert.match(page, /\$179 \/ month/, "Public pricing should match the Shop price.");
assert.match(page, /\$15 \/ month per additional user/, "Public pricing should disclose the additional user price.");
assert.match(page, /class="footer-links"/, "The footer should group support and sign-in links cleanly.");
assert.match(page, /href="privacy\.html"/, "The public footer should link the privacy policy.");
assert.match(page, /href="terms\.html"/, "The public footer should link the terms of service.");
assert.match(privacy, /Backline is operated by Derek Stayoch/, "Privacy policy should identify the service operator.");
assert.match(privacy, /Supabase/, "Privacy policy should disclose core data infrastructure.");
assert.match(privacy, /Stripe/, "Privacy policy should disclose billing processing.");
assert.match(privacy, /support@backlineoffice\.com/, "Privacy policy should provide a support contact.");
assert.match(terms, /Terms of Service/, "Terms page should have a clear heading.");
assert.match(terms, /Trials, billing, and cancellation/, "Terms should address subscription billing.");
assert.match(terms, /support@backlineoffice\.com/, "Terms should provide a support contact.");
assert.match(legalCss, /@media \(max-width: 700px\)/, "Legal pages should include a mobile layout.");

console.log("Public site contracts passed.");
