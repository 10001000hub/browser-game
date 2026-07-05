/**
 * ベスト記録エンジン検証。
 *
 * records.js は window.localStorage に依存するため、テスト内で最小の
 * localStorage スタブを globalThis.window に差し込んでから import する。
 * 「クリア時の残り時間が長いほど良い記録」という更新規則を回帰的に固定する。
 */
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// import 前に localStorage スタブを用意する（records.js は評価時に window を参照しうる）
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};

const { getBestRemainingMs, recordClear, formatRemaining } = await import(
  "../js/engine/records.js"
);

beforeEach(() => store.clear());

test("未記録の店舗×温度は null を返す", () => {
  assert.equal(getBestRemainingMs("github", "80"), null);
  assert.equal(getBestRemainingMs("github", "110"), null);
});

test("初回クリアは新記録として保存される", () => {
  const r = recordClear("github", "80", 252_000);
  assert.deepEqual(r, { isNewRecord: true, bestMs: 252_000, previousMs: null });
  assert.equal(getBestRemainingMs("github", "80"), 252_000);
});

test("残り時間が短い（＝悪い）クリアはベストを更新しない", () => {
  recordClear("github", "80", 252_000);
  const r = recordClear("github", "80", 100_000);
  assert.deepEqual(r, { isNewRecord: false, bestMs: 252_000, previousMs: 252_000 });
  assert.equal(getBestRemainingMs("github", "80"), 252_000);
});

test("残り時間が長い（＝良い）クリアはベストを更新する", () => {
  recordClear("github", "80", 252_000);
  const r = recordClear("github", "80", 260_500);
  assert.equal(r.isNewRecord, true);
  assert.equal(getBestRemainingMs("github", "80"), 260_500);
});

test("温度モードごとに記録は独立している", () => {
  recordClear("github", "80", 252_000);
  assert.equal(getBestRemainingMs("github", "110"), null);
  recordClear("github", "110", 38_000);
  assert.equal(getBestRemainingMs("github", "80"), 252_000);
  assert.equal(getBestRemainingMs("github", "110"), 38_000);
});

test("店舗ごとに記録は独立している", () => {
  recordClear("github", "80", 252_000);
  assert.equal(getBestRemainingMs("wsl", "80"), null);
});

test("負の残り時間は 0 にクランプして記録する", () => {
  const r = recordClear("github", "80", -5_000);
  assert.equal(r.bestMs, 0);
  assert.equal(getBestRemainingMs("github", "80"), 0);
});

test("壊れた localStorage データは null として扱う", () => {
  store.set("oregamasao.records.v1", "{broken");
  assert.equal(getBestRemainingMs("github", "80"), null);
});

test("formatRemaining は耐久リング表示に合わせて切り上げ m:ss を返す", () => {
  assert.equal(formatRemaining(252_000), "4:12");
  assert.equal(formatRemaining(38_000), "0:38");
  assert.equal(formatRemaining(60_000), "1:00");
  assert.equal(formatRemaining(0), "0:00");
  assert.equal(formatRemaining(1), "0:01"); // 端数は切り上げ
});
