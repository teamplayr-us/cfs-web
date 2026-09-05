// Render an org-level Showcase Tournament invitation graphic listing
// every invited team — the social companion to the invite email.
//
// Usage (from the repo root):
//   node collateral/render-org-invite.mjs "Org Name" public/programs/logo.png "City, ST" "Team 14U|Team 16U"
//
// Args:
//   1. Organization name, e.g. "One of One Girls Flag Football Club"
//   2. Logo path relative to the REPO ROOT — e.g. public/programs/foo.png
//      for orgs already on the site board, or collateral/invites/foo.png
//      for a new invitee (stage their logo there first; transparent PNG)
//   3. Home location, e.g. "Oklahoma City, OK" (match data/organizations.ts)
//   4. Invited teams, pipe-separated, e.g. "One of One 14U|One of One 16U"
//   5. (optional) Event line — defaults to "Event 01 · Dallas, TX · Dec 11–13, 2026"
//   6. (optional) Venue line — defaults to "Craig Ranch Sports Complex"
//   7. (optional) Output filename — defaults to invite-org-<logo-name>.png
//
// The private registration link goes in the EMAIL BODY, never on the graphic.

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve, basename } from "node:path";

const { chromium } = await (async () => {
  for (const spec of [
    "playwright",
    process.env.PLAYWRIGHT_PATH,
    "/opt/node22/lib/node_modules/playwright/index.mjs",
  ]) {
    if (!spec) continue;
    try {
      return await import(spec);
    } catch {
      // try the next candidate
    }
  }
  throw new Error("playwright not found — npm i -D playwright, or set PLAYWRIGHT_PATH");
})();

const here = dirname(fileURLToPath(import.meta.url));
const [orgName, logoPath, location, teams, eventLine, venueLine, outFile] =
  process.argv.slice(2);
if (!orgName || !logoPath || !location || !teams) {
  console.error(
    'Usage: node render-org-invite.mjs "Org Name" public/programs/logo.png "City, ST" "Team 14U|Team 16U" ["Event line"] ["Venue line"] [out.png]',
  );
  process.exit(1);
}

const logoRel = relative(here, resolve(process.cwd(), logoPath));
const teamRows = teams
  .split("|")
  .map((t) => `<p class="team-row">${t.trim()}</p>`)
  .join("\n      ");

const html = readFileSync(join(here, "invite-org-official.html"), "utf8")
  .replaceAll("{{ORG_NAME}}", orgName)
  .replaceAll("{{LOCATION}}", location)
  .replaceAll("{{LOGO}}", logoRel)
  .replaceAll("{{TEAM_ROWS}}", teamRows)
  .replaceAll(
    "{{EVENT_LINE}}",
    eventLine || "Event 01 &middot; Dallas, TX &middot; Dec 11&ndash;13, 2026",
  )
  .replaceAll("{{VENUE_LINE}}", venueLine || "Craig Ranch Sports Complex");

const tmp = join(here, ".invite-org-official.tmp.html");
writeFileSync(tmp, html);

const out = join(
  here,
  outFile ||
    `invite-org-${basename(logoPath).replace(/\.(png|jpg|jpeg)$/i, "")}.png`,
);

const { globSync } = await import("node:fs");
const chromePath =
  process.env.CHROMIUM_PATH ??
  globSync("/opt/pw-browsers/*/chrome-linux/headless_shell")[0];
const browser = await chromium.launch(
  chromePath ? { executablePath: chromePath } : {},
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
unlinkSync(tmp);
console.log(`rendered ${out}`);
