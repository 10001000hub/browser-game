/**
 * コンティニュー画面（連打ミニゲーム）。
 * 実時間10秒以内に30回連打すれば成功（context.onSuccess）、
 * 未達なら失敗（context.onFail）。判定は performance.now() 基準。
 *
 * @param {HTMLElement} root
 * @param {{ onSuccess: () => void, onFail: () => void }} context
 * @returns {{ unmount: () => void }}
 */
const WINDOW_MS = 10_000;
const TARGET_CLICKS = 30;

export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--continue";
  section.dataset.screen = "continue";
  section.innerHTML = `
    <div class="continue-scrim" aria-hidden="true"></div>
    <p class="continue-count" aria-live="polite">10</p>
    <p class="continue-label">連打で復活せよ</p>
    <button type="button" class="mash-btn" aria-label="連打する">
      <span class="mash-btn__ring" style="--progress: 0"></span>
      <span class="mash-btn__icon">♨️</span>
    </button>
    <p class="mash-btn__count">0 / 30</p>
  `;
  root.appendChild(section);

  const countEl = section.querySelector(".continue-count");
  const mashBtn = section.querySelector(".mash-btn");
  const ringEl = section.querySelector(".mash-btn__ring");
  const countLabelEl = section.querySelector(".mash-btn__count");

  const windowStart = performance.now();
  let clickCount = 0;
  let resolved = false;
  let rafId = null;

  function updateMashUI() {
    ringEl.style.setProperty("--progress", String(clickCount / TARGET_CLICKS));
    countLabelEl.textContent = `${clickCount} / ${TARGET_CLICKS}`;
  }

  function updateCountdownUI(remainingMs) {
    const secondsLeft = Math.ceil(remainingMs / 1000);
    countEl.textContent = String(secondsLeft);
    countEl.style.animation = "none";
    void countEl.offsetWidth;
    countEl.style.animation = "";
    if (secondsLeft <= 3) {
      section.classList.add("is-critical");
    }
  }

  function onMashPointerDown(event) {
    event.preventDefault();
    if (resolved) return;
    const elapsed = performance.now() - windowStart;
    if (elapsed >= WINDOW_MS) return;
    clickCount += 1;
    updateMashUI();
    if (clickCount >= TARGET_CLICKS) {
      resolved = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      context.onSuccess();
    }
  }
  mashBtn.addEventListener("pointerdown", onMashPointerDown);

  function tick() {
    if (resolved) return;
    const elapsed = performance.now() - windowStart;
    updateCountdownUI(Math.max(0, WINDOW_MS - elapsed));
    if (elapsed >= WINDOW_MS) {
      resolved = true;
      context.onFail();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  return {
    unmount() {
      resolved = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      mashBtn.removeEventListener("pointerdown", onMashPointerDown);
      section.remove();
    },
  };
}
