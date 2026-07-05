/**
 * quizPicker 単体テスト（DOM非依存）。
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  shuffleArray,
  selectTenQuestions,
  isCorrectChoice,
} from "../js/engine/quizPicker.js";

/** テスト用の最小プールを生成する。 */
function makePool(correctCount, incorrectCount) {
  const pool = [];
  for (let i = 0; i < correctCount; i++) {
    pool.push({ id: `c${i}`, isFakeMasaoCorrect: true, correctChoice: "正しい" });
  }
  for (let i = 0; i < incorrectCount; i++) {
    pool.push({ id: `x${i}`, isFakeMasaoCorrect: false, correctChoice: `理由${i}` });
  }
  return pool;
}

test("shuffleArray: 元配列を破壊せず、同じ要素集合を返す", () => {
  const original = [1, 2, 3, 4, 5];
  const copy = original.slice();
  const shuffled = shuffleArray(original);

  assert.deepEqual(original, copy, "元配列が変更されている");
  assert.equal(shuffled.length, original.length);
  assert.notEqual(shuffled, original, "同一参照を返している");
  assert.deepEqual(shuffled.slice().sort(), copy.slice().sort(), "要素集合が変化");
});

test("shuffleArray: 空配列・単一要素でも壊れない", () => {
  assert.deepEqual(shuffleArray([]), []);
  assert.deepEqual(shuffleArray([7]), [7]);
});

test("selectTenQuestions: 十分なプールから重複なく10問を選ぶ", () => {
  const pool = makePool(9, 21); // GitHub店と同じ内訳
  const picked = selectTenQuestions(pool);

  assert.equal(picked.length, 10);
  assert.equal(new Set(picked.map((q) => q.id)).size, 10, "重複がある");
  const poolIds = new Set(pool.map((q) => q.id));
  assert.ok(picked.every((q) => poolIds.has(q.id)), "プール外の要素が混入");
});

test("selectTenQuestions: 内訳が足りれば正3問・誤7問を厳守する", () => {
  const pool = makePool(9, 21);
  for (let trial = 0; trial < 30; trial++) {
    const picked = selectTenQuestions(pool);
    const correct = picked.filter((q) => q.isFakeMasaoCorrect).length;
    const incorrect = picked.length - correct;
    assert.equal(correct, 3, "正しい発言が3問でない");
    assert.equal(incorrect, 7, "誤り発言が7問でない");
  }
});

test("selectTenQuestions: 正解プールが不足したら誤答で補充する", () => {
  const pool = makePool(1, 20); // 正1・誤20
  const picked = selectTenQuestions(pool);
  assert.equal(picked.length, 10);
  const correct = picked.filter((q) => q.isFakeMasaoCorrect).length;
  assert.equal(correct, 1, "不足分は誤答で補い、ある正解は使い切る");
});

test("selectTenQuestions: プール総数が10未満ならある分だけ返す（クラッシュしない）", () => {
  const pool = makePool(2, 3); // 計5問
  const picked = selectTenQuestions(pool);
  assert.equal(picked.length, 5);
  assert.equal(new Set(picked.map((q) => q.id)).size, 5);
});

test("isCorrectChoice: 正解文字列と厳密一致のみ true", () => {
  const q = { correctChoice: "正しい" };
  assert.equal(isCorrectChoice(q, "正しい"), true);
  assert.equal(isCorrectChoice(q, "正しい "), false, "前後空白は不一致扱い");
  assert.equal(isCorrectChoice(q, "間違い"), false);
});
