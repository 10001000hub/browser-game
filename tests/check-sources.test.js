/**
 * 出典の点検（scripts/check-sources.mjs）の検証。
 * ネットには出ない。取り出し・正規化・仕分け・報告の組み立てだけを確かめる。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  extractUrls,
  collectSources,
  normalizeText,
  hashText,
  classify,
  renderReport,
  SNAPSHOT_PATH,
} from "../scripts/check-sources.mjs";
import { questionPools } from "../js/data/questionPools.js";

test("extractUrls: 複数の URL を取り出し、末尾の句読点と全角括弧を落とす", () => {
  const memo = "A https://example.com/a / B（https://example.com/b）。C https://example.com/c.";
  assert.deepEqual(extractUrls(memo), ["https://example.com/a", "https://example.com/b", "https://example.com/c"]);
});

test("collectSources: 同じ URL を使う問題 id をまとめる", () => {
  const pools = {
    x: [
      { id: "x-1", sourceMemo: "https://example.com/a" },
      { id: "x-2", sourceMemo: "https://example.com/a / https://example.com/b" },
    ],
  };
  const map = collectSources(pools);
  assert.deepEqual(map.get("https://example.com/a"), ["x-1", "x-2"]);
  assert.deepEqual(map.get("https://example.com/b"), ["x-2"]);
});

test("normalizeText: main の本文だけを見て、script・nav・空白の揺れを無視する", () => {
  const a = "<html><nav>menu 1</nav><main><h1>Title</h1><script>x=1</script><p>Body&nbsp;text</p></main></html>";
  const b = "<html><nav>menu 2</nav><main>\n<h1>Title</h1>  <script>x=2</script><p>Body text</p>\n</main></html>";
  assert.equal(normalizeText(a), "Title Body text");
  assert.equal(hashText(normalizeText(a)), hashText(normalizeText(b)));
});

test("classify: リンク切れ・本文の変化・控えなしに仕分ける", () => {
  const sources = new Map([
    ["https://e/ok", ["q1"]],
    ["https://e/changed", ["q2"]],
    ["https://e/new", ["q3"]],
    ["https://e/404", ["q4"]],
    ["https://e/err", ["q5"]],
  ]);
  const results = {
    "https://e/ok": { status: 200, hash: "h1" },
    "https://e/changed": { status: 200, hash: "h2b" },
    "https://e/new": { status: 200, hash: "h3" },
    "https://e/404": { status: 404 },
    "https://e/err": { status: 0, error: "timeout" },
  };
  const snapshots = { "https://e/ok": { hash: "h1" }, "https://e/changed": { hash: "h2a" } };
  const { broken, changed, added } = classify(sources, results, snapshots);
  assert.deepEqual(broken.map((b) => b.url), ["https://e/404", "https://e/err"]);
  assert.deepEqual(changed, [{ url: "https://e/changed", ids: ["q2"] }]);
  assert.deepEqual(added, [{ url: "https://e/new", ids: ["q3"] }]);
});

test("renderReport: 同じ中身なら日付が違っても印（digest）が同じ", () => {
  const summary = { broken: [], changed: [{ url: "https://e/c", ids: ["q2"] }], added: [] };
  const r1 = renderReport(summary, "2026-01-01");
  const r2 = renderReport(summary, "2026-01-02");
  assert.equal(r1.digest, r2.digest);
  assert.match(r1.markdown, /^<!-- source-watch:[0-9a-f]{16} -->/);
  assert.match(r1.markdown, /確かめる問題: q2/);
});

test("控えのファイルが、今の全出典 URL をちょうど覆っている", () => {
  const snapshots = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
  const urls = [...collectSources(questionPools).keys()].sort();
  assert.deepEqual(Object.keys(snapshots).sort(), urls, "出典を足したら node scripts/check-sources.mjs --update で控えを更新する");
});
