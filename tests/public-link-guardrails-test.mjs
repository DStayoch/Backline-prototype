import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schema = readFileSync("supabase-schema-24-public-link-guardrails.sql", "utf8");
const fullSchema = readFileSync("supabase-schema.sql", "utf8");

assert.match(schema, /Backline schema 24: public customer portal guardrails/);
assert.match(schema, /backline_valid_portal_token/);
assert.match(schema, /\^portal-\[A-Za-z0-9_-\]\{16,120\}\$/);
assert.match(schema, /create table if not exists public\.portal_reply_rate_limits/);
assert.match(schema, /portal_reply_rate_limits_token_created_idx/);
assert.match(schema, /pg_advisory_xact_lock/);
assert.match(schema, /recent_reply_count >= 6/);
assert.match(schema, /interval '15 minutes'/);
assert.match(schema, /where public\.backline_valid_portal_token\(input_token\)/);
assert.match(schema, /Too many messages were sent/);
assert.match(fullSchema, /Backline schema 24: public customer portal guardrails/);

console.log("Public link guardrails test passed.");
