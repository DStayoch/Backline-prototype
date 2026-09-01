import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("public-site/index.html", "utf8");

assert.match(page, /mailto:support@backlineoffice\.com/, "The public site should expose the verified support route.");
assert.match(page, /<h3>Solo<\/h3>/, "Public pricing should use the Solo plan name.");
assert.match(page, /<h3>Crew<\/h3>/, "Public pricing should use the Crew plan name.");
assert.match(page, /<h3>Shop<\/h3>/, "Public pricing should use the Shop plan name.");
assert.match(page, /\$49 \/ month/, "Public pricing should match the Solo price.");
assert.match(page, /\$99 \/ month/, "Public pricing should match the Crew price.");
assert.match(page, /\$179 \/ month/, "Public pricing should match the Shop price.");
assert.match(page, /\$15 \/ month per additional user/, "Public pricing should disclose the additional user price.");
assert.match(page, /class="footer-links"/, "The footer should group support and sign-in links cleanly.");

console.log("Public site contracts passed.");
