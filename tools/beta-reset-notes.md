# Backline Beta Seed And Reset Notes

Last updated: June 17, 2026

Use `tools/beta-seed.json` to reset a disposable beta/test workspace before running `beta-walkthrough.md`.

## What The Seed Contains

- A configured test shop: Junk in Our Trunk
- Four realistic customers
- One urgent unbooked HVAC lead
- One booked plumbing job assigned to `tech.test`
- One sent electrical estimate
- One partially paid HVAC maintenance invoice
- A small pricebook and inventory list
- Two suppliers
- One custom role
- A few activity events and customer-visible messages

## Safe Reset Flow

1. Sign in to a disposable test workspace.
2. Open Settings.
3. Choose **Restore from backup**.
4. Select `tools/beta-seed.json`.
5. Confirm the restore preview.
6. Refresh Backline.
7. Run **Settings** -> **Test secure connection**.
8. Run `beta-walkthrough.md`.

## Important Safety Rules

- Do not restore `tools/beta-seed.json` into a real customer workspace.
- Do not use this seed against production customer data.
- Do not use this seed to test destructive import/restore behavior after real beta data exists.
- If you need to test restore in production, create a separate production-like test shop first.
- Export a backup before any restore test that matters.

## Expected After Restore

- Home shows attention items from the seeded jobs.
- Customers includes Maya Rivera, Evan Bennett, Nora Walsh, and Daniel Kim.
- Inventory includes capacitor, filter, and trap kit materials.
- Suppliers includes Coastal HVAC Supply and Home Depot.
- Jobs database includes open, booked, estimated, and invoiced examples.
- Money surfaces show a partial balance for Daniel Kim.

## Reset Cadence

Restore this seed:

- Before each full beta walkthrough
- Before debugging a workflow that depends on known data
- After a test creates too much old estimate/payment/portal noise

Do not restore this seed:

- In a real shop workspace
- After customer pilot data is collected
- As a substitute for a production backup strategy
