# 俺がまさお

ブラウザで動作するAI学習クイズゲーム。「サウナ」に見立てた店舗で、偽まさおの発言の真偽をクイズ形式で見抜く。

## 🎮 今すぐ遊ぶ（スマホ対応）

**https://10001000hub.github.io/browser-game/**

スマートフォン・PCのブラウザでそのまま遊べます（インストール不要）。

## ローカルでの動作確認

```bash
# リポジトリのルートで
python3 -m http.server 8000
# → http://localhost:8000 をブラウザで開く
```

## テスト

Node.js 18+ の組み込みテストランナー（`node --test`）で動作する。ビルドやトランスパイルは不要。

```bash
npm test          # 全テスト（問題データ検証・quizPicker/timer単体・jsdom E2E）
npm run test:unit # DOM非依存の単体・データ検証のみ（jsdom不要）
```

内訳:

- `tests/data.test.js` — 全店舗の出題プールを検証（必須フィールド・4択・「正しい」の有無・
  正誤とcorrectChoiceの整合・id重複・available店舗のプール存在）。新店舗のプールを
  `tests/helpers/pools.js` に登録すると自動で検証対象になる（回帰テスト）。
- `tests/quizPicker.test.js` / `tests/timer.test.js` — 抽選ロジックと耐久タイマーの単体テスト。
  タイマーは `tests/helpers/fakeClock.js` で `performance.now()`・`requestAnimationFrame`・
  `setTimeout` を差し替え、実時間に依存せず決定論的に検証する。
- `tests/e2e.test.js` — jsdom 上で `main.js` を起動し、クイズフロー（全問正解→勝利）・
  コンティニューフロー（時間切れ→連打成功→復帰）・タイマー一時停止（正解表示中は時間切れ
  しない）を検証する。

### jsdom について

E2E テストは **jsdom**（`package.json` の devDependency）を使う。`npm install` で導入すること。

```bash
npm install   # jsdom を node_modules に導入（E2Eを有効化）
```

jsdom が解決できない環境では E2E スイートは自動でスキップされ、単体・データ検証は通常どおり
実行される。非標準パスの jsdom を使う場合は環境変数 `JSDOM_PATH` で明示できる。

## GitHub Pages での公開について

公開済み: main ブランチ / `/ (root)` からの Deploy from a branch 方式。
main へ push すると1〜2分で上記URLに自動反映される。

注意: このリポジトリをプライベートに変更すると、Free プランでは GitHub Pages が
自動停止し公開URLが404になる（公開を維持する間は Public のままにすること）。

## 構成

```
index.html          # エントリーポイント(Pages のルート)
css/style.css        # スタイルシート（デザイントークン・画面別スタイル・演出keyframes）
js/main.js            # 状態機械（GameState管理・画面遷移制御）
js/engine/
  quizPicker.js        # シャッフル・10問抽選ロジック（DOM非依存）
  timer.js             # 耐久タイマー（performance.now()ベース、DOM非依存）
  escapeHtml.js        # innerHTML挿入用のエスケープ
  sfx.js               # 効果音（Web Audioオシレーター合成・外部音源不使用）
  records.js           # 店舗×温度ごとのベスト記録（localStorage永続化）
js/data/
  stores.js            # 店舗（サウナ）一覧データ
  tempConfig.js        # 温度モード別の持ち時間・ペナルティ設定
  questions-github.js  # 赤坂 GitHub 店の出題プール（30問）
js/screens/            # 画面ごとのUIモジュール（title/storeSelect/tempSelect/intro/quiz/continue/result/review）
tests/                # node --test 用のテスト（単体・データ検証・jsdom E2E）
assets/               # 画像・音声などの素材（現状未使用）
```
