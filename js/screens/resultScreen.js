import { formatRemaining } from "../engine/records.js";

/**
 * クリア時の残り時間・記録ブロックのHTMLを返す。敗北時は空文字。
 * @param {{ didWin: boolean, tempMode?: "80"|"110", clearRemainingMs?: number|null, recordResult?: {isNewRecord: boolean, bestMs: number}|null }} context
 * @returns {string}
 */
function recordBlockHtml(context) {
  if (!context.didWin || typeof context.clearRemainingMs !== "number") return "";
  const rec = context.recordResult;
  const clearTime = formatRemaining(context.clearRemainingMs);
  const isNew = rec && rec.isNewRecord;
  const bestTime = rec && typeof rec.bestMs === "number" ? formatRemaining(rec.bestMs) : clearTime;
  const badge = isNew
    ? `<p class="result-record__new">🎉 自己ベスト更新！</p>`
    : `<p class="result-record__best">👑 ベスト残り ${bestTime}</p>`;
  return `
    <div class="result-record">
      <p class="result-record__clear">クリア残り時間 <strong>${clearTime}</strong></p>
      ${badge}
    </div>
  `;
}

/**
 * リザルト画面
 * @param {HTMLElement} root
 * @param {{ didWin: boolean, reviewLog: (object|null|undefined)[], tempMode?: "80"|"110", clearRemainingMs?: number|null, recordResult?: {isNewRecord: boolean, bestMs: number}|null, onGoToReview: () => void }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--result";
  section.dataset.screen = "result";
  section.dataset.result = context.didWin ? "win" : "lose";

  const correctCount = context.reviewLog.filter((entry) => entry && entry.isFirstAnswerCorrect).length;
  const answeredCount = context.reviewLog.filter((entry) => Boolean(entry)).length;

  const icon = context.didWin ? "🏆" : "💦";
  const title = context.didWin ? "証明完了" : "灼熱に敗れた……";
  const sub = context.didWin
    ? "お前がまさおであることは証明された。"
    : "耐久リングが尽きた。もう一度整え直せ。";

  section.innerHTML = `
    <div class="result-icon">${icon}</div>
    <h2 class="result-title">${title}</h2>
    <p class="result-sub">${sub}</p>
    <p class="result-stats">初回正解 ${correctCount} / ${answeredCount}（全10問中）</p>
    ${recordBlockHtml(context)}
    <div class="result-actions">
      <button type="button" class="btn btn--primary" data-action="to-review">整い場へ</button>
    </div>
  `;
  root.appendChild(section);

  const btn = section.querySelector('[data-action="to-review"]');
  const handleClick = () => context.onGoToReview();
  btn.addEventListener("click", handleClick);

  return {
    unmount() {
      btn.removeEventListener("click", handleClick);
      section.remove();
    },
  };
}
