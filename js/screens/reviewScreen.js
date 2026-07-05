import { escapeHtml } from "../engine/escapeHtml.js";

/**
 * 整い場（振り返り）画面
 * @param {HTMLElement} root
 * @param {{ reviewLog: (object|null|undefined)[], selectedStore?: import('../data/stores.js').Store, onReturnToTitle: () => void }} context
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
              <p class="review-card__quote">「偽まさお」: ${escapeHtml(entry.statement)}</p>
              <dl class="review-card__answers">
                <dt>あなたの回答</dt><dd>${escapeHtml(entry.firstAnswer)}</dd>
                <dt>正解</dt><dd>${escapeHtml(entry.correctAnswer)}</dd>
              </dl>
              <p class="review-card__explain">解説: ${escapeHtml(entry.explanation)}</p>
              <div class="review-card__tags">
                <span class="tag">${escapeHtml(entry.topic)}</span>
              </div>
              <p class="review-card__source">出典: ${escapeHtml(entry.sourceMemo)}</p>
            </article>
          `;
        })
        .join("")
    : '<p class="review-empty">記録なし。</p>';

  const videoUrl = context.selectedStore && context.selectedStore.sourceVideoUrl;
  const sourceVideoHtml = videoUrl
    ? `<p class="review-source-video">この整い場の解説の元になった動画: <a class="review-source-video__link" href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(videoUrl)}</a></p>`
    : "";

  section.innerHTML = `
    <h2 class="screen-title">整い場</h2>
    <div class="review-list">${cardsHtml}</div>
    ${sourceVideoHtml}
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
