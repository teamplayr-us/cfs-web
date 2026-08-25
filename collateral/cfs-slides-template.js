// College Flag Showcase Series — presentation template deck.
// Generates collateral/cfs-slides-template.pptx (16:9) for conversion to
// Google Slides. Brand: BRAND.md — navy/pink/chalk, Big Shoulders Display /
// Archivo / JetBrains Mono, hard edges, offset block shadows, mono kickers.
//
// Structure: CORE layouts (any deck) + three purpose packs with distinct
// styles — INVESTOR (navy, data-forward), PARTNERSHIP (pink-forward),
// EDUCATION (chalk, explanatory). Presenters keep the pack they need and
// delete the rest.
//
// Run from repo root: node collateral/cfs-slides-template.js

const pptxgen = require("pptxgenjs");
const path = require("path");

const NAVY = "0A0A0B";
const PINK = "FF2D8E";
const PINK_LIGHT = "FF8DC1";
const CHALK = "F7F5F6";
const WHITE = "FFFFFF";
const STEEL = "5C5A5E";
const STEEL_DARK = "8A848C";
const LINE_DARK = "242127";
const LINE = "E6E2E5";

const DISPLAY = "Big Shoulders Display";
const BODY = "Archivo";
const MONO = "JetBrains Mono";

const LOGO = path.join(__dirname, "slides-logo.png"); // slim copy of public/logo.png

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
const W = 13.33;
const H = 7.5;
let PAGE = 0;

// ---- helpers -------------------------------------------------------------

function yardLines(slide) {
  for (let y = 1.5; y < H; y += 1.5) {
    slide.addShape("rect", {
      x: 0, y, w: W, h: 0.02, fill: { color: LINE_DARK }, line: { type: "none" },
    });
  }
}

function kicker(slide, text, opts = {}) {
  slide.addText(text.toUpperCase(), {
    x: opts.x ?? 0.6, y: opts.y ?? 0.45, w: opts.w ?? W - 1.2, h: 0.4,
    fontFace: MONO, fontSize: 12, bold: true, charSpacing: 4,
    color: opts.color ?? PINK, align: opts.align ?? "left", margin: 0,
  });
}

function pageNo(slide, dark) {
  PAGE += 1;
  if (PAGE === 1) return; // no footer on title
  slide.addText(String(PAGE).padStart(2, "0"), {
    x: W - 1.1, y: H - 0.55, w: 0.6, h: 0.35, fontFace: MONO, fontSize: 10,
    bold: true, charSpacing: 3, color: dark ? STEEL_DARK : STEEL,
    align: "right", margin: 0,
  });
  slide.addText("COLLEGE FLAG SHOWCASE SERIES", {
    x: 0.6, y: H - 0.55, w: 5, h: 0.35, fontFace: MONO, fontSize: 9,
    bold: true, charSpacing: 3, color: dark ? STEEL_DARK : STEEL, margin: 0,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  const off = 0.09;
  slide.addShape("rect", {
    x: x + off, y: y + off, w, h,
    fill: { color: opts.shadow ?? NAVY }, line: { type: "none" },
  });
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: opts.fill ?? WHITE },
    line: { color: opts.border ?? NAVY, width: 2.5 },
  });
}

function title(slide, text, color) {
  slide.addText(text, {
    x: 0.55, y: 0.85, w: 12.2, h: 1.0, fontFace: DISPLAY, fontSize: 40,
    bold: true, color, margin: 0,
  });
}

// pack divider: names the pack and its style
function packDivider(tag, name, note) {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  s.addText(tag.toUpperCase(), {
    x: 0.6, y: 1.9, w: 6, h: 0.5, fontFace: MONO, fontSize: 14, bold: true,
    charSpacing: 5, color: PINK, margin: 0,
  });
  s.addText(name, {
    x: 0.55, y: 2.45, w: 12.2, h: 1.7, fontFace: DISPLAY, fontSize: 64,
    bold: true, color: CHALK, margin: 0,
  });
  s.addText(note, {
    x: 0.6, y: 4.3, w: 10.5, h: 0.8, fontFace: BODY, fontSize: 15,
    color: STEEL_DARK, margin: 0,
  });
  pageNo(s, true);
  s.addNotes("PACK DIVIDER — keep only the pack(s) this presentation needs; delete unused packs including this divider.");
  return s;
}

// ========================= CORE LAYOUTS ==================================

// 1. TITLE
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  s.addImage({ path: LOGO, x: 0.6, y: 0.55, w: 1.35, h: 1.35 });
  kicker(s, "Girls Flag Football · National Recruiting Series", { x: 0.6, y: 2.35 });
  s.addText([
    { text: "Presentation ", options: { color: CHALK } },
    { text: "Title.", options: { color: PINK } },
  ], {
    x: 0.55, y: 2.7, w: 12.2, h: 2.2, fontFace: DISPLAY, fontSize: 80,
    bold: true, margin: 0,
  });
  s.addText("Subtitle or one-line description of this presentation goes here.", {
    x: 0.6, y: 4.9, w: 9.5, h: 0.6, fontFace: BODY, fontSize: 18,
    color: STEEL_DARK, margin: 0,
  });
  s.addText("PRESENTER NAME  ·  MONTH 2026  ·  COLLEGEFLAGSHOWCASE.COM", {
    x: 0.6, y: 6.55, w: 10, h: 0.4, fontFace: MONO, fontSize: 11, bold: true,
    charSpacing: 3, color: STEEL_DARK, margin: 0,
  });
  pageNo(s, true);
  s.addNotes("TITLE — swap title, subtitle, presenter, date. The kicker is the series positioning line; keep it.");
}

// 2. SECTION DIVIDER
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  s.addText("01", {
    x: 0.6, y: 1.7, w: 3, h: 1.2, fontFace: MONO, fontSize: 40, bold: true,
    charSpacing: 6, color: PINK, margin: 0,
  });
  s.addText("Section Title.", {
    x: 0.55, y: 2.7, w: 12.2, h: 1.9, fontFace: DISPLAY, fontSize: 72,
    bold: true, color: CHALK, margin: 0,
  });
  s.addText("One line on what this section covers.", {
    x: 0.6, y: 4.6, w: 9, h: 0.5, fontFace: BODY, fontSize: 16,
    color: STEEL_DARK, margin: 0,
  });
  pageNo(s, true);
  s.addNotes("SECTION DIVIDER — update number and title; duplicate per section.");
}

// 3. STATEMENT
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  kicker(s, "The Big Idea");
  s.addText([
    { text: "A bold one-sentence claim, with the ", options: { color: CHALK } },
    { text: "key phrase", options: { color: PINK } },
    { text: " in pink.", options: { color: CHALK } },
  ], {
    x: 0.55, y: 2.0, w: 12.2, h: 3.4, fontFace: DISPLAY, fontSize: 54,
    bold: true, margin: 0, lineSpacingMultiple: 1.02,
  });
  pageNo(s, true);
  s.addNotes("STATEMENT — one claim per slide, exactly one pink phrase.");
}

// 4. AGENDA
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Agenda");
  title(s, "What We Will Cover.", NAVY);
  const items = [
    ["01", "First agenda item", "One supporting line about this item."],
    ["02", "Second agenda item", "One supporting line about this item."],
    ["03", "Third agenda item", "One supporting line about this item."],
    ["04", "Fourth agenda item", "One supporting line about this item."],
  ];
  items.forEach(([n, t, d], i) => {
    const y = 2.35 + i * 1.15;
    s.addText(n, { x: 0.6, y, w: 0.8, h: 0.5, fontFace: MONO, fontSize: 16, bold: true, charSpacing: 3, color: PINK, margin: 0 });
    s.addText(t, { x: 1.6, y: y - 0.04, w: 6.4, h: 0.55, fontFace: DISPLAY, fontSize: 24, bold: true, color: NAVY, margin: 0 });
    s.addText(d, { x: 8.2, y, w: 4.5, h: 0.5, fontFace: BODY, fontSize: 13, color: STEEL, margin: 0 });
    s.addShape("rect", { x: 0.6, y: y + 0.75, w: W - 1.2, h: 0.015, fill: { color: LINE }, line: { type: "none" } });
  });
  pageNo(s, false);
  s.addNotes("AGENDA — 3 to 5 rows; delete unused rows and their divider lines.");
}

// 5. CONTENT + VISUAL
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Section · Topic");
  title(s, "Content Slide Title.", NAVY);
  s.addText([
    { text: "Lead sentence makes the point of the slide in bold.", options: { bold: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Supporting bullet expands on the point", options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Second supporting bullet with detail", options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Third supporting bullet with detail", options: { bullet: { code: "2022" } } },
  ], {
    x: 0.6, y: 2.2, w: 6.4, h: 4.3, fontFace: BODY, fontSize: 15,
    color: NAVY, margin: 0, valign: "top",
  });
  card(s, 7.7, 2.2, 5.0, 4.3, { shadow: PINK });
  s.addText("DROP IMAGE, CHART,\nOR GRAPHIC HERE", {
    x: 7.7, y: 2.2, w: 5.0, h: 4.3, fontFace: MONO, fontSize: 12, bold: true,
    charSpacing: 3, color: STEEL, align: "center", valign: "middle",
  });
  pageNo(s, false);
  s.addNotes("CONTENT + VISUAL — replace the placeholder card with a photo, chart, or graphic; keep the pink offset shadow.");
}

// 6. FULL IMAGE
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  card(s, 0.6, 0.6, W - 1.2, 5.35, { shadow: PINK, fill: LINE_DARK });
  s.addText("FULL-BLEED IMAGE HERE", {
    x: 0.6, y: 0.6, w: W - 1.2, h: 5.35, fontFace: MONO, fontSize: 13,
    bold: true, charSpacing: 3, color: STEEL_DARK, align: "center", valign: "middle",
  });
  s.addText("Caption or key takeaway for the image goes on this line.", {
    x: 0.6, y: 6.3, w: 10, h: 0.5, fontFace: BODY, fontSize: 14,
    color: CHALK, margin: 0,
  });
  pageNo(s, true);
  s.addNotes("IMAGE — swap in an action photo; keep the pink offset shadow.");
}

// 7. QUOTE
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  s.addText("“", {
    x: 0.5, y: 0.7, w: 2, h: 1.8, fontFace: DISPLAY, fontSize: 140,
    bold: true, color: PINK, margin: 0,
  });
  s.addText("The quote goes here — keep it to two or three lines so it stays big and readable.", {
    x: 1.7, y: 2.1, w: 10.2, h: 2.6, fontFace: DISPLAY, fontSize: 38,
    bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.05,
  });
  s.addText("NAME  ·  ROLE OR PROGRAM", {
    x: 1.7, y: 5.0, w: 8, h: 0.4, fontFace: MONO, fontSize: 12, bold: true,
    charSpacing: 3, color: STEEL, margin: 0,
  });
  pageNo(s, false);
  s.addNotes("QUOTE — coach/parent/athlete/partner testimonial. Get permission before quoting.");
}

// ======================== INVESTOR PACK (navy, data-forward) =============

packDivider("Pack · For Investors", "Investor Pages.", "Navy, data-forward layouts: opportunity, traction, and the ask. Numbers carry these slides — verify every figure before presenting.");

// I1. OPPORTUNITY — big stat + context
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  kicker(s, "The Opportunity");
  title(s, "Market Slide Title.", CHALK);
  s.addText("90+", {
    x: 0.6, y: 2.3, w: 5.6, h: 2.2, fontFace: DISPLAY, fontSize: 150,
    bold: true, color: PINK, margin: 0,
  });
  s.addText("HEADLINE STAT LABEL — e.g. college programs playing", {
    x: 0.65, y: 4.6, w: 5.4, h: 0.5, fontFace: MONO, fontSize: 12, bold: true,
    charSpacing: 2, color: CHALK, margin: 0,
  });
  const chips = [
    ["LA28", "Olympic debut"],
    ["NCAA", "Emerging sport, 2026"],
    ["2028", "First Power Four varsity"],
  ];
  chips.forEach(([n, l], i) => {
    const y = 2.35 + i * 1.35;
    s.addShape("rect", { x: 7.2, y, w: 5.5, h: 1.1, fill: { color: NAVY }, line: { color: LINE_DARK, width: 1.5 } });
    s.addText(n, { x: 7.5, y: y + 0.18, w: 1.7, h: 0.75, fontFace: DISPLAY, fontSize: 32, bold: true, color: PINK_LIGHT, margin: 0 });
    s.addText(l.toUpperCase(), { x: 9.3, y: y + 0.35, w: 3.3, h: 0.45, fontFace: MONO, fontSize: 11, bold: true, charSpacing: 2, color: CHALK, margin: 0 });
  });
  pageNo(s, true);
  s.addNotes("INVESTOR / OPPORTUNITY — one dominant number, three supporting chips. The samples are real facts (Aug 2026); verify before presenting.");
}

// I2. TRACTION — metric tiles + chart slot
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  kicker(s, "Traction");
  title(s, "Traction Slide Title.", CHALK);
  const tiles = [
    ["Metric", "Value"],
    ["Metric", "Value"],
    ["Metric", "Value"],
  ];
  tiles.forEach(([l], i) => {
    const y = 2.3 + i * 1.45;
    s.addShape("rect", { x: 0.6, y, w: 4.4, h: 1.2, fill: { color: NAVY }, line: { color: LINE_DARK, width: 1.5 } });
    s.addText("VALUE", { x: 0.9, y: y + 0.15, w: 2.0, h: 0.9, fontFace: DISPLAY, fontSize: 34, bold: true, color: PINK, margin: 0 });
    s.addText("METRIC LABEL", { x: 2.9, y: y + 0.4, w: 2.0, h: 0.45, fontFace: MONO, fontSize: 10, bold: true, charSpacing: 2, color: CHALK, margin: 0 });
  });
  card(s, 5.7, 2.3, 7.0, 4.35, { shadow: PINK, fill: LINE_DARK, border: LINE_DARK });
  s.addText("GROWTH CHART HERE", {
    x: 5.7, y: 2.3, w: 7.0, h: 4.35, fontFace: MONO, fontSize: 12, bold: true,
    charSpacing: 3, color: STEEL_DARK, align: "center", valign: "middle",
  });
  pageNo(s, true);
  s.addNotes("INVESTOR / TRACTION — three metric tiles + a chart. Registrations, committed colleges, teams, cities: whatever is real and current.");
}

// I3. THE ASK
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  kicker(s, "The Ask");
  s.addText("$X.XM", {
    x: 0.55, y: 1.5, w: 7, h: 2.0, fontFace: DISPLAY, fontSize: 120,
    bold: true, color: PINK, margin: 0,
  });
  s.addText("WHAT THE RAISE IS FOR — ONE LINE", {
    x: 0.6, y: 3.6, w: 7, h: 0.5, fontFace: MONO, fontSize: 13, bold: true,
    charSpacing: 3, color: CHALK, margin: 0,
  });
  const uses = [
    ["Use of funds one", 0.75],
    ["Use of funds two", 0.5],
    ["Use of funds three", 0.3],
  ];
  uses.forEach(([label, frac], i) => {
    const y = 4.5 + i * 0.8;
    s.addText(label, { x: 0.6, y, w: 3.4, h: 0.45, fontFace: BODY, fontSize: 14, color: CHALK, margin: 0 });
    s.addShape("rect", { x: 4.2, y: y + 0.06, w: 8.0, h: 0.3, fill: { color: LINE_DARK }, line: { type: "none" } });
    s.addShape("rect", { x: 4.2, y: y + 0.06, w: 8.0 * frac, h: 0.3, fill: { color: PINK }, line: { type: "none" } });
  });
  pageNo(s, true);
  s.addNotes("INVESTOR / ASK — the raise, what it funds, allocation bars. Set each bar's width to the real proportion.");
}

// ==================== PARTNERSHIP PACK (pink-forward) ====================

packDivider("Pack · For Brand Partners", "Partnership Pages.", "Pink-forward layouts: tiers, audience reach, and activation. Built to show a brand exactly what they get on the field.");

// P1. TIERS — three cards, featured center
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Partnership Packages");
  title(s, "Tiers Slide Title.", NAVY);
  [0, 1, 2].forEach((i) => {
    const x = 0.6 + i * 4.15;
    const featured = i === 1;
    card(s, x, 2.2, 3.9, 4.5, { shadow: featured ? PINK : NAVY });
    s.addShape("rect", {
      x, y: 2.2, w: 3.9, h: 0.65,
      fill: { color: featured ? PINK : NAVY }, line: { color: featured ? PINK : NAVY, width: 2 },
    });
    s.addText(featured ? "FEATURED TIER" : "TIER NAME", {
      x: x + 0.3, y: 2.32, w: 3.3, h: 0.45, fontFace: DISPLAY, fontSize: 18,
      bold: true, color: WHITE, margin: 0,
    });
    s.addText("$X,XXX", {
      x: x + 0.3, y: 3.05, w: 3.3, h: 0.6, fontFace: MONO, fontSize: 22,
      bold: true, color: PINK, margin: 0,
    });
    s.addText([
      { text: "What this tier includes", options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 6 } },
      { text: "Second inclusion", options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 6 } },
      { text: "Third inclusion", options: { bullet: { code: "2022" } } },
    ], {
      x: x + 0.3, y: 3.8, w: 3.3, h: 2.6, fontFace: BODY, fontSize: 13,
      color: STEEL, margin: 0, valign: "top",
    });
  });
  pageNo(s, false);
  s.addNotes("PARTNERSHIP / TIERS — pull real tier names and pricing from the sponsorship one-pager; never invent pricing.");
}

// P2. AUDIENCE & REACH
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Audience & Reach");
  title(s, "Reach Slide Title.", NAVY);
  const stats = [["STAT", "Audience metric"], ["STAT", "Audience metric"], ["STAT", "Audience metric"], ["STAT", "Audience metric"]];
  stats.forEach(([n, l], i) => {
    const x = 0.6 + i * 3.12;
    card(s, x, 2.2, 2.85, 1.9);
    s.addText(n, { x: x + 0.25, y: 2.45, w: 2.35, h: 0.85, fontFace: DISPLAY, fontSize: 40, bold: true, color: PINK, margin: 0 });
    s.addText(l.toUpperCase(), { x: x + 0.25, y: 3.4, w: 2.35, h: 0.5, fontFace: MONO, fontSize: 10, bold: true, charSpacing: 2, color: STEEL, margin: 0 });
  });
  card(s, 0.6, 4.55, W - 1.2, 2.0, { shadow: PINK });
  s.addText("BRAND PLACEMENT MOCKUP OR EVENT PHOTO STRIP HERE", {
    x: 0.6, y: 4.55, w: W - 1.2, h: 2.0, fontFace: MONO, fontSize: 12,
    bold: true, charSpacing: 3, color: STEEL, align: "center", valign: "middle",
  });
  pageNo(s, false);
  s.addNotes("PARTNERSHIP / REACH — four audience stats over a placement visual. Only stats you can defend.");
}

// P3. ACTIVATION CHECKLIST
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "On-Site Activation");
  title(s, "Activation Slide Title.", NAVY);
  const rows = [
    "First activation placement or benefit",
    "Second activation placement or benefit",
    "Third activation placement or benefit",
    "Fourth activation placement or benefit",
    "Fifth activation placement or benefit",
  ];
  rows.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.35, y = 2.35 + row * 1.05;
    s.addShape("rect", { x, y, w: 0.38, h: 0.38, fill: { color: PINK }, line: { type: "none" } });
    s.addText("✓", { x, y: y - 0.02, w: 0.38, h: 0.42, fontFace: BODY, fontSize: 16, bold: true, color: WHITE, align: "center", margin: 0 });
    s.addText(t, { x: x + 0.6, y: y - 0.04, w: 5.6, h: 0.5, fontFace: BODY, fontSize: 15, bold: true, color: NAVY, margin: 0 });
  });
  s.addShape("rect", { x: 0.6, y: 5.7, w: W - 1.2, h: 1.0, fill: { color: PINK }, line: { type: "none" } });
  s.addText([
    { text: "PUT YOUR BRAND ON THE FIELD.   ", options: { color: WHITE, fontFace: DISPLAY, fontSize: 22, bold: true } },
    { text: "INFO@COLLEGEFLAGSHOWCASE.COM", options: { color: WHITE, fontFace: MONO, fontSize: 12, bold: true, charSpacing: 2 } },
  ], {
    x: 0.9, y: 5.7, w: 11.8, h: 1.0, valign: "middle", margin: 0,
  });
  pageNo(s, false);
  s.addNotes("PARTNERSHIP / ACTIVATION — pink check squares (brand motif) + full-pink CTA band, the one allowed pink wash.");
}

// ===================== EDUCATION PACK (chalk, explanatory) ===============

packDivider("Pack · For Education", "Education Pages.", "Chalk, explanatory layouts: how the weekend works, step-by-step processes, and Q&A. Built for parents, teams, and newcomers to the sport.");

// E1. HOW IT WORKS — two panels (real approved copy as the sample)
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "How an Event Works");
  title(s, "One Weekend, Two Ways to Get Seen.", NAVY);
  const panels = [
    ["01", "Showcase Combine & Camp", "INDIVIDUAL · OPEN REGISTRATION",
     "Each athlete's chance to stand out individually — position-specific skill work and 1v1s in front of college coaches, plus combine testing measured by trained staff and on the record."],
    ["02", "Showcase Tournament", "TEAM · INVITED TEAMS ONLY",
     "5v5 competition against a curated field of travel programs. College coaches evaluate live from the sideline, and every game is filmed for college evaluation."],
  ];
  panels.forEach(([n, t, tag, body], i) => {
    const x = 0.6 + i * 6.35;
    card(s, x, 2.2, 5.75, 4.3);
    s.addText(n, { x: x + 0.35, y: 2.5, w: 0.9, h: 0.5, fontFace: MONO, fontSize: 15, bold: true, charSpacing: 3, color: PINK, margin: 0 });
    s.addText(t, { x: x + 1.1, y: 2.44, w: 4.4, h: 0.55, fontFace: DISPLAY, fontSize: 22, bold: true, color: NAVY, margin: 0 });
    s.addText(tag, { x: x + 0.35, y: 3.1, w: 5.0, h: 0.4, fontFace: MONO, fontSize: 10, bold: true, charSpacing: 2, color: STEEL, margin: 0 });
    s.addText(body, { x: x + 0.35, y: 3.6, w: 5.05, h: 2.6, fontFace: BODY, fontSize: 14, color: NAVY, margin: 0, valign: "top" });
  });
  pageNo(s, false);
  s.addNotes("EDUCATION / HOW IT WORKS — the two panels carry current approved copy; keep in sync with the site and one-pagers.");
}

// E2. PROCESS STEPS
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Step by Step");
  title(s, "Process Slide Title.", NAVY);
  [0, 1, 2, 3].forEach((i) => {
    const x = 0.6 + i * 3.12;
    card(s, x, 2.5, 2.7, 3.4);
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.28, y: 2.8, w: 1.4, h: 0.7, fontFace: DISPLAY, fontSize: 34,
      bold: true, color: PINK, margin: 0,
    });
    s.addText("Step title", {
      x: x + 0.28, y: 3.6, w: 2.2, h: 0.5, fontFace: DISPLAY, fontSize: 19,
      bold: true, color: NAVY, margin: 0,
    });
    s.addText("One or two sentences describing this step.", {
      x: x + 0.28, y: 4.15, w: 2.2, h: 1.5, fontFace: BODY, fontSize: 12,
      color: STEEL, margin: 0, valign: "top",
    });
    if (i < 3) {
      s.addText("→", {
        x: x + 2.72, y: 3.9, w: 0.5, h: 0.6, fontFace: BODY, fontSize: 24,
        bold: true, color: PINK, align: "center", margin: 0,
      });
    }
  });
  pageNo(s, false);
  s.addNotes("EDUCATION / PROCESS — up to four steps with arrows. For three steps, delete the last card and re-center.");
}

// E3. Q&A
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  s.addText("Questions.", {
    x: 0.55, y: 2.4, w: 12.2, h: 1.8, fontFace: DISPLAY, fontSize: 96,
    bold: true, color: NAVY, align: "center", margin: 0,
  });
  s.addText("INFO@COLLEGEFLAGSHOWCASE.COM  ·  COLLEGEFLAGSHOWCASE.COM/FAQ", {
    x: 1.7, y: 4.5, w: 10, h: 0.4, fontFace: MONO, fontSize: 12, bold: true,
    charSpacing: 3, color: PINK, align: "center", margin: 0,
  });
  pageNo(s, false);
  s.addNotes("EDUCATION / Q&A — point the room at the FAQ page; log repeated questions as design defects (Experience Standard 5).");
}

// ============================ CLOSING ====================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  s.addImage({ path: LOGO, x: W / 2 - 0.9, y: 0.85, w: 1.8, h: 1.8 });
  s.addText([
    { text: "Ball Out. Get Seen. ", options: { color: CHALK } },
    { text: "Get Recruited.", options: { color: PINK } },
  ], {
    x: 0.55, y: 3.0, w: 12.2, h: 1.3, fontFace: DISPLAY, fontSize: 54,
    bold: true, align: "center", margin: 0,
  });
  s.addText("Closing line or call to action for this audience goes here.", {
    x: 1.7, y: 4.4, w: 10, h: 0.5, fontFace: BODY, fontSize: 16,
    color: STEEL_DARK, align: "center", margin: 0,
  });
  s.addText("INFO@COLLEGEFLAGSHOWCASE.COM  ·  COLLEGEFLAGSHOWCASE.COM", {
    x: 1.7, y: 6.0, w: 10, h: 0.4, fontFace: MONO, fontSize: 12, bold: true,
    charSpacing: 3, color: CHALK, align: "center", margin: 0,
  });
  pageNo(s, true);
  s.addNotes("CLOSING — swap the CTA per audience: investors get the ask, partners the next step, education where to learn more.");
}

pres.writeFile({ fileName: path.join(__dirname, "cfs-slides-template.pptx") }).then(() => {
  console.log("written collateral/cfs-slides-template.pptx —", PAGE, "slides");
});
