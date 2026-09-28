import { CAST } from "../data/cast.js";

/**
 * タイトル画面
 * @param {HTMLElement} root
 * @param {{ onStart: () => void }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--title";
  section.dataset.screen = "title";
  section.innerHTML = `
    <div class="steam-bg" aria-hidden="true">
      <span class="steam-blob steam-blob--1"></span>
      <span class="steam-blob steam-blob--2"></span>
      <span class="steam-blob steam-blob--3"></span>
    </div>
    <div class="title-cast" aria-hidden="true">
      <img class="title-cast__rival" src="${CAST.rival.image}" alt="">
      <img class="title-cast__hero" src="${CAST.hero.image}" alt="">
    </div>
    <h1 class="logo">熱波論破</h1>
    <p class="logo-sub">サウナでAIのウソを見抜け</p>
    <p class="tagline">熱波師ゴウの「それっぽいAI話」。<br>正しいか、どこが違うか。10問で見抜け。</p>
    <p class="prompt-text">今日はどのサウナに行く？</p>
    <button type="button" class="btn btn--primary tap-start">タップしてはじめる</button>
  `;
  root.appendChild(section);

  const startBtn = section.querySelector(".tap-start");
  const handleStart = () => context.onStart();
  startBtn.addEventListener("click", handleStart);

  return {
    unmount() {
      startBtn.removeEventListener("click", handleStart);
      section.remove();
    },
  };
}
