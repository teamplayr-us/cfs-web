// College Flag Showcase Series — presentation template deck.
// Generates collateral/cfs-slides-template.pptx (16:9), which is uploaded to
// Google Drive with conversion to become the Google Slides template.
// Brand: BRAND.md — navy/pink/chalk, Big Shoulders Display / Archivo /
// JetBrains Mono, hard edges, offset block shadows, mono kicker labels.
// Run from repo root: node collateral/cfs-slides-template.js

const pptxgen = require("pptxgenjs");
const path = require("path");

const NAVY = "0A0A0B";
const PINK = "FF2D8E";
const CHALK = "F7F5F6";
const WHITE = "FFFFFF";
const STEEL = "5C5A5E";
const STEEL_DARK = "8A848C"; // secondary text on navy
const LINE_DARK = "242127";
const LINE = "E6E2E5";

const DISPLAY = "Big Shoulders Display";
const BODY = "Archivo";
const MONO = "JetBrains Mono";

const LOGO = path.join(__dirname, "slides-logo.png"); // slim copy of public/logo.png (keeps the deck small)

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const W = 13.33;
const H = 7.5;

// ---- helpers -------------------------------------------------------------

function yardLines(slide) {
  // faint horizontal field lines on dark slides
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

function pageNo(slide, n, dark) {
  slide.addText(String(n).padStart(2, "0"), {
    x: W - 1.1, y: H - 0.55, w: 0.6, h: 0.35, fontFace: MONO, fontSize: 10,
    bold: true, charSpacing: 3, color: dark ? STEEL_DARK : STEEL,
    align: "right", margin: 0,
  });
  slide.addText("COLLEGE FLAG SHOWCASE SERIES", {
    x: 0.6, y: H - 0.55, w: 5, h: 0.35, fontFace: MONO, fontSize: 9,
    bold: true, charSpacing: 3, color: dark ? STEEL_DARK : STEEL, margin: 0,
  });
}

// offset block shadow: draw a solid rect behind, shifted 8px down-right
function card(slide, x, y, w, h, opts = {}) {
  const off = 0.09;
  slide.addShape("rect", {
    x: x + off, y: y + off, w, h,
    fill: { color: opts.shadow ?? NAVY }, line: { type: "none" },
  });
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: opts.fill ?? WHITE },
    line: { color: NAVY, width: 2.5 },
  });
}

// ---- 1. TITLE ------------------------------------------------------------
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
  s.addNotes("TITLE SLIDE — swap the title, subtitle, presenter, and date. Keep the kicker line as-is; it is the series positioning line.");
}

// ---- 2. SECTION DIVIDER --------------------------------------------------
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
  pageNo(s, 2, true);
  s.addNotes("SECTION DIVIDER — update the number and title. Duplicate for each section.");
}

// ---- 3. STATEMENT --------------------------------------------------------
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
  pageNo(s, 3, true);
  s.addNotes("STATEMENT SLIDE — one claim per slide. Keep it under two lines; exactly one pink phrase.");
}

// ---- 4. AGENDA / NUMBERED LIST -------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Agenda");
  s.addText("What We Will Cover.", {
    x: 0.55, y: 0.85, w: 12, h: 1.1, fontFace: DISPLAY, fontSize: 44,
    bold: true, color: NAVY, margin: 0,
  });
  const items = [
    ["01", "First agenda item", "One supporting line about this item."],
    ["02", "Second agenda item", "One supporting line about this item."],
    ["03", "Third agenda item", "One supporting line about this item."],
    ["04", "Fourth agenda item", "One supporting line about this item."],
  ];
  items.forEach(([n, t, d], i) => {
    const y = 2.35 + i * 1.15;
    s.addText(n, {
      x: 0.6, y, w: 0.8, h: 0.5, fontFace: MONO, fontSize: 16, bold: true,
      charSpacing: 3, color: PINK, margin: 0,
    });
    s.addText(t, {
      x: 1.6, y: y - 0.04, w: 6.4, h: 0.55, fontFace: DISPLAY, fontSize: 24,
      bold: true, color: NAVY, margin: 0,
    });
    s.addText(d, {
      x: 8.2, y, w: 4.5, h: 0.5, fontFace: BODY, fontSize: 13, color: STEEL,
      margin: 0,
    });
    s.addShape("rect", {
      x: 0.6, y: y + 0.75, w: W - 1.2, h: 0.015,
      fill: { color: LINE }, line: { type: "none" },
    });
  });
  pageNo(s, 4, false);
  s.addNotes("AGENDA — 3 to 5 rows. Delete unused rows including their divider lines.");
}

// ---- 5. CONTENT + VISUAL -------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Section · Topic");
  s.addText("Content Slide Title.", {
    x: 0.55, y: 0.85, w: 12, h: 1.0, fontFace: DISPLAY, fontSize: 40,
    bold: true, color: NAVY, margin: 0,
  });
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
  pageNo(s, 5, false);
  s.addNotes("CONTENT + VISUAL — replace the placeholder card with a photo, chart, or graphic. Keep the pink offset shadow behind whatever you place.");
}

// ---- 6. TWO-COLUMN -------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Comparison · Options · Split");
  s.addText("Two-Column Slide Title.", {
    x: 0.55, y: 0.85, w: 12, h: 1.0, fontFace: DISPLAY, fontSize: 40,
    bold: true, color: NAVY, margin: 0,
  });
  [["Column One", 0.6], ["Column Two", 6.95]].forEach(([title, x]) => {
    card(s, x, 2.2, 5.75, 4.3);
    s.addText(title.toUpperCase(), {
      x: x + 0.35, y: 2.55, w: 5.0, h: 0.5, fontFace: DISPLAY, fontSize: 22,
      bold: true, color: NAVY, margin: 0,
    });
    s.addText([
      { text: "First point for this column", options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 8 } },
      { text: "Second point for this column", options: { bullet: { code: "2022" }, breakLine: true, paraSpaceAfter: 8 } },
      { text: "Third point for this column", options: { bullet: { code: "2022" } } },
    ], {
      x: x + 0.35, y: 3.2, w: 5.05, h: 3.0, fontFace: BODY, fontSize: 14,
      color: STEEL, margin: 0, valign: "top",
    });
  });
  pageNo(s, 6, false);
  s.addNotes("TWO-COLUMN — comparisons, before/after, audience splits.");
}

// ---- 7. STAT BAND --------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  yardLines(s);
  kicker(s, "Why College Flag · The Numbers");
  s.addText("The Path Is Real.", {
    x: 0.55, y: 0.85, w: 12, h: 1.0, fontFace: DISPLAY, fontSize: 44,
    bold: true, color: CHALK, margin: 0,
  });
  const stats = [
    ["LA28", "Olympic sport", "Flag football debuts at the 2028 Games"],
    ["NCAA", "Emerging sport", "Added for women in 2026 — scholarships live"],
    ["90+", "College programs", "Playing now, with more added every season"],
    ["10", "Events, 2026–27", "Coast to coast, one series"],
  ];
  stats.forEach(([num, label, detail], i) => {
    const x = 0.6 + i * 3.12;
    s.addShape("rect", {
      x, y: 2.5, w: 2.85, h: 3.3,
      fill: { color: NAVY }, line: { color: LINE_DARK, width: 1.5 },
    });
    s.addText(num, {
      x: x + 0.25, y: 2.9, w: 2.35, h: 1.0, fontFace: DISPLAY, fontSize: 48,
      bold: true, color: PINK, margin: 0,
    });
    s.addText(label.toUpperCase(), {
      x: x + 0.25, y: 3.95, w: 2.35, h: 0.4, fontFace: MONO, fontSize: 11,
      bold: true, charSpacing: 2, color: CHALK, margin: 0,
    });
    s.addText(detail, {
      x: x + 0.25, y: 4.45, w: 2.35, h: 1.1, fontFace: BODY, fontSize: 12,
      color: STEEL_DARK, margin: 0, valign: "top",
    });
  });
  pageNo(s, 7, true);
  s.addNotes("STAT BAND — the four sample stats are real, current facts (Aug 2026). Swap in stats relevant to the audience; verify every number before presenting.");
}

// ---- 8. TIMELINE / SCHEDULE ----------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "2026–27 Season");
  s.addText("Timeline Slide Title.", {
    x: 0.55, y: 0.85, w: 12, h: 1.0, fontFace: DISPLAY, fontSize: 40,
    bold: true, color: NAVY, margin: 0,
  });
  const rows = [
    ["01", "Dallas, TX", "DEC 2026"],
    ["02", "Charlotte, NC", "JAN 2027"],
    ["03", "Phoenix, AZ", "FEB 2027"],
    ["04", "Milestone or event", "DATE"],
    ["05", "Milestone or event", "DATE"],
  ];
  rows.forEach(([n, t, d], i) => {
    const y = 2.3 + i * 0.85;
    s.addText(n, {
      x: 0.6, y, w: 0.7, h: 0.45, fontFace: MONO, fontSize: 14, bold: true,
      charSpacing: 3, color: PINK, margin: 0,
    });
    s.addText(t, {
      x: 1.5, y: y - 0.05, w: 8.0, h: 0.55, fontFace: DISPLAY, fontSize: 22,
      bold: true, color: NAVY, margin: 0,
    });
    s.addText(d, {
      x: 10.2, y, w: 2.5, h: 0.45, fontFace: MONO, fontSize: 13, bold: true,
      charSpacing: 2, color: STEEL, align: "right", margin: 0,
    });
    s.addShape("rect", {
      x: 0.6, y: y + 0.6, w: W - 1.2, h: 0.015,
      fill: { color: LINE }, line: { type: "none" },
    });
  });
  pageNo(s, 8, false);
  s.addNotes("TIMELINE — first three rows show the season-schedule style with real cities; rows 04–05 are placeholders. Add or delete rows with their divider lines.");
}

// ---- 9. FULL IMAGE -------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  card(s, 0.6, 0.6, W - 1.2, 5.35, { shadow: PINK, fill: LINE_DARK });
  s.addText("FULL-BLEED IMAGE HERE", {
    x: 0.6, y: 0.6, w: W - 1.2, h: 5.35, fontFace: MONO, fontSize: 13,
    bold: true, charSpacing: 3, color: STEEL_DARK, align: "center",
    valign: "middle",
  });
  s.addText("Caption or key takeaway for the image goes on this line.", {
    x: 0.6, y: 6.3, w: 10, h: 0.5, fontFace: BODY, fontSize: 14,
    color: CHALK, margin: 0,
  });
  pageNo(s, 9, true);
  s.addNotes("IMAGE SLIDE — replace the placeholder with an action photo. Keep the pink offset shadow.");
}

// ---- 10. QUOTE -----------------------------------------------------------
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
  pageNo(s, 10, false);
  s.addNotes("QUOTE — testimonial from a coach, parent, athlete, or partner. Get permission before quoting anyone.");
}

// ---- 11. THREE CARDS -----------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: CHALK };
  kicker(s, "Team · Offer · Pillars");
  s.addText("Three-Card Slide Title.", {
    x: 0.55, y: 0.85, w: 12, h: 1.0, fontFace: DISPLAY, fontSize: 40,
    bold: true, color: NAVY, margin: 0,
  });
  [0, 1, 2].forEach((i) => {
    const x = 0.6 + i * 4.15;
    card(s, x, 2.2, 3.9, 4.3);
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.3, y: 2.5, w: 1, h: 0.45, fontFace: MONO, fontSize: 14,
      bold: true, charSpacing: 3, color: PINK, margin: 0,
    });
    s.addText("Card Title", {
      x: x + 0.3, y: 3.0, w: 3.3, h: 0.55, fontFace: DISPLAY, fontSize: 22,
      bold: true, color: NAVY, margin: 0,
    });
    s.addText("Two or three sentences about this card. Keep each card roughly the same length so the row feels even.", {
      x: x + 0.3, y: 3.65, w: 3.3, h: 2.5, fontFace: BODY, fontSize: 13,
      color: STEEL, margin: 0, valign: "top",
    });
  });
  pageNo(s, 11, false);
  s.addNotes("THREE CARDS — team bios, offering pillars, package tiers. For bios, put a headshot above the name inside each card.");
}

// ---- 12. CLOSING ---------------------------------------------------------
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
  s.addNotes("CLOSING — swap the CTA line per audience (investors: the ask; partners: next step; education: where to learn more).");
}

pres.writeFile({ fileName: path.join(__dirname, "cfs-slides-template.pptx") }).then(() => {
  console.log("written collateral/cfs-slides-template.pptx");
});
