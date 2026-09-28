import { escapeHtml } from "../engine/escapeHtml.js";
import { playSfx } from "../engine/sfx.js";
import { CAST } from "../data/cast.js";
import { getIntroSteps } from "../data/introScripts.js";

/**
 * 導入会話シーン（会話スクリプトは js/data/introScripts.js で店舗ごとに定義）
 * 地の文・セリフを1つずつタップ/クリック/Enterで進める。「ウラ、取らせてもらう」演出、
 * BATTLE START演出を経て context.onStartQuiz() を呼ぶ。スキップボタンで即座に
 * onStartQuiz() へ進める。
 *
 * @param {HTMLElement} root
 * @param {{ selectedStore: import('../data/stores.js').Store, tempMode: "80"|"110", onStartQuiz: () => void }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  root.appendChild(section);

  const storeName = context.selectedStore ? context.selectedStore.displayName : "赤坂 GitHub 店";

  const steps = getIntroSteps(context.selectedStore, context.tempMode);

  let index = 0;
  let pendingTimers = [];

  function clearTimers() {
    pendingTimers.forEach((id) => window.clearTimeout(id));
    pendingTimers = [];
  }

  function goNext() {
    clearTimers();
    index += 1;
    if (index >= steps.length) return;
    render(steps[index]);
  }

  function renderDialogueStep(step) {
    section.className = "screen screen--dialogue";
    section.dataset.screen = "intro-dialogue";
    const isNarration = step.type === "narration";
    const isHero = step.type === "hero";
    const isRival = step.type === "rival";
    const speakerLabel = isHero ? CAST.hero.name : isRival ? CAST.rival.name : "";
    // 主人公は右端、ライバルは左端にラベルを配置
    const speakerClass = isHero ? "dialogue-box__speaker--hero" : "dialogue-box__speaker--rival";
    const textContent = isNarration ? step.text : `「${step.text}」`;

    section.innerHTML = `
      <div class="sauna-bg" aria-hidden="true"></div>
      <div class="dialogue-cast" aria-hidden="true">
        <img class="portrait portrait--rival ${isRival ? "is-active" : "is-dim"}" src="${CAST.rival.image}" alt="">
        <img class="portrait portrait--hero ${isHero ? "is-active" : "is-dim"}" src="${CAST.hero.image}" alt="">
      </div>
      <button type="button" class="btn btn--ghost dialogue-skip">スキップ</button>
      <div class="dialogue-box" role="button" tabindex="0" aria-label="タップして次へ">
        ${isNarration ? "" : `<span class="dialogue-box__speaker ${speakerClass}">${speakerLabel}</span>`}
        <p class="dialogue-box__text ${isNarration ? "dialogue-box__text--narration" : ""}">${escapeHtml(textContent)}</p>
        <span class="dialogue-box__next" aria-hidden="true">▼</span>
      </div>
    `;

    const box = section.querySelector(".dialogue-box");
    // stopPropagation: goNext()が同期描画する次シーンはsectionにclickリスナーを張るため、
    // このクリックがバブリングで届くと reveal / battle-start が即スキップされてしまう
    const handleAdvance = (event) => {
      event.stopPropagation();
      goNext();
    };
    box.addEventListener("click", handleAdvance);
    box.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goNext();
      }
    });

    const skipBtn = section.querySelector(".dialogue-skip");
    skipBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearTimers();
      context.onStartQuiz();
    });
  }

  function renderRevealStep() {
    section.className = "screen screen--reveal";
    section.dataset.screen = "reveal";
    section.innerHTML = `
      <div class="steam-bg is-frozen" aria-hidden="true">
        <span class="steam-blob steam-blob--1"></span>
        <span class="steam-blob steam-blob--2"></span>
        <span class="steam-blob steam-blob--3"></span>
      </div>
      <button type="button" class="btn btn--ghost dialogue-skip">スキップ</button>
      <img class="reveal-portrait" src="${CAST.hero.image}" alt="" aria-hidden="true">
      <div class="reveal-flash" aria-hidden="true"></div>
      <h2 class="reveal-text">${escapeHtml(CAST.hero.revealLine)}</h2>
    `;
    const flash = section.querySelector(".reveal-flash");
    const text = section.querySelector(".reveal-text");
    const skipBtn = section.querySelector(".dialogue-skip");

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      goNext();
    };

    pendingTimers.push(window.setTimeout(() => flash.classList.add("is-flashing"), 500));
    pendingTimers.push(window.setTimeout(() => {
      text.classList.add("is-revealed");
      playSfx("reveal");
    }, 550));
    pendingTimers.push(window.setTimeout(() => text.classList.add("is-glowing"), 1050));
    pendingTimers.push(window.setTimeout(advance, 2200));

    section.addEventListener("click", advance);
    skipBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      clearTimers();
      context.onStartQuiz();
    });
  }

  function renderBattleStartStep() {
    section.className = "screen battle-start";
    section.dataset.screen = "battle-start";
    section.innerHTML = `
      <p class="battle-start__store">${escapeHtml(storeName)}</p>
      <p class="battle-start__label">BATTLE START</p>
    `;
    playSfx("battleStart");

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      context.onStartQuiz();
    };
    pendingTimers.push(window.setTimeout(advance, 1400));
    section.addEventListener("click", advance);
  }

  function render(step) {
    if (step.type === "reveal") {
      renderRevealStep();
    } else if (step.type === "battle-start") {
      renderBattleStartStep();
    } else {
      renderDialogueStep(step);
    }
  }

  render(steps[index]);

  return {
    unmount() {
      clearTimers();
      section.remove();
    },
  };
}
