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
    <h1 class="logo">俺がまさお</h1>
    <p class="tagline">AIに関する最新情報や本質情報を<br>できる限り早くより深く</p>
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
