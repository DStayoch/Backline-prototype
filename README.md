# Backline Prototype

Backline is a local-first MVP for an AI-first missed-call recovery dashboard for small trade contractors.

The first wedge is simple:

> Never lose a job because nobody answered the phone.

## What Is Included

- Create and manage real recovered-call jobs
- Save data in browser local storage
- Search and filter the job inbox
- Book jobs, send estimate/invoice status changes, and mark paid
- Add notes, outbound SMS entries, and customer replies
- Toggle follow-up automations
- Export and import workspace data
- View live schedule and pipeline metrics
- Product brief, MVP spec, and validation plan

## Local Preview

Open `index.html` in a browser.

You can also serve it locally:

```bash
python -m http.server 8765
```

Then visit:

```text
http://127.0.0.1:8765
```

## Test

```bash
npm test
```

The test script checks JavaScript syntax and verifies that the MVP files are wired together.

## GitHub Pages

This repo includes a GitHub Pages workflow. After pushing to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Build and deployment` source to `GitHub Actions`.
4. Push to `main`.

The `Deploy GitHub Pages` workflow will publish the prototype.

## Product Docs

- `product-brief.md`
- `mvp-spec.md`
- `validation-plan.md`
