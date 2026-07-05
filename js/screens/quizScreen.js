import { TEMP_CONFIG } from "../data/tempConfig.js";

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
      <span class="quiz-progress">${context.questionNumber} / ${context.totalQuestions}</span>
    </header>
    <div class="bubble bubble--masao-fake">
      <span class="bubble__speaker">偽まさお</span>
      <p class="bubble__text">${context.question.fakeMasaoLine}</p>
    </div>
    <p class="quiz-question">${context.question.questionText}</p>
    <div class="choice-list"></div>
    <div class="feedback-toast" aria-live="polite"></div>
  `;
  root.appendChild(section);

  const choiceList = section.querySelector(".choice-list");
  const toast = section.querySelector(".feedback-toast");
  let locked = false;
  let advanceTimer = null;

  function renderChoices() {
    choiceList.innerHTML = "";
    context.choiceOrder.forEach((text) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = text;
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
      toast.innerHTML = `正解！<span class="feedback-toast__line">${line || ""}</span>`;
      toast.classList.add("is-correct");
    } else {
      toast.innerHTML = `不正解 ${penaltyLabel}<span class="feedback-toast__line">${line || ""}</span>`;
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

  renderChoices();

  return {
    unmount() {
      if (advanceTimer !== null) {
        window.clearTimeout(advanceTimer);
      }
      section.remove();
    },
  };
}
