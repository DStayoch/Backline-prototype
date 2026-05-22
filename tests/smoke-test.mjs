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

assert.match(html, /<title>Backline<\/title>/);
assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
assert.match(html, /<script src="app\.js"><\/script>/);
assert.match(html, /id="jobList"/);
assert.match(html, /id="jobDetail"/);
assert.match(html, /id="jobForm"/);

assert.match(js, /localStorage/);
assert.match(js, /function createJob\(/);
assert.match(js, /function renderJobs\(\)/);
assert.match(js, /function renderDetail\(\)/);
assert.match(js, /function renderSchedule\(\)/);

assert.match(css, /\.app-shell/);
assert.match(css, /\.job-row/);
assert.match(css, /\.modal-card/);
assert.match(css, /@media \(max-width: 720px\)/);

console.log("Smoke test passed.");
