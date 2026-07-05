/**
 * 出題ローテーション（バッグ方式）。
 *
 * 正答プール・誤答プールそれぞれを「1周分の未出題キュー」として localStorage に保持し、
 * 前から引く。キューが空になったらシャッフルして次の周を作る。これにより
 *   - 1周する間は同じ問題が二度出ない（＝ちゃんとローテーションする）
 *   - リロードしてもローテーションが途切れず継続する
 * という挙動になる。正答3問・誤答7問の比率は selectTenQuestions と同じく維持する。
 *
 * DOM非依存（window.localStorage のみ参照。非対応環境ではメモリ内で1回分だけ成立）。
 */
import { shuffleArray } from "./quizPicker.js";

const STORAGE_PREFIX = "oregamasao.rotation.v1.";
const TARGET_CORRECT = 3;
const TARGET_INCORRECT = 7;

/**
 * 保存済みバッグ（残りキュー）を読む。未保存・破損・非対応時は null。
 * @param {string} poolId
 * @returns {{ correct: string[], incorrect: string[] }|null}
 */
function readBags(poolId) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + poolId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.correct) && Array.isArray(parsed.incorrect)) {
      return { correct: parsed.correct, incorrect: parsed.incorrect };
    }
  } catch (_e) {
    /* 破損データは無視して初期化 */
  }
  return null;
}

/**
 * バッグ（残りキュー）を保存する。非対応/拒否時は諦める（例外は投げない）。
 * @param {string} poolId
 * @param {{ correct: string[], incorrect: string[] }} bags
 */
function writeBags(poolId, bags) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + poolId, JSON.stringify(bags));
  } catch (_e) {
    /* localStorage 非対応/拒否時は永続化を諦める（その回はランダム相当になる） */
  }
}

/**
 * バッグ（未出題キュー）から need 件引く。空になったら allIds をシャッフルして次周を補充。
 * 補充時は同一ゲーム内で既に引いた id を避け、1セット内での重複を防ぐ
 * （プールサイズが need より大きい場合のみ回避可能）。
 * @param {string[]} bag - 現在の残りキュー
 * @param {string[]} allIds - このカテゴリの全 id
 * @param {number} need - 引きたい件数
 * @returns {{ picked: string[], bag: string[] }}
 */
function drawFromBag(bag, allIds, need) {
  let queue = bag.slice();
  const picked = [];
  while (picked.length < need && allIds.length > 0) {
    if (queue.length === 0) {
      let refill = shuffleArray(allIds);
      if (allIds.length > need) {
        const taken = new Set(picked);
        const filtered = refill.filter((id) => !taken.has(id));
        refill = filtered.length > 0 ? filtered : refill;
      }
      queue = refill;
    }
    picked.push(queue.shift());
  }
  return { picked, bag: queue };
}

/**
 * 次に出題する10問（正答3＋誤答7、内訳不足時は他カテゴリで補充）をローテーションで選ぶ。
 * バッグの残りを localStorage に書き戻すため、呼ぶたびに1周を消費して進む。
 * @param {import('../data/questions-github.js').GithubQuestion[]} pool
 * @param {string} poolId - localStorage キーを分けるための出題プール識別子
 * @returns {import('../data/questions-github.js').GithubQuestion[]} 表示順にシャッフル済みの10問
 */
export function nextQuizSet(pool, poolId) {
  const correctPool = pool.filter((q) => q.isFakeMasaoCorrect === true);
  const incorrectPool = pool.filter((q) => q.isFakeMasaoCorrect === false);
  const correctIds = correctPool.map((q) => q.id);
  const incorrectIds = incorrectPool.map((q) => q.id);

  const stored = readBags(poolId) || { correct: [], incorrect: [] };
  // プール変更（問題の追加・削除）に追従: 現存しない id は残りキューから除去する
  const correctSet = new Set(correctIds);
  const incorrectSet = new Set(incorrectIds);
  const remainCorrect = stored.correct.filter((id) => correctSet.has(id));
  const remainIncorrect = stored.incorrect.filter((id) => incorrectSet.has(id));

  // 正答3・誤答7を基本にしつつ、片方が不足するプールでは他方で補って合計10に近づける
  let takeCorrect = Math.min(TARGET_CORRECT, correctPool.length);
  let takeIncorrect = Math.min(TARGET_INCORRECT, incorrectPool.length);
  let shortfall = TARGET_CORRECT + TARGET_INCORRECT - takeCorrect - takeIncorrect;
  if (shortfall > 0) {
    const addInc = Math.min(shortfall, incorrectPool.length - takeIncorrect);
    takeIncorrect += addInc;
    shortfall -= addInc;
    const addCor = Math.min(shortfall, correctPool.length - takeCorrect);
    takeCorrect += addCor;
    shortfall -= addCor;
  }

  const c = drawFromBag(remainCorrect, correctIds, takeCorrect);
  const inc = drawFromBag(remainIncorrect, incorrectIds, takeIncorrect);

  writeBags(poolId, { correct: c.bag, incorrect: inc.bag });

  const byId = new Map(pool.map((q) => [q.id, q]));
  const picked = [...c.picked, ...inc.picked].map((id) => byId.get(id)).filter(Boolean);
  return shuffleArray(picked);
}

/**
 * 指定プールのローテーション状態をリセットする（テスト・デバッグ用）。
 * @param {string} poolId
 */
export function resetRotation(poolId) {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + poolId);
  } catch (_e) {
    /* noop */
  }
}
