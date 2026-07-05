# context_packets.jsonl 構造検証レポート

- 対象: `data/processed/orca_ide_review_001/context_packets.jsonl`
- 検証日: 2026-07-05
- 検証方法: Node.js による機械的パース・必須フィールド照合・enum値照合・`packet_id` 一意性チェック

## 総合結果

| 項目 | 結果 |
|------|------|
| JSONLパース（全行） | ✅ 10/10 行が有効なJSON |
| 必須フィールド充足 | ✅ 全パケットで欠落なし |
| `packet_id` 一意性 | ✅ 10件すべて一意 |
| `quiz_potential` enum（high/medium/low/none） | ✅ 全件正常 |
| `quiz_allowed` boolean | ✅ 全件boolean |
| `verification_needed` boolean | ✅ 全件boolean |
| `confidence` enum（high/medium/low） | ✅ 全件正常 |
| `alignment_status` 許可値 | ✅ 全件正常（aligned / partially_aligned / transcript_only） |

付随して `analysis_summary.json` と `correction_report.json` もJSONとしてパース可能であることを確認済み。

## 検証した必須フィールド一覧

`packet_id`, `source_id`, `time_range`, `topic`, `scene_role`, `visible_content`, `visible_text`, `audio_summary`, `speaker_focus`, `resolved_references`, `unresolved_references`, `visual_audio_alignment`, `resolved_meaning`, `core_concept`, `beginner_misunderstanding`, `evidence`, `claim_type`, `confidence`, `verification_needed`, `ui_volatility`, `ui_volatility_reason`, `quiz_potential`, `quiz_allowed`, `possible_questions`, `avoid_questions`, `recommended_question_focus`, `risk`

## パケット別サマリ

| packet_id | quiz_potential | quiz_allowed | confidence | verification_needed | alignment_status | ui_volatility |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| scene_01_intro_and_ux | low | true | high | true | aligned | medium |
| scene_02_initial_setup_and_project | medium | true | high | true | aligned | high |
| scene_03_worktree_parallel | high | true | high | true | aligned | medium |
| scene_04_quick_commands_and_history | high | true | high | true | aligned | high |
| scene_05_git_automation_and_editing | medium | true | high | true | aligned | medium |
| scene_06_workspace_board_kanban | high | true | high | true | aligned | medium |
| scene_07_orca_mobile_remote | high | true | high | true | aligned | medium |
| scene_08_computer_use_and_settings | medium | **false** | medium | true | partially_aligned | high |
| scene_09a_automation_and_repo_audit | medium | true | medium | true | partially_aligned | medium |
| scene_09b_channel_outro_and_membership | none | **false** | high | true | transcript_only | none |

## 問題化対象の抽出判定

抽出ルール:
```
quiz_allowed == true
AND quiz_potential in ["high","medium"]
AND confidence in ["high","medium"]
AND alignment_status not in ["ambiguous","conflict"]
かつ scene_08 / scene_09b は明示除外
```

| packet_id | 判定 | 理由 |
|-----------|:---:|------|
| scene_01_intro_and_ux | ❌ 除外 | `quiz_potential=low`（抽出条件のhigh/mediumを満たさない） |
| scene_02_initial_setup_and_project | ✅ 採用 | 全条件を満たす（中優先度） |
| scene_03_worktree_parallel | ✅ 採用 | 全条件を満たす（高優先度） |
| scene_04_quick_commands_and_history | ✅ 採用 | 全条件を満たす（高優先度） |
| scene_05_git_automation_and_editing | ✅ 採用 | 全条件を満たす（中優先度） |
| scene_06_workspace_board_kanban | ✅ 採用 | 全条件を満たす（高優先度） |
| scene_07_orca_mobile_remote | ✅ 採用 | 全条件を満たす（高優先度・概念問題限定） |
| scene_08_computer_use_and_settings | ❌ 除外 | `quiz_allowed=false` かつ明示除外指定 |
| scene_09a_automation_and_repo_audit | ✅ 採用 | 全条件を満たす（中優先度・`partially_aligned`は許容範囲内） |
| scene_09b_channel_outro_and_membership | ❌ 除外 | `quiz_allowed=false` `quiz_potential=none` かつ明示除外指定 |

採用: 7パケット（scene_02, 03, 04, 05, 06, 07, 09a）
除外: 3パケット（scene_01=low, scene_08=blocked, scene_09b=blocked）

備考:
- 採用7パケットはすべて `verification_needed=true` のため、公式仕様や細かいUI仕様を断定しない問題文に限定する（`quiz_candidates.jsonl` の各問で `official_verification_required` と `do_not_assert` を明記）。
