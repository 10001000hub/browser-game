/**
 * サウナ施設（店舗）一覧データ
 *
 * @typedef {Object} Store
 * @property {string} id
 * @property {string} displayName
 * @property {string} themeName
 * @property {string} icon - 店舗カードに出す絵文字
 * @property {string} description
 * @property {"available"|"coming-soon"} status
 * @property {string} questionPoolId
 *
 * @type {Store[]}
 */
export const stores = [
  {
    id: "github",
    displayName: "赤坂 GitHub 店",
    themeName: "GitHub",
    icon: "🌱",
    description: "リポジトリ、ブランチ、プルリクエスト。共同開発の基本を蒸し込む。",
    status: "available",
    questionPoolId: "github",
  },
  {
    id: "orca",
    displayName: "銀座 Orca 店",
    themeName: "Orca",
    icon: "🐋",
    description: "複数のAIエージェントを並べて走らせる開発環境「Orca」の要点。",
    status: "available",
    questionPoolId: "orca",
  },
  {
    id: "prompt-engineering",
    displayName: "六本木 プロンプト店",
    themeName: "プロンプトエンジニアリング",
    icon: "✍️",
    description: "AIへの頼み方。明確さ・例・構造の3つで整える。",
    status: "available",
    questionPoolId: "prompt-engineering",
  },
  {
    id: "claude-code",
    displayName: "新宿 Claude Code 店",
    themeName: "Claude Code",
    icon: "⌨️",
    description: "ターミナルで働くAI。設定ファイル・権限・コマンドを押さえる。",
    status: "available",
    questionPoolId: "claude-code",
  },
  {
    id: "wsl",
    displayName: "渋谷 WSL 店",
    themeName: "WSL",
    icon: "🐧",
    description: "WindowsでLinuxを動かす仕組みと、ファイルの置き場所。",
    status: "available",
    questionPoolId: "wsl",
  },
  {
    id: "obsidian",
    displayName: "神田 Obsidian 店",
    themeName: "Obsidian",
    icon: "🗂️",
    description: "手元のMarkdownでつくる、つながるノート。",
    status: "available",
    questionPoolId: "obsidian",
  },
  {
    id: "ai-agent",
    displayName: "虎ノ門 AIエージェント店",
    themeName: "AIエージェント",
    icon: "🤖",
    description: "AIに仕事を任せる設計。シンプルに始めて、測って足す。",
    status: "available",
    questionPoolId: "ai-agent",
  },
];
