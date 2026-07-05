# scene_08 クイズ化解禁記録（override log）

- 日付: 2026-07-06
- 判断者: Claude Fable 5 監査（beads: browser-game-h1n、監査レポート `FABLE_BROWSER_GAME_REVERSE_AUDIT.md` P0-1）

## 経緯

`scene_08_computer_use_and_settings` は以下の4段階の成果物すべてで一貫して `quiz_allowed:false` と判定されていた。

| 成果物 | 該当箇所 |
|--------|----------|
| `context_packets.jsonl` | `packet_id: scene_08_computer_use_and_settings` の `quiz_allowed: false` |
| `correction_report.json` | `field_changed: quiz_allowed` / `before: false` / `after: false`（変更なしを確認） |
| `packet_validation_report.md` | 「`quiz_allowed=false` かつ明示除外指定」として除外 |
| `quiz_review.md` | 「`quiz_allowed=false`／明示除外。…動画だけでは教材問題として断定不可」 |

にもかかわらず、orca-024〜026 の3問（`js/data/questions-orca.js`）が解禁判断の記録なしにそのまま実装・公開されていたことが監査（`FABLE_BROWSER_GAME_REVERSE_AUDIT.md`）で検出された。

## 解禁条件と充足

`quiz_review.md` 末尾「scene_08 の別扱い記録」に記載された解禁条件は以下の通り。

> 公式ドキュメントで前提ツール名・権限影響・安全要件が確認できた後に、「安全上の注意点」を問う設問として別途扱う候補

2026-07-06 の公式ドキュメント調査により、この条件は充足された。

## 製品特定

- 製品: Orca（stablyai 社の ADE = Agent Development Environment）
- 公式サイト: https://www.onorca.dev
- GitHub: https://github.com/stablyai/orca
- 元動画タイトル: 「【ガチおすすめ】複数AIを使えるIDE『Orca』を徹底解説！並列実行もモバイル連携も簡単にできます」
- 特定根拠: 並列worktree実行・カンバン形式のワークスペースボード・モバイル連携という動画内の特徴的機能が、上記公式製品の特徴と一致することを確認。

## 問題ごとの検証結果

| 問題ID | 検証結果 | 根拠 |
|--------|----------|------|
| orca-024 | 公式裏取り済(a) | https://www.onorca.dev/docs/cli/computer-use に、Orca CLI の導入と Accessibility/Screen Recording 権限（OS権限付与）が前提条件として明記されていることを確認 |
| orca-025 | 公式裏取り済(a) | 同ページに、native helpers がOSレベルで動作しシステム領域へ影響しうる旨が明記されていることを確認 |
| orca-026 | 動画固有の事実（公式裏取り対象外） | `context_packets.jsonl` の `scene_08_computer_use_and_settings` パケットの `visible_content`（「話者はインストールを実行せずにメニューを戻している」）および `audio_summary`（「話者は自身のメイン作業PC環境への影響に配慮して動画内での実行をスキップ」）により直接裏付け済み。製品仕様ではなく話者の行動に関する事実確認のため、公式ドキュメントでの裏取りはそもそも対象外。 |

## 補足: 「Orac CLI」表記の疑義

`context_packets.jsonl` の `unresolved_references` に記載された「Orac CLI または Orca CLI」の表記疑義について、公式ドキュメント調査により正式名称は「Orca CLI」であることを確認した。動画内UIテキストの見え方（画質・解像度起因の可能性）による表記ゆれであり、本件の正誤判定（orca-024〜026の選択肢・正解）には影響しない。

## 処置

- orca-024・orca-025・orca-026 とも、問題内容（questionText / choices / correctChoice / fakeMasaoLine 等）は一切変更せず維持した。
- orca-024・orca-025 の `sourceMemo` に、公式ドキュメントURLと裏取り内容を追記した。
- orca-026 は製品仕様ではなく動画固有の事実確認である旨を `reviewExplanation` と `sourceMemo` の両方に明記した。

## 残課題

- `quiz_potential:low`（`quiz_allowed:true`）で抽出ルールから除外された scene_01 由来の orca-001〜003 についても、無記録で本番混入していることが監査で判明している。こちらは scene_08 ほどの安全性リスクはないが、抽出ルール上の除外にもかかわらず実装されている点は同様の記録漏れであり、P1 として別途再評価する。
