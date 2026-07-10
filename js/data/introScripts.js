/**
 * 店舗別イントロ会話スクリプト
 *
 * introScreen が表示する会話ステップを店舗ごとに定義する。ステップの type:
 *   - "narration":    地の文
 *   - "masao":        まさおのセリフ
 *   - "fake":         偽まさおのセリフ
 *   - "reveal":       「俺がまさおだ」演出（text 不要）
 *   - "battle-start": BATTLE START 演出（text 不要・必ず最後に置く）
 *
 * 店舗専用の会話を用意する場合は scriptsByStoreId に 店舗ID → ビルダー関数 を
 * 追加する。未定義の店舗は defaultScript にフォールバックする。
 * 追加したスクリプトは tests/introScripts.test.js の構造検証に自動で含まれる。
 *
 * @typedef {{ type: "narration"|"masao"|"fake", text: string } | { type: "reveal"|"battle-start" }} IntroStep
 * @typedef {{ storeName: string, themeName: string, tempMode: "80"|"110" }} IntroScriptParams
 */

/** @type {(params: IntroScriptParams) => IntroStep[]} */
function defaultScript({ storeName, themeName, tempMode }) {
  return [
    { type: "narration", text: `まさおは${storeName}に到着した。木の扉の向こうから熱気と湯気が漏れる。` },
    { type: "masao", text: "今日は……ここだな。" },
    { type: "narration", text: `入口には2つの扉があった。まさおは${tempMode}℃の扉を選んで潜り抜けた。` },
    { type: "narration", text: "扉が開く。白い湯気、木の壁、薄暗い照明。熱で空気が揺れる。奥から声がした。" },
    { type: "fake", text: "コンサル料100万でいいよ。" },
    { type: "fake", text: "AIのことなんでも聞いてよ。" },
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
    { type: "fake", text: `ここは${storeName}。テーマは${themeName}だ。` },
    { type: "fake", text: "答えられるのか？" },
    { type: "masao", text: "当然だ。" },
    { type: "fake", text: "10問勝負だ。" },
    { type: "fake", text: "正しいと思えば正しい、違えば指摘しろ。" },
    { type: "masao", text: "正しければ認める。違えば崩す。" },
    { type: "fake", text: "いいね。" },
    { type: "fake", text: "ただしここはサウナだ。" },
    { type: "fake", text: "10問答えきれたら認めてやる。" },
    { type: "masao", text: "認めはいらない。" },
    { type: "masao", text: "ここで証明する。" },
    { type: "fake", text: "始めよう。" },
    { type: "battle-start" },
  ];
}

/** @type {(params: IntroScriptParams) => IntroStep[]} */
function orcaScript({ storeName, themeName, tempMode }) {
  return [
    { type: "narration", text: `まさおは${storeName}に到着した。ビルの谷間、扉の隙間から湯気が路地へ流れていく。` },
    { type: "masao", text: "今日は……ここだな。" },
    { type: "narration", text: `入口には2つの扉があった。まさおは${tempMode}℃の扉を選んで潜り抜けた。` },
    { type: "narration", text: "扉が開く。白い湯気の中、いくつもの声が重なって聞こえる。だが、話しているのは一人だった。" },
    { type: "fake", text: "エージェントは並べるだけじゃ駄目だよ。" },
    { type: "fake", text: "束ねる者がいて、初めて仕事になる。" },
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
    { type: "fake", text: "名前は誰でも名乗れる。エージェントに名前を付けるのと同じだ。" },
    { type: "fake", text: "動かして、初めて本物かどうかが分かる。" },
    { type: "masao", text: "……なるほど。" },
    { type: "fake", text: `ここは${storeName}。テーマは${themeName}だ。` },
    { type: "fake", text: "複数のAIを束ねるIDE。捌けるのか？" },
    { type: "masao", text: "当然だ。" },
    { type: "fake", text: "10問勝負だ。" },
    { type: "fake", text: "正しいと思えば正しい、違えば指摘しろ。" },
    { type: "masao", text: "正しければ認める。違えば崩す。" },
    { type: "fake", text: "いいね。" },
    { type: "fake", text: "ただしここはサウナだ。並列処理は効かない。" },
    { type: "fake", text: "一問ずつ、自分の頭で捌け。10問答えきれたら認めてやる。" },
    { type: "masao", text: "認めはいらない。" },
    { type: "masao", text: "ここで証明する。" },
    { type: "fake", text: "始めよう。" },
    { type: "battle-start" },
  ];
}

/** @type {Record<string, (params: IntroScriptParams) => IntroStep[]>} */
export const scriptsByStoreId = {
  orca: orcaScript,
};

/**
 * 店舗に応じたイントロ会話ステップを返す
 *
 * @param {import('./stores.js').Store | null | undefined} store
 * @param {"80"|"110"} [tempMode]
 * @returns {IntroStep[]}
 */
export function getIntroSteps(store, tempMode) {
  const storeName = store ? store.displayName : "赤坂 GitHub 店";
  const themeName = store ? store.themeName : "GitHub";
  const builder = (store && scriptsByStoreId[store.id]) || defaultScript;
  return builder({ storeName, themeName, tempMode: tempMode || "80" });
}
