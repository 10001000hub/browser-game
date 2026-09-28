import { TEMP_CONFIG } from "../data/tempConfig.js";
import { escapeHtml } from "../engine/escapeHtml.js";
import { CAST } from "../data/cast.js";

/**
 * クイズバトル画面。
 * 1回のmountにつき1問を表示する。正解時はフィードバック（successLine）を
 * 表示した後 context.onAdvance() を呼び、main.js が次の問題へ遷移する
 * （main.jsが再度mountし直す）。誤答時はこの画面内で留まり続ける。
 *
 * @param {HTMLElement} root
 * @param {{
 *   question: object,
 *   choiceOrder: string[],
 *   wrongChoices: Set<string>,
 *   questionNumber: number,
 *   totalQuestions: number,
 *   tempMode: "80"|"110",
 *   onChoiceClick: (text: string) => { ignored?: boolean, correct?: boolean, line?: string, isLastQuestion?: boolean },
 *   onAdvance: () => void,
 * }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--quiz";
  section.dataset.screen = "quiz-battle";

  const penaltySeconds = Math.round((TEMP_CONFIG[context.tempMode] || TEMP_CONFIG["80"]).penaltyMs / 1000);
  const penaltyLabel = `-${penaltySeconds}秒`;

  section.innerHTML = `
    <header class="quiz-header">
      <span class="quiz-progress" aria-label="${context.totalQuestions}問中${context.questionNumber}問目">${context.questionNumber} / ${context.totalQuestions}</span>
    </header>
    <div class="sauna-bg sauna-bg--quiz" aria-hidden="true"></div>
    <div class="quiz-rival">
      <img class="quiz-rival__portrait" src="${CAST.rival.image}" alt="" aria-hidden="true">
      <div class="bubble bubble--rival">
        <span class="bubble__speaker">${escapeHtml(CAST.rival.name)}</span>
        <p class="bubble__text" data-autofocus>${escapeHtml(context.question.rivalLine)}</p>
      </div>
    </div>
    <p class="quiz-question">${escapeHtml(context.question.questionText)}</p>
    <div class="choice-list" role="group" aria-label="答えを選ぶ（数字キー1〜4でも選べます）"></div>
    <div class="feedback-toast" role="status" aria-live="polite"></div>
  `;
  root.appendChild(section);

  const choiceList = section.querySelector(".choice-list");
  const toast = section.querySelector(".feedback-toast");
  let locked = false;
  let advanceTimer = null;

  function renderChoices() {
    choiceList.innerHTML = "";
    context.choiceOrder.forEach((text, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = text;
      btn.setAttribute("aria-keyshortcuts", String(index + 1));
      if (context.wrongChoices.has(text)) {
        btn.classList.add("is-incorrect");
        btn.disabled = true;
      }
      btn.addEventListener("click", () => handleClick(text, btn));
      choiceList.appendChild(btn);
    });
  }

  function showToast(isCorrect, line) {
    toast.className = "feedback-toast";
    // force reflow so animation restarts if re-triggered
    void toast.offsetWidth;
    if (isCorrect) {
      toast.innerHTML = `正解！<span class="feedback-toast__line">${escapeHtml(line || "")}</span>`;
      toast.classList.add("is-correct");
    } else {
      toast.innerHTML = `不正解 ${penaltyLabel}<span class="feedback-toast__line">${escapeHtml(line || "")}</span>`;
      toast.classList.add("is-incorrect");
    }
  }

  function handleClick(text, btn) {
    if (locked) return;
    const result = context.onChoiceClick(text);
    if (!result || result.ignored) return;

    if (result.correct) {
      locked = true;
      choiceList.querySelectorAll(".choice").forEach((el) => {
        el.disabled = true;
      });
      btn.classList.add("is-correct");
      showToast(true, result.line);
      const delay = 1200;
      advanceTimer = window.setTimeout(() => context.onAdvance(), delay);
      // タップで短縮できるようにする（同一クリックイベントを誤って拾わないよう次のタスクで登録）
      const skipAdvance = () => {
        if (advanceTimer !== null) {
          window.clearTimeout(advanceTimer);
          advanceTimer = null;
        }
        context.onAdvance();
      };
      window.setTimeout(() => {
        section.addEventListener("click", skipAdvance, { once: true });
      }, 0);
    } else {
      btn.classList.add("is-incorrect");
      btn.disabled = true;
      showToast(false, result.line);
    }
  }

  // 数字キー 1〜4 で選択肢を押せるようにする（キーボードだけで遊べるように）
  function onKeydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const index = Number(event.key) - 1;
    if (!Number.isInteger(index) || index < 0) return;
    const btn = choiceList.querySelectorAll(".choice")[index];
    if (!btn || btn.disabled) return;
    event.preventDefault();
    btn.focus({ preventScroll: true });
    btn.click();
  }
  document.addEventListener("keydown", onKeydown);

  renderChoices();

  return {
    unmount() {
      document.removeEventListener("keydown", onKeydown);
      if (advanceTimer !== null) {
        window.clearTimeout(advanceTimer);
      }
      section.remove();
    },
  };
}
