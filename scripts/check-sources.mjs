#!/usr/bin/env node
/**
 * 出典の点検。
 *
 * 全店舗の問題の出典（sourceMemo）から URL を集め、次の2つを調べる。
 *   1. リンク切れ … 開けない（4xx / 5xx / 通信エラー）URL
 *   2. 本文の変化 … 前回の控え（data/source-snapshots.json）から本文が変わった URL
 * 変わった URL を出典にしている問題の id も一緒に報告する。
 *
 * AI や有料 API は呼ばない。公式ページを GET するだけ。
 *
 * 使い方:
 *   node scripts/check-sources.mjs                 点検して結果を表示
 *   node scripts/check-sources.mjs --report r.md   結果を Markdown でも書き出す
 *   node scripts/check-sources.mjs --update        今の本文を控えとして保存する
 *   node scripts/check-sources.mjs --only <url>    指定 URL だけ調べる（問題を書くときの確認用）
 *
 * 終了コード: 0=問題なし / 1=リンク切れあり / 2=本文の変化のみ
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SNAPSHOT_PATH = path.join(ROOT, "data", "source-snapshots.json");

const REPO_URL =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
    : "https://github.com/10001000hub/browser-game";

const URL_RE = /https:\/\/[^\s）)」』、,]+/g;

/** 出典の文字列から URL を取り出す（末尾の句読点は落とす）。 */
export function extractUrls(sourceMemo) {
  return (sourceMemo.match(URL_RE) || []).map((u) => u.replace(/[.。]+$/, ""));
}

/** URL → その URL を出典にしている問題 id の一覧。 */
export function collectSources(questionPools) {
  const map = new Map();
  for (const pool of Object.values(questionPools)) {
    for (const q of pool) {
      for (const url of extractUrls(q.sourceMemo)) {
        if (!map.has(url)) map.set(url, []);
        map.get(url).push(q.id);
      }
    }
  }
  return map;
}

/**
 * HTML から本文の文字だけを取り出して正規化する。
 * script / style / ナビゲーションなど、本文と関係なく変わりやすい部分は捨てる。
 */
export function normalizeText(html) {
  let body = html;
  const main = html.match(/<main[\s\S]*?<\/main>/i) || html.match(/<article[\s\S]*?<\/article>/i);
  if (main) body = main[0];
  return body
    .replace(/<(script|style|noscript|svg|nav|header|footer)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashText(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

/**
 * 点検結果と控えを突き合わせ、リンク切れ・本文の変化・新しく加わった URL に分ける。
 * @param {Map<string,string[]>} sources
 * @param {Record<string,{status:number,finalUrl?:string,hash?:string,error?:string}>} results
 * @param {Record<string,{hash:string}>} snapshots
 */
export function classify(sources, results, snapshots) {
  const broken = [];
  const changed = [];
  const added = [];
  for (const [url, ids] of sources) {
    const r = results[url];
    if (!r) continue;
    if (r.error || r.status >= 400) {
      broken.push({ url, ids, status: r.status, error: r.error });
      continue;
    }
    const prev = snapshots[url];
    if (!prev) added.push({ url, ids });
    else if (prev.hash !== r.hash) changed.push({ url, ids });
  }
  return { broken, changed, added };
}

/** GitHub の Issue に貼る Markdown。同じ内容かどうかを見分ける印を先頭に入れる。 */
export function renderReport({ broken, changed, added }, checkedAt) {
  const lines = [];
  const body = [];
  if (broken.length) {
    body.push("## 開けない出典（リンク切れ）", "");
    for (const b of broken) {
      body.push(`- ${b.url} — ${b.error || `HTTP ${b.status}`}`, `  - 使っている問題: ${b.ids.join(", ")}`);
    }
    body.push("");
  }
  if (changed.length) {
    body.push("## 本文が変わった出典", "");
    body.push("公式ページの内容が前回の控えから変わりました。問題と解説がまだ正しいかを確かめてください。", "");
    for (const c of changed) {
      body.push(`- ${c.url}`, `  - 確かめる問題: ${c.ids.join(", ")}`);
    }
    body.push("");
  }
  if (added.length) {
    body.push("## 控えがまだ無い出典", "");
    for (const a of added) body.push(`- ${a.url}（${a.ids.join(", ")}）`);
    body.push("");
  }
  if (!body.length) body.push("すべての出典が開けて、本文の変化もありませんでした。");
  const digest = hashText(body.join("\n"));
  lines.push(`<!-- source-watch:${digest} -->`, `# 出典の点検（${checkedAt}）`, "", ...body);
  lines.push(
    "",
    `直し方は [docs/MAINTENANCE.md](${REPO_URL}/blob/main/docs/MAINTENANCE.md) を参照。問題を確かめ終えたら \`node scripts/check-sources.mjs --update\` で控えを更新してください。`,
  );
  return { markdown: lines.join("\n"), digest };
}

async function fetchOne(url, { timeoutMs = 20000, retries = 1 } = {}) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "user-agent": "neppa-ronpa-source-watch (+https://github.com/10001000hub/browser-game)",
          accept: "text/html,application/xhtml+xml",
        },
      });
      const text = res.ok ? await res.text() : "";
      return {
        status: res.status,
        finalUrl: res.url !== url ? res.url : undefined,
        hash: res.ok ? hashText(normalizeText(text)) : undefined,
      };
    } catch (err) {
      if (attempt >= retries) return { status: 0, error: String(err && err.message ? err.message : err) };
    }
  }
}

async function fetchAll(urls, concurrency = 4) {
  const results = {};
  const queue = [...urls];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const url = queue.shift();
      results[url] = await fetchOne(url);
    }
  });
  await Promise.all(workers);
  return results;
}

async function readSnapshots() {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function main(argv) {
  const args = new Set(argv);
  const valueOf = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };

  const { questionPools } = await import("../js/data/questionPools.js");
  let sources = collectSources(questionPools);
  const only = valueOf("--only");
  if (only) sources = new Map([[only, sources.get(only) || []]]);

  const results = await fetchAll([...sources.keys()]);
  for (const [url, r] of Object.entries(results)) {
    const mark = r.error || r.status >= 400 ? "NG" : "OK";
    const extra = r.error ? ` ${r.error}` : r.finalUrl ? ` → ${r.finalUrl}` : "";
    console.log(`${mark} ${r.status} ${url}${extra}`);
  }

  const snapshots = await readSnapshots();
  const checkedAt = new Date().toISOString().slice(0, 10);

  if (args.has("--update")) {
    const next = { ...snapshots };
    for (const [url, r] of Object.entries(results)) {
      if (r.hash) next[url] = { hash: r.hash, checkedAt };
    }
    // 出典から外れた URL は控えからも外す（--only のときは消さない）
    if (!only) for (const url of Object.keys(next)) if (!sources.has(url)) delete next[url];
    const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
    await writeFile(SNAPSHOT_PATH, JSON.stringify(sorted, null, 2) + "\n");
    console.log(`控えを更新しました: ${path.relative(ROOT, SNAPSHOT_PATH)}`);
  }

  const summary = classify(sources, results, args.has("--update") ? { ...snapshots, ...Object.fromEntries(Object.entries(results).filter(([, r]) => r.hash).map(([u, r]) => [u, { hash: r.hash }])) } : snapshots);
  const { markdown } = renderReport(summary, checkedAt);
  const reportPath = valueOf("--report");
  if (reportPath) await writeFile(reportPath, markdown + "\n");

  console.log(
    `\n出典 ${sources.size} 件 / リンク切れ ${summary.broken.length} / 本文の変化 ${summary.changed.length} / 控えなし ${summary.added.length}`,
  );
  if (summary.broken.length) return 1;
  if (summary.changed.length || summary.added.length) return 2;
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}
