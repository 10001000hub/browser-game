/**
 * ベスト記録エンジン。
 *
 * 店舗×温度モードごとの「クリア時の残り時間(ms)」をlocalStorageに永続化する。
 * 残り時間が長いほど良い記録＝速く・正確にクリアした証明（誤答ペナルティで残り時間が
 * 削られるため、残り時間は速度と正確さを併せて反映する）。
 *
 * 保存形式（バージョン付きキー）:
 *   { [storeId]: { "80": number, "110": number } }   値はクリア時の残りms
 */

const STORAGE_KEY = "oregamasao.records.v1";

/**
 * 全記録を読み込む。未保存・壊れたデータ・非対応環境では空オブジェクトを返す。
 * @returns {Record<string, Record<string, number>>}
 */
function loadAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_e) {
    return {};
  }
}

/**
 * 全記録を書き込む。非対応/拒否時は永続化を諦める（例外を投げない）。
 * @param {Record<string, Record<string, number>>} data
 */
function saveAll(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_e) {
    /* localStorage 非対応/拒否時は永続化を諦める */
  }
}

/**
 * 指定店舗×温度のベスト残り時間(ms)を返す。未記録ならnull。
 * @param {string} storeId
 * @param {"80"|"110"} tempMode
 * @returns {number|null}
 */
export function getBestRemainingMs(storeId, tempMode) {
  const rec = loadAll()[storeId];
  const value = rec ? rec[String(tempMode)] : undefined;
  return typeof value === "number" && value >= 0 ? value : null;
}

/**
 * クリア結果を記録する。既存ベストを上回ったときのみ更新する。
 * @param {string} storeId
 * @param {"80"|"110"} tempMode
 * @param {number} remainingMs - クリア時の残り時間(ms)
 * @returns {{ isNewRecord: boolean, bestMs: number, previousMs: number|null }}
 */
export function recordClear(storeId, tempMode, remainingMs) {
  const clamped = Math.max(0, Math.floor(remainingMs));
  const data = loadAll();
  const key = String(tempMode);
  const rec = data[storeId] || {};
  const prev = typeof rec[key] === "number" && rec[key] >= 0 ? rec[key] : null;
  const isNewRecord = prev === null || clamped > prev;
  if (isNewRecord) {
    rec[key] = clamped;
    data[storeId] = rec;
    saveAll(data);
  }
  return { isNewRecord, bestMs: isNewRecord ? clamped : prev, previousMs: prev };
}

/**
 * 残り時間(ms)を m:ss 表記に整形する（耐久リング表示と揃えて切り上げ）。
 * @param {number} ms
 * @returns {string}
 */
export function formatRemaining(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}
