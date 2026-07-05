import { escapeHtml } from "../engine/escapeHtml.js";

/**
 * 導入会話シーン（赤坂 GitHub 店）
 * 地の文・セリフを1つずつタップ/クリック/Enterで進める。「俺がまさおだ」演出、
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
  const tempMode = context.tempMode || "80";

  const steps = [
    { type: "narration", text: `まさおは${storeName}に到着した。木の扉の向こうから熱気と湯気が漏れる。` },
    { type: "masao", text: "今日は……ここだな。" },
    { type: "narration", text: `入口には2つの扉があった。まさおは${tempMode}℃の扉を選んで潜り抜けた。` },
    { type: "narration", text: "扉が開く。白い湯気、木の壁、薄暗い照明。熱で空気が揺れる。奥から声がした。" },
    { type: "fake", text: "AIのこと、全部教えてやる。" },
    { type: "fake", text: "難しく考えるな。聞けばすぐ分かる。" },
    { type: "fake", text: "僕の名前は、まさおだよ。" },
    { type: "masao", text: "……おい。" },
    { type: "fake", text: "ん？" },
    { type: "masao", text: "今、なんて言った？" },
    { type: "fake", text: "僕の名前は、まさおだよ。" },
    { type: "masao", text: "勝手に名乗るな。" },
    { type: "fake", text: "勝手に？" },
    { type: "reveal" },
    { type: "fake", text: "へえ。" },
    { type: "narration", text: "湯気の奥で笑う。" },
    { type: "fake", text: "じゃあ証明しろ。" },
    { type: "masao", text: "証明？" },
    { type: "fake", text: "名前は誰でも名乗れる。本物かは答えで分かる。" },
    { type: "masao", text: "……なるほど。" },
    { type: "fake", text: `ここは${storeName}。勝負はGitHubだ。` },
    { type: "fake", text: "答えられるのか？" },
    { type: "masao", text: "当然だ。" },
    { type: "fake", text: "10問勝負だ。" },
    { type: "fake", text: "正しいと思えば正しい、違えば指摘しろ。" },
    { type: "masao", text: "正しければ認める。違えば崩す。" },
    { type: "fake", text: "いいね。" },
    { type: "fake", text: "ただしここはサウナだ。" },
    { type: "narration", text: "画面外周に耐久リングが表示され、ゆっくり減り始める。", showRingHint: true },
    { type: "fake", text: "耐えながら10問答えきれたら認めてやる。" },
    { type: "masao", text: "認めはいらない。" },
    { type: "masao", text: "ここで証明する。" },
    { type: "fake", text: "始めよう。" },
    { type: "battle-start" },
  ];

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
    const speakerLabel = step.type === "masao" ? "まさお" : step.type === "fake" ? "偽まさお" : "";
    const speakerClass = step.type === "masao" ? "dialogue-box__speaker--masao" : "";
    const textContent = isNarration ? step.text : `「${step.text}」`;

    section.innerHTML = `
      <div class="steam-bg" aria-hidden="true">
        <span class="steam-blob steam-blob--1"></span>
        <span class="steam-blob steam-blob--2"></span>
        <span class="steam-blob steam-blob--3"></span>
      </div>
      <button type="button" class="btn btn--ghost dialogue-skip">スキップ</button>
      ${step.showRingHint ? '<p class="ring-preview-hint">――耐久リングが画面の外周に浮かび、ゆっくりと減り始めた。</p>' : ""}
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
    section.className = "screen screen--masao-reveal";
    section.dataset.screen = "masao-reveal";
    section.innerHTML = `
      <div class="steam-bg is-frozen" aria-hidden="true">
        <span class="steam-blob steam-blob--1"></span>
        <span class="steam-blob steam-blob--2"></span>
        <span class="steam-blob steam-blob--3"></span>
      </div>
      <button type="button" class="btn btn--ghost dialogue-skip">スキップ</button>
      <div class="masao-flash" aria-hidden="true"></div>
      <h2 class="masao-text">俺がまさおだ</h2>
    `;
    const flash = section.querySelector(".masao-flash");
    const text = section.querySelector(".masao-text");
    const skipBtn = section.querySelector(".dialogue-skip");

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      goNext();
    };

    pendingTimers.push(window.setTimeout(() => flash.classList.add("is-flashing"), 500));
    pendingTimers.push(window.setTimeout(() => text.classList.add("is-revealed"), 550));
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
