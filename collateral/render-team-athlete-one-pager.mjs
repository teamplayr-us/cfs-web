// Render a co-branded athlete one-pager for a Showcase Tournament team
// (team-athlete-one-pager.html → letter PDF + 2x PNG in collateral/team-one-pagers/).
// Usage (from the repo root):
//   node collateral/render-team-athlete-one-pager.mjs "Team Name" <logo> <CODE> <price> ["Dec 11"]
//   node collateral/render-team-athlete-one-pager.mjs "Kansas City Heat" public/programs/kansas-city-heat.png KCHEAT 115
// <logo> is a repo-relative path. LOGO_H env overrides the team logo height (px).
// College names come from data/colleges.ts.

import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const { chromium } = await import(
  "/opt/node22/lib/node_modules/playwright/index.mjs"
).catch(() => import("playwright"));

const [team, logo, code, price, expires = "December 11"] = process.argv.slice(2);
if (!team || !logo || !code || !price) {
  console.error('usage: render-team-athlete-one-pager.mjs "Team" <logo> <CODE> <price> [expires]');
  process.exit(1);
}

const colleges = [
  ...readFileSync(join(root, "data/colleges.ts"), "utf8").matchAll(/name: "([^"]+)"/g),
].map((m) => `<span>${m[1]}</span>`);

const asOf = new Date().toLocaleDateString("en-US", {
  month: "short", day: "numeric", year: "numeric",
});
const slug = team.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fill = {
  TEAM: team,
  LOGO: relative(here, resolve(root, logo)),
  LOGO_H: process.env.LOGO_H || "90",
  CODE: code.toUpperCase(),
  PRICE: price,
  EXPIRES: expires,
  COLLEGES: colleges.join(" &middot; "),
  AS_OF: asOf,
};
const html = readFileSync(join(here, "team-athlete-one-pager.html"), "utf8")
  .replace(/{{(\w+)}}/g, (_, k) => fill[k] ?? `{{${k}}}`);

const tmp = join(here, `.tmp-${slug}.html`);
writeFileSync(tmp, html);
const outDir = join(here, "team-one-pagers");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 816, height: 1056 },
  deviceScaleFactor: 2,
});
await page.goto(`file://${tmp}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.pdf({
  path: join(outDir, `${slug}-athlete-one-pager.pdf`),
  width: "8.5in",
  height: "11in",
  printBackground: true,
  pageRanges: "1",
});
await page.screenshot({ path: join(outDir, `${slug}-athlete-one-pager.png`) });
await browser.close();
unlinkSync(tmp);
console.log(`rendered team-one-pagers/${slug}-athlete-one-pager (.pdf + .png)`);
