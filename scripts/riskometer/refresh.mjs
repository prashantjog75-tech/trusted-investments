#!/usr/bin/env node
/**
 * Monthly riskometer refresh (run by .github/workflows/riskometer-refresh.yml, never at site runtime).
 * Official source -> fetch -> parse -> exact-name match to the public fund snapshot -> merge -> write
 * src/lib/fund-data/riskometer-data.ts. Failed sources and unmatched rows never overwrite existing values.
 * Requires `pdftotext` (poppler-utils).
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SNAPSHOT = join(root, "src/lib/fund-data/amfi-snapshot.ts");
const OUT = join(root, "src/lib/fund-data/riskometer-data.ts");
const { sources } = JSON.parse(readFileSync(join(root, "scripts/riskometer/sources.json"), "utf8"));

const LEVELS = ["Low", "Low to Moderate", "Moderate", "Moderately High", "High", "Very High"];
const LEVEL_RE = /(Low to Moderate|Moderately High|Very High|Moderate|High|Low)(?: Risk)?/gi;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const normalize = (s) => s.replace(/\(\s*formerly[^)]*\)/gi, " ").toLowerCase().replace(/flexicap/g, "flexi cap").replace(/&/g, " and ").replace(/[’'`.]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const canonLevel = (s) => LEVELS.find((l) => l.toLowerCase() === s.toLowerCase().replace(/ risk$/, ""));

function publicFunds() {
  const text = readFileSync(SNAPSHOT, "utf8");
  const match = text.match(/const rows[^=]*=\s*(\[[\s\S]*?\]);\n/);
  if (!match) throw new Error("Could not read public snapshot rows");
  const byAmc = new Map();
  for (const [amc, name] of JSON.parse(match[1])) {
    if (!byAmc.has(amc)) byAmc.set(amc, new Map());
    byAmc.get(amc).set(normalize(name), name);
  }
  return byAmc;
}

function readExisting() {
  try {
    const text = readFileSync(OUT, "utf8");
    const m = text.match(/\/\* DATA-START \*\/([\s\S]*?)\/\* DATA-END \*\//);
    return m ? JSON.parse(m[1]) : [];
  } catch { return []; }
}

function candidateUrls(src, now = new Date()) {
  if (!src.urlTemplate) return [src.url];
  const urls = [];
  for (let back = 1; back <= 12; back += 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 1));
    const y = d.getUTCFullYear(), m = d.getUTCMonth();
    urls.push(src.urlTemplate.replace("{Mon}", MONTHS[m]).replace("{MM}", String(m + 1).padStart(2, "0")).replace("{YYYY}", String(y)).replace("{YY}", String(y).slice(2)));
  }
  if (src.url && !urls.includes(src.url)) urls.push(src.url);
  return urls;
}

async function fetchPdfText(url, dir) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (riskometer-refresh; official disclosure reader)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("Response is not a PDF");
  const file = join(dir, "src.pdf");
  writeFileSync(file, buf);
  return execFileSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function parseAsOf(text) {
  const m = text.match(/as (?:on|at) ([A-Z][a-z]{2,8})\.? (\d{1,2}), (\d{4})/);
  if (!m) return null;
  const idx = MONTHS.findIndex((mon) => m[1].startsWith(mon));
  if (idx < 0) return null;
  return `${m[3]}-${String(idx + 1).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

function parseTable(text, levelColumn) {
  const rows = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*\d{1,3}\.?\s+(.+?)\s{2,}(.*)$/);
    if (!m) continue;
    const levels = [...m[2].matchAll(LEVEL_RE)].map((x) => canonLevel(x[1])).filter(Boolean);
    const level = levels[levelColumn];
    if (level) rows.push({ scheme: m[1].trim(), level });
  }
  return rows;
}

async function main() {
  const funds = publicFunds();
  const existing = readExisting();
  const merged = new Map(existing.map((e) => [`${e.amc}\u0000${e.fund}`, e]));
  const report = { sources: [], unmatched: [], updated: 0 };
  const dir = mkdtempSync(join(tmpdir(), "rom-"));

  for (const src of sources) {
    if (!src.enabled) { report.sources.push({ id: src.id, status: "disabled", reason: src.reason }); continue; }
    const amcFunds = funds.get(src.amc);
    if (!amcFunds) { report.sources.push({ id: src.id, status: "skipped", reason: "AMC not in public allowlist" }); continue; }
    let done = false; const errors = [];
    for (const url of candidateUrls(src)) {
      try {
        const text = await fetchPdfText(url, dir);
        const asOf = parseAsOf(text);
        if (!asOf) throw new Error("No 'as on <date>' found");
        const rows = parseTable(text, src.levelColumn ?? 0);
        if (rows.length === 0) throw new Error("No riskometer rows parsed");
        let matched = 0;
        for (const row of rows) {
          const fund = amcFunds.get(normalize(row.scheme));
          if (!fund) { report.unmatched.push({ amc: src.amc, scheme: row.scheme, level: row.level, source: url }); continue; }
          const key = `${src.amc}\u0000${fund}`;
          const prev = merged.get(key);
          if (prev && prev.asOf > asOf) continue; // never replace newer verified data with older
          if (!prev || prev.level !== row.level || prev.asOf !== asOf || prev.sourceUrl !== url) report.updated += 1;
          merged.set(key, { amc: src.amc, fund, level: row.level, asOf, sourceUrl: url });
          matched += 1;
        }
        report.sources.push({ id: src.id, status: "ok", url, asOf, parsed: rows.length, matched });
        done = true; break;
      } catch (err) { errors.push(`${url}: ${err.message}`); }
    }
    if (!done) report.sources.push({ id: src.id, status: "failed", errors, note: "Existing verified values retained" });
  }

  // Link check: every stored source URL must still open as a PDF (no redirects). Entries whose official
  // source no longer resolves are dropped so the site shows the "not yet available" fallback, never a dead link.
  // A network-wide failure (all checks fail) aborts instead, preserving the last verified dataset.
  const urlOk = new Map();
  for (const url of new Set([...merged.values()].map((e) => e.sourceUrl))) {
    try {
      const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (riskometer-refresh; link check)" } });
      const head = Buffer.from(await res.arrayBuffer()).subarray(0, 4).toString();
      urlOk.set(url, res.ok && head === "%PDF");
    } catch { urlOk.set(url, false); }
  }
  if (urlOk.size > 0 && ![...urlOk.values()].some(Boolean)) throw new Error("All source link checks failed; keeping existing data");
  report.broken = [...urlOk].filter(([, ok]) => !ok).map(([u]) => u);
  for (const [key, e] of merged) if (!urlOk.get(e.sourceUrl)) merged.delete(key);

  const entries = [...merged.values()].sort((a, b) => a.amc.localeCompare(b.amc) || a.fund.localeCompare(b.fund));
  const body = `// GENERATED by scripts/riskometer/refresh.mjs from official riskometer disclosures. Do not edit by hand.\n// Each entry: scheme-level risk level, as-of (portfolio) date and the official source URL.\nimport type { RiskometerEntry } from "./riskometer";\n\nexport const RISKOMETER_ENTRIES: readonly RiskometerEntry[] = /* DATA-START */${JSON.stringify(entries, null, 1)}/* DATA-END */;\n`;
  let before = ""; try { before = readFileSync(OUT, "utf8"); } catch {}
  if (before !== body) writeFileSync(OUT, body);

  const summary = [
    `## Riskometer refresh`, `Verified schemes in dataset: ${entries.length}`, `Changed this run: ${report.updated}`, ``,
    `### Sources`, ...report.sources.map((s) => `- ${s.id}: ${s.status}${s.asOf ? ` (as of ${s.asOf}, ${s.matched}/${s.parsed} matched)` : ""}${s.reason ? ` - ${s.reason}` : ""}${s.errors ? ` - ${s.errors.join("; ")}` : ""}`),
    ``, `### Broken source links removed - ${report.broken.length}`, ...report.broken.map((u) => `- ${u}`),
    ``, `### Unmatched rows (not stored; need manual verification) - ${report.unmatched.length}`, ...report.unmatched.map((u) => `- ${u.amc}: ${u.scheme} (${u.level})`),
  ].join("\n");
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
