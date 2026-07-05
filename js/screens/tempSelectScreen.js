/**
 * 温度選択画面
 * @param {HTMLElement} root
 * @param {{ onSelectTemp: (tempMode: "80"|"110") => void, onBack: () => void }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--temp-select";
  section.dataset.screen = "temp-select";
  section.innerHTML = `
    <h2 class="screen-title">サウナの温度を選べ</h2>
    <div class="door-row">
      <button type="button" class="door door--80" data-temp="80">
        <span class="door__window"></span>
        <span class="door__temp">80℃</span>
        <span class="door__sub">通常・5分・初見向け</span>
      </button>
      <button type="button" class="door door--110" data-temp="110">
        <span class="door__window"></span>
        <span class="door__temp">110℃</span>
        <span class="door__sub">灼熱・1分・上級者向け</span>
      </button>
    </div>
    <button type="button" class="btn btn--ghost" data-action="back">戻る</button>
  `;
  root.appendChild(section);

  let resolved = false;
  let doorTimer = null;

  const handleDoorClick = (event) => {
    const door = event.target.closest(".door");
    if (!door || resolved) return;
    resolved = true;
    door.classList.add("is-opening");
    const tempMode = door.dataset.temp;
    doorTimer = window.setTimeout(() => {
      context.onSelectTemp(tempMode);
    }, 220);
  };
  section.querySelectorAll(".door").forEach((door) => {
    door.addEventListener("click", handleDoorClick);
  });

  const backBtn = section.querySelector('[data-action="back"]');
  // 扉選択済み(resolved)後の「戻る」は無視する: 220ms後の遷移タイマーと競合し、
  // 店舗選択へ戻った直後にINTROへ飛ばされるのを防ぐ
  const handleBack = () => {
    if (resolved) return;
    context.onBack();
  };
  backBtn.addEventListener("click", handleBack);

  return {
    unmount() {
      if (doorTimer !== null) {
        window.clearTimeout(doorTimer);
      }
      section.querySelectorAll(".door").forEach((door) => {
        door.removeEventListener("click", handleDoorClick);
      });
      backBtn.removeEventListener("click", handleBack);
      section.remove();
    },
  };
}
