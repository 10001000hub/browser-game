/**
 * 整い場（振り返り）画面
 * @param {HTMLElement} root
 * @param {{ reviewLog: (object|null|undefined)[], onReturnToTitle: () => void }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--review";
  section.dataset.screen = "review";

  const entries = context.reviewLog.filter((entry) => entry && entry.firstAnswer !== undefined);

  const cardsHtml = entries.length
    ? entries
        .map((entry) => {
          const badge = entry.isFirstAnswerCorrect
            ? '<span class="badge badge--correct">正解</span>'
            : '<span class="badge badge--incorrect">不正解</span>';
          return `
            <article class="review-card">
              <header class="review-card__head">
                <span class="review-card__no">Q${entry.index}</span>
                ${badge}
              </header>
              <p class="review-card__quote">「偽まさお」: ${entry.statement}</p>
              <dl class="review-card__answers">
                <dt>あなたの回答</dt><dd>${entry.firstAnswer}</dd>
                <dt>正解</dt><dd>${entry.correctAnswer}</dd>
              </dl>
              <p class="review-card__explain">解説: ${entry.explanation}</p>
              <div class="review-card__tags">
                <span class="tag">${entry.topic}</span>
              </div>
              <p class="review-card__source">出典: ${entry.sourceMemo}</p>
            </article>
          `;
        })
        .join("")
    : '<p class="review-empty">記録なし。</p>';

  section.innerHTML = `
    <h2 class="screen-title">整い場</h2>
    <div class="review-list">${cardsHtml}</div>
    <button type="button" class="btn btn--primary" data-action="to-title">タイトルへ戻る</button>
  `;
  root.appendChild(section);

  const btn = section.querySelector('[data-action="to-title"]');
  const handleClick = () => context.onReturnToTitle();
  btn.addEventListener("click", handleClick);

  return {
    unmount() {
      btn.removeEventListener("click", handleClick);
      section.remove();
    },
  };
}
