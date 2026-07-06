# 教材生成パイプライン用プロンプト

学習ゲームの問題データ（`js/data/questions-*.js`）を、動画・記事素材から段階的に生成するためのプロンプト集。

## パイプライン全体像

```text
① 01_gemini_source_analysis.md をGeminiに貼る
   入力: YouTube / note・blog / 画像 + theme_id
   出力: 一次資料（ANALYSIS_SUMMARY / CONTEXT_PACKETS_JSONL / REVIEW_NOTES）

② 02_claude_code_quiz_candidates.md をClaude Codeに貼り、①の出力を貼り付け欄に貼る
   出力: data/processed/[theme_id]_[source_id]/ 一式
        （原文保存・検証済みJSON/JSONL・correction_report・quiz_candidates.jsonl・quiz_review.md）

③ 変換フェーズ（プロンプト未作成・別途作成予定）
   quiz_candidates.jsonl → js/data/questions-{theme}.js
   ※ 02 の「ゲームスキーマへの対応表」と「quiz_allowed ゲート」を必ず引き継ぐこと
   ※ 変換後は tests/helpers/pools.js に登録し npm test でデータ検証を通すこと
```

## 運用ルール

- **2つのプロンプトはスキーマ・許可値を共有している。** 片方を改訂したら必ずもう片方との整合を確認する（enum一覧、3部構成の見出し名、パケットスキーマ）。
- **02 の quiz_candidates スキーマはゲーム実スキーマに追随する。** `js/data/questions-github.js` の `GithubQuestion` 型や `tests/data.test.js` の不変条件を変えたら、02 の「choices / correct_choice の規則」「対応表」を更新する。
- **`quiz_allowed: false` の解禁は override 記録必須。** `data/processed/[フォルダ]/overrides/<packet_id>_unblock_record.md` に裏取りと解禁条件の充足を記録してから問題化する（先行事例: `data/processed/orca_ide_review_001/scene08_unblock_record.md`）。

## 改訂履歴

### v2.0（2026-07-06）

初版運用（orca_ide_review_001）で実際に起きた問題のレビュー結果を反映。

**01（Gemini用）の主な変更**

- 工程0「素材アクセス確認」を追加（未視聴素材の捏造解析を禁止。`material_access_evidence` で視聴証拠を要求）
- 出力3部の区切りを機械抽出可能な形式に固定（`## ANALYSIS_SUMMARY` 等の見出し＋コードフェンス完全一致）
- `analysis_summary` に `source_urls` / `author_or_channel` / `published_date` / `analysis_date` / `material_duration_or_length` / `material_access_evidence` を追加（後の公式裏取りで製品特定に苦労した実績への対応）
- `verification_needed` のデフォルトを true に反転（初版でGeminiが4パケットを過少判定した実績への対応）
- boolean へのコメント付加（`true://補足`）の禁止に加え、「注釈は risk / unresolved_references へ書く」という逃げ道を明示（初版で実際に混入した実績への対応）
- `resolved_references` をオブジェクトから配列に変更（同一指示語の複数出現によるキー衝突を解消）
- `time_range` の非動画素材での扱い（null）と HH:MM:SS 形式を定義
- `review_notes` に `skipped_ranges` を追加（無言スキップの防止）
- スキーマ例の値はプレースホルダである旨を明記（例の固定値へのバイアス防止）

**02（Claude Code用）の主な変更**

- quiz_candidates スキーマをゲーム実スキーマ（`GithubQuestion` / `tests/data.test.js`）に整合：`answer_index` を廃止し `correct_choice`（文字列完全一致）へ、`choices[0]` は「正しい」固定、`is_statement_correct` との整合規則、`success_line_draft` / `failure_line_draft` を追加、変換用対応表を掲載
- 問題形式の記述を実装どおり「単段階4択」に修正（旧記述の二段階回答は実装と不一致だった）
- **quiz_allowed ゲート**を明文化：全候補は `quiz_allowed: true` パケット由来であることを機械チェック。false の解禁は override 記録必須（scene_08 の無記録解禁が監査で検出された実績への対応）
- `correction_report.json` を正式成果物化し、**再判定工程**（verification_needed / quiz_allowed の見直しと before/after 記録）を必須化
- quiz_candidates.jsonl 自体の機械検証を必須化（quiz_id 一意性、choices 規則、ゲート、比率・分布チェック）
- 検証はスクリプト必須（目視のみ禁止）と明記し、検証スクリプトの作成・実行を許可事項に追加
- 出力フォルダの衝突ルール（既存フォルダは触らず連番繰り上げ）と theme_id / source_id のサニタイズ（`[a-z0-9_]`）を追加
- CLAUDE.md の「push必須」「bd利用」より本プロンプトの禁止事項が優先する旨を明記
- 1パケット複数問題の許可と、複数パケット横断問題のための `packet_ids`（配列）化
- 難易度分布の目安を追加（既存実績 easy 10 / normal 14 / hard 6 ベース）
- パケット必須フィールドの明示列挙と、enum検証への `scene_role` 追加

### v1.0（2026-07-05以前）

初版。orca_ide_review_001 の処理に使用。
