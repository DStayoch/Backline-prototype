// Runs the real send-team-invite Edge Function under Node with a stand-in for
// Deno and for the network, and checks the role name the invited person reads.
// (Node 24 runs the TypeScript source directly; no dependencies are needed.)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const INVITE = "20000000-0000-4000-8000-00000000000b";
const env = {
  RESEND_API_KEY: "re_test", INVITE_FROM_EMAIL: "Backline <invite@backlineoffice.com>",
  SUPABASE_URL: "https://db.test", SUPABASE_SERVICE_ROLE_KEY: "service-key",
  BACKLINE_APP_URL: "https://backlineoffice.com/app/"
};
let handler = null;
globalThis.Deno = { env: { get: (name) => env[name] }, serve: (fn) => { handler = fn; } };
await import(pathToFileURL(resolve("supabase/functions/send-team-invite/index.ts")).href);

async function inviteEmail(role, companySettings, { wrapped = true } = {}) {
  let sent = null;
  globalThis.fetch = async (url, options = {}) => {
    const u = String(url);
    const json = (body) => new Response(JSON.stringify(body), { status: 200 });
    if (u.endsWith("/auth/v1/user")) return json({ id: "00000000-0000-4000-8000-0000000000a1" });
    if (u.includes("/rest/v1/team_invites")) return json([{ id: INVITE, email: "new@shop.test", role, organization_id: "10000000-0000-4000-8000-00000000000a" }]);
    if (u.includes("/rest/v1/organization_members")) return json([{ display_name: "Derek", email: "owner@shop.test", role: "owner" }]);
    if (u.includes("/rest/v1/organizations")) return json([{ name: "Junk in Our Trunk", payload: wrapped ? { companySettings } : companySettings }]);
    if (u === "https://api.resend.com/emails") { sent = JSON.parse(options.body); return json({ id: "email-1" }); }
    throw new Error(`Unexpected request: ${u}`);
  };
  const response = await handler(new Request("https://fn.test/send-team-invite", {
    method: "POST", headers: { Authorization: "Bearer user-token", "Content-Type": "application/json" }, body: JSON.stringify({ inviteId: INVITE })
  }));
  assert.equal(response.status, 200, "The invite email should send");
  return sent;
}

const roleLine = (email) => email.text.split("\n").find((line) => line.startsWith("Role: "));

// The names must be the ones the app shows for each business type.
const app = readFileSync("app.js", "utf8").replace(/\r/g, "");
const block = (name) => app.slice(app.indexOf(`const ${name} = {`), app.indexOf("\n};", app.indexOf(`const ${name} = {`)));
const perType = (source, key) => Object.fromEntries([...source.matchAll(new RegExp(String.raw`\n  (\w+): \{[\s\S]*?\n    ${key}: "([^"]+)"`, "g"))].map((match) => [match[1], match[2]]));
const coordinators = perType(block("BUSINESS_ACCESS_TERMINOLOGY"), "coordinatorRole");
const assignees = perType(block("BUSINESS_TERMINOLOGY"), "assignee");
assert.deepEqual(Object.keys(coordinators).sort(), ["appointments", "automotive", "general", "professional", "trades"], "Every business type's coordinator name should be readable from app.js");
assert.deepEqual(Object.keys(assignees).sort(), Object.keys(coordinators).sort(), "Every business type's assignee name should be readable from app.js");
for (const type of Object.keys(coordinators)) {
  assert.equal(roleLine(await inviteEmail("dispatcher", { businessType: type })), `Role: ${coordinators[type]}`, `A ${type} shop's invite names the coordinator role as the app does`);
  assert.equal(roleLine(await inviteEmail("tech", { businessType: type })), `Role: ${assignees[type]}`, `A ${type} shop's invite names the assignee role as the app does`);
}

// The case Derek reported: the app says Coordinator, the email said Dispatcher.
const reported = await inviteEmail("dispatcher", { businessType: "general" });
assert.equal(roleLine(reported), "Role: Coordinator");
assert.match(reported.html, /<strong>Role:<\/strong> Coordinator</);
assert.doesNotMatch(reported.html + reported.text, /Dispatcher/);

assert.equal(roleLine(await inviteEmail("dispatcher", {})), "Role: Coordinator", "A shop with no business type uses the general names");
assert.equal(roleLine(await inviteEmail("dispatcher", { businessType: "professional" }, { wrapped: false })), "Role: Coordinator", "Settings stored at the top of the payload are read too");
assert.equal(roleLine(await inviteEmail("admin", { businessType: "trades" })), "Role: Admin");
assert.equal(roleLine(await inviteEmail("dispatcher", { businessType: "trades", roleOverrides: { dispatcher: { label: "Office lead" } } })), "Role: Office lead", "A role the shop renamed uses the shop's name");
assert.equal(roleLine(await inviteEmail("dispatcher", { businessType: "trades", roleOverrides: { dispatcher: { label: "  " } } })), "Role: Dispatcher", "A blank rename falls back to the standard name");
assert.equal(roleLine(await inviteEmail("lead-estimator", { customRoles: [{ slug: "lead-estimator", label: "Senior Estimator" }] })), "Role: Senior Estimator", "A custom role uses its label");
assert.equal(roleLine(await inviteEmail("lead-estimator", { customRoles: [] })), "Role: Lead Estimator", "An unknown role is still readable");
const markup = await inviteEmail("helper", { customRoles: [{ slug: "helper", label: "<b>Helper</b>" }] });
assert.doesNotMatch(markup.html, /<b>Helper/, "A role label cannot add markup to the email");

console.log("Team invite function tests passed");
