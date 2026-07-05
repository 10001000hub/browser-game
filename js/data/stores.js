/**
 * サウナ施設（店舗）一覧データ
 *
 * @typedef {Object} Store
 * @property {string} id
 * @property {string} displayName
 * @property {string} themeName
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
    description: "今日入れる唯一の湯。GitHubの基本を叩き込む。",
    status: "available",
    questionPoolId: "github",
  },
  {
    id: "prompt-engineering",
    displayName: "六本木 プロンプトエンジニアリング店",
    themeName: "プロンプトエンジニアリング",
    description: "準備中のサウナ。",
    status: "coming-soon",
    questionPoolId: "prompt-engineering",
  },
  {
    id: "claude-code",
    displayName: "新宿 Claude Code 店",
    themeName: "Claude Code",
    description: "準備中のサウナ。",
    status: "coming-soon",
    questionPoolId: "claude-code",
  },
  {
    id: "wsl",
    displayName: "渋谷 WSL 店",
    themeName: "WSL",
    description: "準備中のサウナ。",
    status: "coming-soon",
    questionPoolId: "wsl",
  },
  {
    id: "obsidian",
    displayName: "銀座 Obsidian 店",
    themeName: "Obsidian",
    description: "準備中のサウナ。",
    status: "coming-soon",
    questionPoolId: "obsidian",
  },
  {
    id: "ai-agent",
    displayName: "虎ノ門 AIエージェント店",
    themeName: "AIエージェント",
    description: "準備中のサウナ。",
    status: "coming-soon",
    questionPoolId: "ai-agent",
  },
];
