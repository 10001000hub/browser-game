/**
 * 店舗選択画面
 * @param {HTMLElement} root
 * @param {{ stores: import('../data/stores.js').Store[], onSelectStore: (storeId: string) => void, onBack: () => void }} context
 * @returns {{ unmount: () => void }}
 */
export function mount(root, context) {
  const section = document.createElement("section");
  section.className = "screen screen--shop-select";
  section.dataset.screen = "shop-select";

  const cardsHtml = context.stores
    .map((store) => {
      if (store.status === "available") {
        return `
          <button type="button" class="shop-card shop-card--active" data-store-id="${store.id}">
            <span class="shop-card__noren-fringe" aria-hidden="true"></span>
            <span class="shop-card__icon">🐙♨️</span>
            <span class="shop-card__name">${store.displayName}</span>
            <span class="shop-card__desc">${store.description}</span>
          </button>
        `;
      }
      return `
        <div class="shop-card shop-card--soon" aria-disabled="true">
          <span class="shop-card__noren-fringe" aria-hidden="true"></span>
          <span class="shop-card__icon">♨️</span>
          <span class="shop-card__name">${store.displayName}</span>
          <span class="badge badge--soon">Coming Soon</span>
        </div>
      `;
    })
    .join("");

  section.innerHTML = `
    <h2 class="screen-title">今日はどのサウナに行く？</h2>
    <div class="shop-grid">
      ${cardsHtml}
    </div>
    <button type="button" class="btn btn--ghost" data-action="back">戻る</button>
  `;
  root.appendChild(section);

  const handleClick = (event) => {
    const card = event.target.closest(".shop-card--active");
    if (card) {
      context.onSelectStore(card.dataset.storeId);
    }
  };
  section.addEventListener("click", handleClick);

  const backBtn = section.querySelector('[data-action="back"]');
  const handleBack = () => context.onBack();
  backBtn.addEventListener("click", handleBack);

  return {
    unmount() {
      section.removeEventListener("click", handleClick);
      backBtn.removeEventListener("click", handleBack);
      section.remove();
    },
  };
}
