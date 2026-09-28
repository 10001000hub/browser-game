/**
 * 店舗別イントロ会話スクリプト
 *
 * introScreen が表示する会話ステップを店舗ごとに定義する。ステップの type:
 *   - "narration":    地の文
 *   - "hero":         主人公ミナトのセリフ
 *   - "rival":        熱波師ゴウのセリフ
 *   - "reveal":       「ウラ、取らせてもらう」演出（text 不要）
 *   - "battle-start": BATTLE START 演出（text 不要・必ず最後に置く）
 *
 * 会話の骨組みは buildScript が共通で持ち、店舗ごとの違い（到着の情景・ゴウの第一声・
 * 挑発）は storeFlavors に書く。未定義の店舗は defaultFlavor にフォールバックする。
 * 追加した店舗は tests/introScripts.test.js の構造検証に自動で含まれる。
 *
 * @typedef {{ type: "narration"|"hero"|"rival", text: string } | { type: "reveal"|"battle-start" }} IntroStep
 * @typedef {{ storeName: string, themeName: string, tempMode: "80"|"110" }} IntroScriptParams
 * @typedef {{ arrival: string, boasts: string[], challenge: string }} StoreFlavor
 */

/** @type {StoreFlavor} */
const defaultFlavor = {
  arrival: "木の扉の向こうから、熱気と湯気が漏れている。",
  boasts: ["AIのことなら何でも聞いてよ。", "オレの熱波を浴びれば、どんな話も一発で分かる。"],
  challenge: "自信があるなら答えてみな。",
};

/** @type {Record<string, StoreFlavor>} */
const storeFlavors = {
  github: {
    arrival: "受付の壁には、緑色の草が一面に生えたカレンダーが貼ってある。",
    boasts: ["GitとGitHubなんて同じようなもんだよ。", "プルリク？ とりあえずmainに直接pushしときゃいいの。"],
    challenge: "リポジトリの基本、分かってるんだろうな？",
  },
  orca: {
    arrival: "ビルの谷間。扉の奥から、いくつもの声が重なって聞こえる。だが、話しているのは一人だった。",
    boasts: ["エージェントは並べるだけじゃ駄目だよ。", "束ねる場所があって、初めて仕事になる。"],
    challenge: "複数のAIを並べて走らせる道具。本当に分かってるのか？",
  },
  "prompt-engineering": {
    arrival: "サウナ室の壁一面に、びっしりと呪文のような文章が貼られている。",
    boasts: ["プロンプトは長ければ長いほど賢くなるんだよ。", "語尾に『絶対に』って付けとけば、だいたい何とかなる。"],
    challenge: "AIへの頼み方。感覚じゃなく、筋道で答えられるか？",
  },
  "claude-code": {
    arrival: "ロッカーの横に、黒い画面のターミナルが何台も並んでいる。",
    boasts: ["Claude Codeはチャット画面でしか使えないんだよ。", "設定ファイル？ そんなの読まれないって。"],
    challenge: "ターミナルで働くAI。使い方、本当に知ってるのか？",
  },
  wsl: {
    arrival: "扉にはペンギンの絵と、窓のマークが並んで描かれている。",
    boasts: ["WindowsでLinuxを動かすなら、パソコンを2台買うしかない。", "ファイルはどこに置いても速さは同じだよ。"],
    challenge: "WindowsとLinuxの境目。迷わず渡れるか？",
  },
  obsidian: {
    arrival: "水風呂の横の棚に、紫色の表紙のノートが何冊も積まれている。",
    boasts: ["Obsidianのノートは全部クラウドにしか保存されないんだ。", "リンクなんて貼っても、何の意味もないって。"],
    challenge: "ノートとノートをつなぐ考え方。分かってるのか？",
  },
  "ai-agent": {
    arrival: "オフィス街の地下。扉の上で『全自動』と書かれた看板が点滅している。",
    boasts: ["エージェントにすれば、どんな仕事も全部おまかせでOK。", "仕組みは複雑なほど賢いに決まってる。"],
    challenge: "AIに仕事を任せる設計。筋道立てて説明できるか？",
  },
};

/**
 * 共通の骨組みに店舗ごとの味付けを差し込んで、会話ステップを組み立てる。
 * @param {IntroScriptParams} params
 * @param {StoreFlavor} flavor
 * @returns {IntroStep[]}
 */
function buildScript({ storeName, themeName, tempMode }, flavor) {
  return [
    { type: "narration", text: `ミナトは${storeName}の前に立った。${flavor.arrival}` },
    { type: "hero", text: "今日は……ここにするか。" },
    { type: "narration", text: `入口には2つの扉。ミナトは${tempMode}℃の扉を押した。` },
    { type: "narration", text: "白い湯気の奥で、サングラスの男が大きなタオルを振り回している。" },
    { type: "rival", text: "いらっしゃい。オレはAI熱波師のゴウ。" },
    ...flavor.boasts.map((text) => ({ type: "rival", text })),
    { type: "rival", text: "ちなみに相談はコンサル料100万でいいよ。" },
    { type: "hero", text: "……今の話、どこに書いてある？" },
    { type: "rival", text: "は？ オレが言ってるんだから本当だろ。" },
    { type: "hero", text: "それは『ソース』じゃない。" },
    { type: "reveal" },
    { type: "narration", text: "ミナトは頭のタオルを締め直した。" },
    { type: "rival", text: "……面白い。" },
    { type: "rival", text: `ここは${storeName}。テーマは${themeName}だ。` },
    { type: "rival", text: flavor.challenge },
    { type: "rival", text: "オレの話は、合ってることもある。間違ってることもある。" },
    { type: "rival", text: "合ってると思えば『正しい』。違うなら、どこが違うかを選べ。" },
    { type: "hero", text: "正しければ認める。違えば、根拠で返す。" },
    { type: "rival", text: "10問勝負だ。ただし、ここはサウナ。長居はできないぜ。" },
    { type: "hero", text: "上等だ。" },
    { type: "battle-start" },
  ];
}

/** @type {Record<string, (params: IntroScriptParams) => IntroStep[]>} */
export const scriptsByStoreId = Object.fromEntries(
  Object.entries(storeFlavors).map(([storeId, flavor]) => [storeId, (params) => buildScript(params, flavor)]),
);

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
  const params = { storeName, themeName, tempMode: tempMode || "80" };
  const builder = store && scriptsByStoreId[store.id];
  return builder ? builder(params) : buildScript(params, defaultFlavor);
}
