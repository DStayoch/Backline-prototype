# Backline Final Transfer Status - 2026-06-25

This note records the final transfer state before the original development computer is cleared.

## What is already on GitHub

- Repository: `DStayoch/Backline-prototype`
- Branch: `main`
- Handoff uploaded: `handoff/backline-current-state.md`
- Handoff commit: `80a8f6ff47393e04f43eff24e069c48f4be3b7f6`

## Local final backup

A local transfer backup was created at:

`C:\Users\user\Documents\Codex\Backline-final-transfer-20260625.zip`

The backup manifest was created at:

`C:\Users\user\Documents\Codex\2026-05-21\i-ll-frame-this-as-a\handoff\backline-final-manifest-20260625.txt`

The backup excludes local/private or generated folders and files:

- `.git/`
- `.codex/`
- `.agents/`
- `node_modules/`
- `_site/`
- old transfer backups
- `supabase-config.js`

## Important limitation

This machine does not currently have a working local Git or GitHub CLI install, and the local `.git` folder is not a usable clone. Because the current `app.js` is very large, the GitHub connector cannot safely perform a true full-folder sync by itself.

Do not delete the local project folder until either:

1. The final backup zip has been copied somewhere safe, or
2. Git/GitHub Desktop has been installed and a real full sync has been pushed from this folder.

## Next computer instructions

On the next computer:

1. Clone or open `DStayoch/Backline-prototype`.
2. Read `handoff/backline-current-state.md`.
3. Keep the final backup zip available as the source of truth for any local-only files that did not make it to GitHub.
4. Do not commit `supabase-config.js`; production should continue using GitHub Pages secrets/variables.
