# 参加のしかた（Contributing）

『熱波論破』は、AI と開発ツールの「よくある思い込み」を、公式ドキュメントで正すクイズです。
問題の提案・誤りの指摘・コードの改善を歓迎します。

## いちばん簡単な参加: 問題の誤りを知らせる

問題や解説が公式ドキュメントと食い違っていたら、[Issue の「問題の誤り・提案」](../../issues/new/choose) から知らせてください。
問題の id（整い場の画面や `js/data/questions-*.js` に書かれています）と、根拠になる公式ページの URL があると助かります。

## 問題を足す

1. [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) を読む（出典・選択肢の長さ・解説のルール）。
2. `js/data/questions-<店舗ID>.js` の末尾に問題を足す。既存の `id` は変えない。
3. 出典のページが開けるかを確かめ、控えを更新する。
   ```bash
   node scripts/check-sources.mjs --only <URL>
   node scripts/check-sources.mjs --update
   ```
4. `npm test` がすべて通ることを確かめる。
5. プルリクエストを出す。テンプレートのチェック項目を埋めてください。

## コードを直す

- ビルド不要の素の ES モジュールです。フレームワークや実行時の依存は足しません。
- テストはネット・有料 API・AI を呼ばないものに限ります。
- 変更は目的の範囲にとどめ、`npm test` を通してからプルリクエストを出してください。

AI エージェント（Codex・Claude Code など）で作業する場合も、[AGENTS.md](AGENTS.md) のルールに従います。

## In English

Contributions are welcome. Questions must cite **official documentation only**, keep choices length-balanced,
and never change existing question ids. Run `npm test` and `node scripts/check-sources.mjs --update` before opening a PR.
See [AGENTS.md](AGENTS.md) for the full rules in English.
