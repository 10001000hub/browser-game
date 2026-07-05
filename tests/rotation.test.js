/**
 * 出題ローテーション（バッグ方式）検証。
 *
 * rotation.js は window.localStorage に依存するため、import 前に最小スタブを差し込む。
 * 「1周する間は同じ問題が二度出ない＝プール全体を重複なく巡回する」ことを回帰的に固定する。
 */
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};

const { nextQuizSet, resetRotation } = await import("../js/engine/rotation.js");
const { githubQuestions } = await import("../js/data/questions-github.js");

const POOL_ID = "github";
const correctIds = githubQuestions.filter((q) => q.isFakeMasaoCorrect === true).map((q) => q.id);
const incorrectIds = githubQuestions.filter((q) => q.isFakeMasaoCorrect === false).map((q) => q.id);

beforeEach(() => {
  store.clear();
  resetRotation(POOL_ID);
});

test("1回の出題は 正答3＋誤答7 の計10問", () => {
  const set = nextQuizSet(githubQuestions, POOL_ID);
  assert.equal(set.length, 10, "10問ではない");
  const c = set.filter((q) => q.isFakeMasaoCorrect === true).length;
  const i = set.filter((q) => q.isFakeMasaoCorrect === false).length;
  assert.equal(c, 3, "正答が3問でない");
  assert.equal(i, 7, "誤答が7問でない");
});

test("同一出題内に重複問題はない", () => {
  const set = nextQuizSet(githubQuestions, POOL_ID);
  const ids = set.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, "同一セット内で問題が重複している");
});

test("1周(正答3回/誤答3回分)でプール全体を重複なく巡回する", () => {
  // 正答9問÷3=3回、誤答21問÷7=3回で、ちょうど1周する
  const seenCorrect = [];
  const seenIncorrect = [];
  for (let i = 0; i < 3; i++) {
    const set = nextQuizSet(githubQuestions, POOL_ID);
    for (const q of set) {
      if (q.isFakeMasaoCorrect) seenCorrect.push(q.id);
      else seenIncorrect.push(q.id);
    }
  }
  // 3回で正答は9問・誤答は21問ぶん出題される
  assert.equal(seenCorrect.length, 9);
  assert.equal(seenIncorrect.length, 21);
  // 重複なく、プール全問がちょうど1回ずつ登場している
  assert.deepEqual(new Set(seenCorrect), new Set(correctIds), "正答プールを1周で網羅していない");
  assert.deepEqual(new Set(seenIncorrect), new Set(incorrectIds), "誤答プールを1周で網羅していない");
  assert.equal(new Set(seenCorrect).size, 9, "正答に重複がある");
  assert.equal(new Set(seenIncorrect).size, 21, "誤答に重複がある");
});

test("連続する2回の出題は（十分大きいプールでは）異なる問題集合になる", () => {
  const a = nextQuizSet(githubQuestions, POOL_ID).map((q) => q.id).sort();
  const b = nextQuizSet(githubQuestions, POOL_ID).map((q) => q.id).sort();
  assert.notDeepEqual(a, b, "連続2回で完全に同じ問題集合になった（ローテーションできていない）");
});

test("ローテーション状態はlocalStorageに永続化され、次の出題で継続する", () => {
  nextQuizSet(githubQuestions, POOL_ID);
  const saved = store.get("oregamasao.rotation.v1." + POOL_ID);
  assert.ok(saved, "ローテーション状態が保存されていない");
  const bags = JSON.parse(saved);
  // 正答9−3=6問、誤答21−7=14問が残りキューに残る
  assert.equal(bags.correct.length, 6, "正答の残りキューが想定外");
  assert.equal(bags.incorrect.length, 14, "誤答の残りキューが想定外");
});
