import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "product-brief.md",
  "mvp-spec.md",
  "validation-plan.md"
];

await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile("index.html", "utf8");
const js = await readFile("app.js", "utf8");
const css = await readFile("styles.css", "utf8");

assert.match(html, /<title>Backline Prototype<\/title>/);
assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
assert.match(html, /<script src="app\.js"><\/script>/);
assert.match(html, /id="jobList"/);
assert.match(html, /id="jobDetail"/);

assert.match(js, /const jobs = \[/);
assert.match(js, /function renderJobs\(\)/);
assert.match(js, /function renderDetail\(\)/);
assert.match(js, /Missed-call recovery|selectedJobId/);

const seededJobCount = (js.match(/id: "job-/g) || []).length;
assert.ok(seededJobCount >= 4, `expected at least 4 seeded jobs, found ${seededJobCount}`);

assert.match(css, /\.app-shell/);
assert.match(css, /\.job-row/);
assert.match(css, /@media \(max-width: 680px\)/);

console.log("Smoke test passed.");
