/**
 * リザルト画面
 * @param {HTMLElement} root
 * @param {{ didWin: boolean, reviewLog: (object|null|undefined)[], onGoToReview: () => void }} context
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
