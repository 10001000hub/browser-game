/**
 * 問題データ検証。全店舗プールをパラメータ化して回帰的に検証する。
 * 新店舗のプールを tests/helpers/pools.js に登録すると自動で検証対象になる。
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { stores } from "../js/data/stores.js";
import { questionPools } from "./helpers/pools.js";
import { questionPools as productionQuestionPools } from "../js/data/questionPools.js";

const DIFFICULTIES = new Set(["easy", "normal", "hard"]);
const REQUIRED_STRING_FIELDS = [
  "id",
  "storeId",
  "topic",
  "difficulty",
  "rivalLine",
  "questionText",
  "correctChoice",
  "successLine",
  "failureLine",
  "reviewExplanation",
  "sourceMemo",
];

/** available な店舗は必ずプールを持たねばならない（起動時に空プールで詰むのを防ぐ）。 */
test("available な全店舗に出題プールが登録されている", () => {
  for (const store of stores) {
    if (store.status !== "available") continue;
    const pool = questionPools[store.questionPoolId];
    assert.ok(
      Array.isArray(pool),
      `店舗「${store.displayName}」(pool=${store.questionPoolId}) のプールが未登録`,
    );
    assert.ok(
      pool.length >= 10,
      `店舗「${store.displayName}」のプールは10問未満 (${pool.length}問): 抽選が成立しない`,
    );
  }
});

/**
 * js/main.js が実際に import する本番レジストリ（js/data/questionPools.js）に対して、
 * 配線漏れが無いかを直接検証する。tests/helpers/pools.js は本番の再エクスポートに
 * すぎないため上のテストと重複して見えるが、こちらは本番ファイルそのものを対象に
 * することで、テスト側の配線ミスとは独立に本番の欠落を検知できる。
 */
test("本番レジストリ（js/data/questionPools.js）に available な全店舗のプールが登録されている", () => {
  for (const store of stores) {
    if (store.status !== "available") continue;
    const pool = productionQuestionPools[store.questionPoolId];
    assert.ok(
      Array.isArray(pool) && pool.length > 0,
      `店舗「${store.displayName}」(pool=${store.questionPoolId}) の本番プールが未登録または空`,
    );
  }
});

for (const [poolId, pool] of Object.entries(questionPools)) {
  const store = stores.find((s) => s.questionPoolId === poolId);

  test(`[${poolId}] プールが stores.js のエントリと対応している`, () => {
    assert.ok(store, `pool "${poolId}" に対応する店舗が stores.js に存在しない`);
  });

  test(`[${poolId}] 各問題が必須フィールドと制約を満たす`, () => {
    assert.ok(Array.isArray(pool) && pool.length > 0, "プールが空");

    const seenIds = new Set();
    pool.forEach((q, i) => {
      const where = `${poolId}#${i} (id=${q && q.id})`;

      for (const field of REQUIRED_STRING_FIELDS) {
        assert.equal(
          typeof q[field],
          "string",
          `${where}: ${field} が文字列でない`,
        );
        assert.notEqual(q[field].trim(), "", `${where}: ${field} が空文字`);
      }

      assert.ok(!seenIds.has(q.id), `${where}: id が重複`);
      seenIds.add(q.id);

      if (store) {
        assert.equal(q.storeId, store.id, `${where}: storeId が店舗idと不一致`);
      }

      assert.ok(DIFFICULTIES.has(q.difficulty), `${where}: 不正な difficulty "${q.difficulty}"`);

      assert.ok(Array.isArray(q.choices), `${where}: choices が配列でない`);
      assert.equal(q.choices.length, 4, `${where}: choices は4択でない (${q.choices.length})`);
      assert.equal(
        new Set(q.choices).size,
        4,
        `${where}: choices に重複がある`,
      );
      assert.ok(q.choices.includes("正しい"), `${where}: choices に「正しい」が無い`);
      assert.ok(
        q.choices.includes(q.correctChoice),
        `${where}: correctChoice が choices に含まれない`,
      );

      assert.equal(
        typeof q.isRivalCorrect,
        "boolean",
        `${where}: isRivalCorrect が真偽値でない`,
      );
      if (q.isRivalCorrect === true) {
        assert.equal(
          q.correctChoice,
          "正しい",
          `${where}: 発言が正しいのに correctChoice が「正しい」でない`,
        );
      } else {
        assert.notEqual(
          q.correctChoice,
          "正しい",
          `${where}: 発言が誤りなのに correctChoice が「正しい」`,
        );
      }
    });
  });
}

/**
 * 選択肢の長さで正解が見抜けないこと。
 * ゴウが間違っている問題では、正解（どこが違うかの指摘）が一番長い文になりがち。
 * 長い選択肢を選ぶだけで勝ててしまうと学習にならないので、店ごとに割合で縛る。
 */
const MAX_LONGEST_RATIO = 0.4; // 3つの指摘候補から偶然に最長になる割合（約1/3）に余裕を持たせた上限
const MIN_DISTRACTOR_RATIO = 0.5; // 誤りの選択肢は正解の半分以上の長さ（短すぎる「捨て選択肢」を防ぐ）

for (const [poolId, pool] of Object.entries(questionPools)) {
  test(`[${poolId}] 選択肢の長さで正解が見抜けない`, () => {
    const rivalWrong = pool.filter((q) => !q.isRivalCorrect);
    let longest = 0;
    let shortest = 0;
    for (const q of rivalWrong) {
      const correctLen = q.correctChoice.length;
      const others = q.choices.filter((c) => c !== "正しい" && c !== q.correctChoice);
      if (others.every((c) => c.length < correctLen)) longest += 1;
      if (others.every((c) => c.length > correctLen)) shortest += 1;
      for (const c of others) {
        assert.ok(
          c.length >= correctLen * MIN_DISTRACTOR_RATIO,
          `${q.id}: 誤りの選択肢が短すぎる（${c.length}字 < 正解${correctLen}字の半分）「${c}」`,
        );
      }
    }
    const ratio = longest / rivalWrong.length;
    assert.ok(
      ratio <= MAX_LONGEST_RATIO,
      `正解が一番長い問題が ${longest}/${rivalWrong.length} 問（${Math.round(ratio * 100)}%）。上限は ${MAX_LONGEST_RATIO * 100}%`,
    );
    // 逆に「一番短いのが正解」という癖も付けない
    assert.ok(
      shortest / rivalWrong.length <= MAX_LONGEST_RATIO,
      `正解が一番短い問題が ${shortest}/${rivalWrong.length} 問。上限は ${MAX_LONGEST_RATIO * 100}%`,
    );
  });

  test(`[${poolId}] 出典に公式ページの URL がある`, () => {
    for (const q of pool) {
      assert.match(q.sourceMemo, /https:\/\/\S+/, `${q.id}: 出典に https の URL が無い`);
    }
  });
}
