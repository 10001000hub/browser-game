/**
 * 出題プールからの10問抽選ロジック。
 * DOM非依存（Node環境でも import・単体テスト可能）。
 */

const TARGET_CORRECT = 3;
const TARGET_INCORRECT = 7;

/**
 * 破壊的変更を避けるため配列をコピーしてからシャッフルする
 * @template T
 * @param {T[]} array
 * @returns {T[]} シャッフルされた新しい配列
 */
export function shuffleArray(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * プールから出題順に並んだ10問（正しい発言3問＋間違い発言7問、内訳不足時はフォールバック補充）を選ぶ。
 * @param {import('../data/questions-github.js').GithubQuestion[]} pool
 * @returns {import('../data/questions-github.js').GithubQuestion[]}
 */
export function selectTenQuestions(pool) {
  const correctPool = pool.filter((q) => q.isFakeMasaoCorrect === true);
  const incorrectPool = pool.filter((q) => q.isFakeMasaoCorrect === false);

  let takeCorrect = Math.min(TARGET_CORRECT, correctPool.length);
  let takeIncorrect = Math.min(TARGET_INCORRECT, incorrectPool.length);

  let shortfall = (TARGET_CORRECT + TARGET_INCORRECT) - (takeCorrect + takeIncorrect);
  if (shortfall > 0) {
    const correctRemaining = correctPool.length - takeCorrect;
    const incorrectRemaining = incorrectPool.length - takeIncorrect;

    const fromIncorrect = Math.min(shortfall, incorrectRemaining);
    takeIncorrect += fromIncorrect;
    shortfall -= fromIncorrect;

    const fromCorrect = Math.min(shortfall, correctRemaining);
    takeCorrect += fromCorrect;
    shortfall -= fromCorrect;

    if (shortfall > 0) {
      console.warn(`[quizPicker] プール不足のため${shortfall}問が欠けた状態で出題します`);
    }
  }

  const pickedCorrect = shuffleArray(correctPool).slice(0, takeCorrect);
  const pickedIncorrect = shuffleArray(incorrectPool).slice(0, takeIncorrect);

  const combined = [...pickedCorrect, ...pickedIncorrect];
  return shuffleArray(combined);
}

/**
 * クリックされた選択肢テキストが正解と厳密一致するか判定する（インデックス不使用）。
 * @param {{ correctChoice: string }} question
 * @param {string} clickedText
 * @returns {boolean}
 */
export function isCorrectChoice(question, clickedText) {
  return clickedText === question.correctChoice;
}
