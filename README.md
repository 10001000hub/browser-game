# 熱波論破 — サウナでAIのウソを見抜け

サウナに居座る「AI熱波師ゴウ」が、それっぽいAIの話を自信満々に語る。

主人公ミナトになって、その話が **正しいか**、間違っているなら **どこが違うか** を4択で見抜く。

1プレイ10問・1〜5分。スマホでもPCでも、インストール不要で遊べる学習クイズゲームです。

### ▶ 今すぐ遊ぶ

## [https://10001000hub.github.io/browser-game/](https://10001000hub.github.io/browser-game/)

> **In English:** *Neppa Ronpa* is a free, build-free browser quiz game (Japanese UI) that teaches developers to spot
> confident-but-wrong claims about AI coding tools — Codex, Claude Code, GitHub, WSL and more.
> Every explanation cites official documentation, and a daily, LLM-free job checks those sources for broken links
> and content changes so the questions stay accurate. See [AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## どんなゲーム？

学習テーマを「サウナ店」に見立て、店を選ぶと熱波師ゴウとの10問勝負が始まります。

- **サウナ耐久リング** … 画面の外周が制限時間。尽きるとのぼせて退場。
- **温度で難易度が変わる** … 80℃はじっくり5分、110℃は即答勝負の1分。
- **誤答はその場に足止め** … 間違えると時間を削られ、正解するまで先に進めない。
- **コンティニュー** … 力尽きても一度だけ、10カウント以内の連打で復活できる。
- **整い場（振り返り）** … 決着後、出題された10問を解説と公式の出典つきで復習できる。ここが学習の本番。

## 8つの店舗（全店オープン）

- 🌱 赤坂 GitHub 店 … GitとGitHubの基本（30問）
- 🐋 銀座 Orca 店 … 複数のAIエージェントを並べて動かす開発環境 Orca（20問）
- ✍️ 六本木 プロンプト店 … AIへの頼み方（20問）
- ⌨️ 新宿 Claude Code 店 … ターミナルで働くAI（20問）
- 🐧 渋谷 WSL 店 … WindowsでLinuxを使う（20問）
- 🗂️ 神田 Obsidian 店 … ノートをつなぐメモアプリ（20問）
- 🤖 虎ノ門 AIエージェント店 … AIに仕事を任せる設計（20問）
- 🧰 池袋 Codex 店 … OpenAI のコーディングエージェント Codex（20問）

1回のプレイでは、ゴウが正しいことを言う問題が3問、間違ったことを言う問題が7問出ます。

同じ店を続けて遊ぶと、まだ出ていない問題から優先して出題されます。

## 問題づくりの約束

- 解説の根拠は **公式ドキュメントだけ** にする。各問題の出典欄に、公式ページの名前とURLを書く。
- 版で変わりやすい細部（ボタンの位置、料金の金額など）は問わない。
- 間違いの選択肢は、初心者が本当に思い込みそうなものにする。

詳しい書き方は [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) を参照してください。

## 問題を追加する（コントリビュート）

問題の誤りの指摘・新しい問題の提案・コードの改善を歓迎します。手順は [CONTRIBUTING.md](CONTRIBUTING.md) を見てください。
AI エージェント（Codex など）で作業するときのルールは [AGENTS.md](AGENTS.md) にあります。

## 問題を新しく保つしくみ

公式ドキュメントは変わります。問題が古くならないよう、次の2つが自動で回っています。どちらも AI や有料 API は呼びません。

- プルリクエストのたびに、全店舗の問題の形・選択肢の長さの偏り・出典の控えの抜けをテストで検査する。
- 毎日、全問題の出典ページを開き、リンク切れと本文の変化を調べる。変化があれば、確かめるべき問題の id を Issue にまとめる。

Issue が立ったときの片付け方は [docs/MAINTENANCE.md](docs/MAINTENANCE.md) にあります。

## ローカルで動かす

ビルド不要。任意の静的サーバーで開くだけです。

```bash
python3 -m http.server 8000
# → ブラウザで http://localhost:8000 を開く
```

## テスト

Node.js 標準のテストランナー（`node --test`）で動きます。外部サービスやAIの呼び出しはしません。

```bash
npm install       # 初回のみ（E2E で使う jsdom を導入）
npm test          # 全テスト（データ検証・ロジック単体・jsdom E2E）
npm run test:unit # jsdom 不要の単体・データ検証だけを高速に回す
```

出題データの形（4択に「正しい」を含む・正解が選択肢にある・正しい問題と誤りの問題の数が足りている など）は、

`questionPools.js` に登録された全店舗について自動で検査されます。

## ディレクトリ構成

```
index.html      エントリーポイント（GitHub Pages のルート）
css/style.css   デザイントークン・画面別スタイル・演出アニメーション
js/
  main.js       状態機械（画面遷移とゲーム状態の管理）
  engine/       DOM非依存のロジック（抽選・タイマー・効果音・ベスト記録・エスケープ）
  data/         店舗・キャラクター・イントロ台本・出題プール（questions-*.js）
  screens/      画面ごとのUIモジュール（title / quiz / review など8画面）
tests/          node --test 用のテスト一式
assets/images/  キャラクターと背景（すべてこのリポジトリのオリジナルSVG）
scripts/        出典の点検（check-sources.mjs）
data/           出典ページの控え（source-snapshots.json）
docs/           問題づくりのガイド・保守の手順書
```

## ライセンス

[MIT License](LICENSE)。キャラクター（ミナト・熱波師ゴウ）と画像もこのリポジトリのオリジナルで、同じライセンスで提供します。

記載されている製品名・サービス名は各社の商標です。このゲームはそれらの提供元とは関係のない、非公式の学習教材です。
