/**
 * 問題データ検証。全店舗プールをパラメータ化して回帰的に検証する。
 * 新店舗のプールを tests/helpers/pools.js に登録すると自動で検証対象になる。
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { stores } from "../js/data/stores.js";
import { questionPools } from "./helpers/pools.js";

const DIFFICULTIES = new Set(["easy", "normal", "hard"]);
const REQUIRED_STRING_FIELDS = [
  "id",
  "storeId",
  "topic",
  "difficulty",
  "fakeMasaoLine",
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
        typeof q.isFakeMasaoCorrect,
        "boolean",
        `${where}: isFakeMasaoCorrect が真偽値でない`,
      );
      if (q.isFakeMasaoCorrect === true) {
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
