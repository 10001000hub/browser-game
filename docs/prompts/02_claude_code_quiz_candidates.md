# Claude Code用プロンプト：Gemini一次資料の保存・検証・学習ゲーム用問題候補化

<!--
version: 2.0 (2026-07-06)
パイプライン第2工程。使い方・改訂履歴は docs/prompts/README.md を参照。
改訂時は 01_gemini_source_analysis.md とスキーマ・許可値の整合を必ず保つこと。
quiz_candidates スキーマは js/data/questions-github.js の GithubQuestion 型および
tests/data.test.js の不変条件と1対1対応している。ゲーム側スキーマを変えたら本ファイルも更新すること。
以下の水平線から下を、そのままClaude Codeに貼り付けて使う。
-->

---

## 目的

Geminiが作成した一次資料を、学習ブラウザゲーム用の問題候補データへ変換してください。

ただし、いきなり最終ゲームデータを作らないでください。

今回の目的は以下です。

1. Gemini出力を原文保存する
2. `ANALYSIS_SUMMARY`、`CONTEXT_PACKETS_JSONL`、`REVIEW_NOTES` を分離保存する
3. JSON / JSONLとして**機械的に**検証する（目視のみの検証は禁止）
4. `verification_needed` / `quiz_allowed` を再判定し、修正を `correction_report.json` に記録する
5. 問題化してよい文脈パケットだけを抽出する（`quiz_allowed` ゲート厳守）
6. 学習ゲーム用の問題候補 `quiz_candidates.jsonl` を生成する
7. `quiz_candidates.jsonl` 自体も機械的に検証する
8. レビュー用Markdownを作成する
9. 最終的に、次工程で `questions-{theme}.js` に変換できる状態にする

---

## 作業対象

現在のリポジトリを作業対象としてください。

想定パス：

```bash
cd /home/user/projects/active/browser-game
```

作業前に以下を確認してください。

```bash
pwd
git rev-parse --show-toplevel
git status --short --branch
```

---

## 重要制約

今回の作業は、Gemini一次資料の保存・検証・問題候補化です。

禁止事項：

```text
- 既存ゲームロジックの変更
- 既存 questions-*.js の上書き
- 既存テーマデータの破壊
- 既存の data/processed/ 配下フォルダの変更・削除・追記（新規フォルダの作成のみ可）
- index.html / js/main.js / stores.js の変更
- package.json の変更
- git commit
- git push
- デプロイ
- beads / bd への書き込み
```

**優先順位の明確化：** このリポジトリの CLAUDE.md には「Session Completion で git push 必須」「タスク管理は bd」とありますが、**本プロンプトの禁止事項が優先します**。この作業ではコミット・プッシュ・bd書き込みを行わず、最終報告のみで終了してください。

許可事項：

```text
- 新規フォルダ作成
- Gemini出力の原文保存
- JSON / JSONL 分離保存
- 使い捨て検証スクリプト（Node.js）の作成と実行
  （出力フォルダ内に validate_packets.mjs / validate_candidates.mjs として保存してよい）
- バリデーションレポート作成
- correction_report.json 作成
- quiz_candidates.jsonl 作成
- quiz_review.md 作成
- 必要なら変換用の下書きスクリプト案をMarkdownに記録
```

**検証は必ずスクリプトで機械的に行ってください。** 過去の実行で、Gemini出力に `"quiz_allowed":true://補足` のようなインラインコメントや trailing comma が実際に混入した実績があります。目視では見逃します。

---

## 入力

このプロンプトの下に、Geminiが出力した一次資料を貼ります。

Gemini出力（プロンプトv2）は、以下の見出しとコードフェンスで区切られています。まずこの区切りで3部を抽出してください。

```text
## ANALYSIS_SUMMARY   （```json フェンス内にJSONオブジェクト1つ）
## CONTEXT_PACKETS_JSONL （```jsonl フェンス内に1行1オブジェクト）
## REVIEW_NOTES       （```json フェンス内にJSONオブジェクト1つ）
```

この区切りが無い旧形式・崩れた形式の場合は、構造から3部を推定して抽出し、推定した旨を `packet_validation_report.md` に記録してください。

---

## 出力先

以下のフォルダを作成してください。

```text
data/processed/[theme_id]_[source_id]/
```

規則：

```text
- theme_id / source_id は Gemini出力の analysis_summary から取得する
- 取得した値に [a-z0-9_] 以外の文字が含まれる場合はアンダースコアに置換し、
  置換したことを packet_validation_report.md に記録する
- 同名フォルダが既に存在する場合は、上書き・追記せず、
  末尾連番を繰り上げた新フォルダ（例: orca_ide_review_002）を作成し、
  理由を packet_validation_report.md に記録する
- theme_id / source_id が不明な場合は data/processed/manual_source_001/ を使う
```

---

## 作成するファイル

以下を作成してください。

```text
raw_gemini_output.md
analysis_summary.json
context_packets.jsonl
review_notes.json
correction_report.json
packet_validation_report.md
quiz_candidates.jsonl
quiz_review.md
validate_packets.mjs      （推奨）
validate_candidates.mjs   （推奨）
```

---

## 各ファイルの役割

### raw_gemini_output.md

Gemini出力を原文のまま保存してください。
後で検証できるよう、一切要約せず保存します。

---

### analysis_summary.json

Gemini出力の `ANALYSIS_SUMMARY` をJSONとして保存してください。

JSONとして壊れている場合は、修正したうえで保存してください。
修正点は `correction_report.json` に記録してください。

---

### context_packets.jsonl

Gemini出力の `CONTEXT_PACKETS_JSONL` を保存してください。

1行1JSONオブジェクトにしてください。
JSONL内にMarkdown、コメント、壊れたboolean、trailing commaを含めないでください。
修正した場合は `correction_report.json` に記録してください。

---

### review_notes.json

Gemini出力の `REVIEW_NOTES` をJSONとして保存してください。

---

### correction_report.json 【必須】

Gemini出力に加えた**すべての修正・再判定**を、before/after形式で記録してください。修正が1件も無い場合も、空の配列を持つファイルを作成してください。

```json
{
  "json_validity_fixes": [
    "どのパケットの、どの壊れ方を、どう修正したか"
  ],
  "safety_reclassifications": [
    {
      "packet_id": "対象packet_id",
      "field_changed": "verification_needed",
      "before": false,
      "after": true,
      "reason": "なぜ再判定したか"
    }
  ],
  "split_packets": [
    {
      "before": "分割前のpacket_id",
      "after": ["分割後のpacket_id1", "分割後のpacket_id2"],
      "reason": "なぜ分割したか"
    }
  ]
}
```

---

### packet_validation_report.md

以下を**スクリプトで**検証して記録してください。

```text
- analysis_summary.json / review_notes.json がJSONとしてパース可能か
- context_packets.jsonl の各行がJSONとしてパース可能か
- 各パケットに必須フィールドが揃っているか（下の必須フィールド一覧で明示的にチェック）
- packet_id が一意か
- enum フィールドが許可値か（scene_role を含む全enum）
- quiz_allowed / verification_needed が純粋な boolean か
- 問題化禁止にすべきパケットが混入していないか
```

パケットの必須フィールド一覧：

```text
packet_id, source_id, theme_id, time_range, source_location, topic, scene_role,
visible_content, visible_text, text_or_audio_summary, speaker_or_author_focus,
resolved_references, unresolved_references, visual_text_alignment,
resolved_meaning, core_concept, beginner_misunderstanding, evidence,
claim_type, confidence, verification_needed, ui_volatility, ui_volatility_reason,
quiz_potential, quiz_allowed, possible_questions, avoid_questions,
recommended_question_focus, risk
```

（`time_range` は動画以外の素材では null が正しい値です）

enum の許可値：

```text
scene_role:
intro | concept_explanation | ui_demo | workflow_demo | safety_warning | comparison | setup | summary | outro | other

quiz_potential:
high | medium | low | none

confidence:
high | medium | low

alignment_status:
aligned | partially_aligned | ambiguous | conflict | visual_only | text_only

claim_type:
fact | interpretation | recommendation | speculation | mixed

ui_volatility:
high | medium | low | none

recommended_question_focus:
concept | purpose | workflow | risk | comparison | terminology | setup | not_recommended
```

---

## 再判定工程 【必須】

機械検証の後、候補抽出の**前**に、全パケットについて以下を再判定してください。

```text
1. verification_needed の再判定:
   UI・手順・設定項目・料金・権限・外部連携・選択可能なエージェント一覧など、
   バージョン更新で変わりうる内容を含むのに false になっているパケットは true に変更する。
   （過去の実行で、Geminiが4パケットを過少判定した実績がある）

2. quiz_allowed の再判定:
   quiz_allowed の判断基準（ambiguous / conflict / confidence low / 宣伝主題など）に
   反して true になっているパケットは false に変更する。

3. 変更はすべて correction_report.json に before/after/reason で記録する。

4. Geminiの判定を「緩める」方向の変更は原則禁止:
   - verification_needed: true → false への変更は行わない
   - quiz_allowed: false → true への変更は、後述の override 手続きなしには行わない
```

---

## 問題化対象の抽出ルール

原則として、以下の条件を満たすパケットだけを問題候補化してください。

```text
quiz_allowed == true
quiz_potential in ["high", "medium"]
confidence in ["high", "medium"]
alignment_status not in ["ambiguous", "conflict"]
```

ただし、以下に該当するパケットは除外してください。

```text
- scene_role が outro
- scene_role が other で、主題が告知・宣伝・コミュニティ案内
- recommended_question_focus が not_recommended
- quiz_allowed が false
- confidence が low
- Computer Use、PC権限、CLIインストール、料金、セキュリティなどを未検証で断定する必要があるもの
- UIの位置、色、見た目だけを問う内容になりそうなもの
```

### quiz_allowed ゲート 【厳守】

```text
- quiz_candidates.jsonl の全問は、quiz_allowed: true のパケットのみに由来しなければならない
  （validate_candidates.mjs で機械チェックする）

- quiz_allowed: false のパケットを問題化したい場合は、この工程では行わない。
  以下の override 手続きを経た場合のみ、後続の別作業として許可される:
  1. 公式ドキュメント等での裏取りを完了する
  2. data/processed/[フォルダ]/overrides/<packet_id>_unblock_record.md を作成し、
     日付・判断根拠・解禁条件の充足・裏取りURL・対象問題IDを記録する
  3. 記録なしの解禁は監査違反として扱う
  （過去に scene_08 で、全成果物が quiz_allowed: false だったにもかかわらず
   3問が無記録で実装され、後日の監査で検出された実績がある）
```

`verification_needed: true` のパケットは、完全除外ではありません。
ただし、以下のように扱ってください。

```text
- 公式仕様を断定する問題は作らない
- 動画や記事内で観察できた範囲に限定する
- 「目的」「概念」「誤解訂正」中心の問題にする
- 料金・権限・通信方式・セキュリティ仕様は断定しない
- official_verification_required: true を付ける
```

パケットと問題数の対応：

```text
- 1つのパケットから複数の問題を作ってよい（目的 / 誤解訂正 / 比較 など角度を変える）
- 複数パケットにまたがる比較問題を作る場合は、packet_ids に該当パケットをすべて列挙する
```

---

## quiz_candidates.jsonl のスキーマ

`quiz_candidates.jsonl` は、1行1問のJSONLにしてください。

このスキーマは、ゲーム本体のスキーマ（`js/data/questions-github.js` の `GithubQuestion` 型。`tests/data.test.js` が機械検証している）と1対1で対応しています。

**例の値はすべてプレースホルダです。**

```json
{
  "quiz_id": "orca_q_001",
  "source_id": "source_id",
  "theme_id": "theme_id",
  "packet_ids": ["scene_03_core_concept"],
  "question_type": "fake_masao_statement_4choice",
  "difficulty": "easy | normal | hard",
  "topic": "問題のトピック",
  "fake_masao_statement": "偽まさおの発言として表示する文（口語・断定調）",
  "is_statement_correct": false,
  "choices": [
    "正しい",
    "発言の誤りを正確に指摘する選択肢",
    "もっともらしいが誤りの選択肢",
    "もっともらしいが誤りの選択肢"
  ],
  "correct_choice": "choices内の文字列と完全一致する正解",
  "success_line_draft": "正解時の偽まさおの捨て台詞（下書き）",
  "failure_line_draft": "不正解時の偽まさおの煽り台詞（下書き）",
  "review_explanation": "復習画面に出す解説（3〜5文）",
  "source_memo": "根拠になった文脈パケットの要約",
  "core_concept": "この問題で理解させたい中心概念",
  "misunderstanding_target": "この問題で修正したい初心者の誤解",
  "evidence_summary": "根拠の要約",
  "ui_dependency": "low | medium | high",
  "verification_needed": false,
  "official_verification_required": false,
  "do_not_assert": [
    "断定してはいけない内容"
  ],
  "status": "draft"
}
```

### choices / correct_choice の規則（tests/data.test.js の不変条件と同一）

```text
- choices はちょうど4件、重複なし
- choices[0] は必ず文字列「正しい」（既存データの慣例に合わせ先頭固定）
- correct_choice は choices のいずれかと完全一致する文字列（インデックスではない）
- is_statement_correct が true のとき、correct_choice は「正しい」
- is_statement_correct が false のとき、correct_choice は「正しい」以外の、
  発言の誤りを最も正確に指摘する選択肢
- 誤り選択肢（ディストラクタ）は、もっともらしいが明確に誤りと判別できる内容にする。
  明らかなネタ枠は1問につき1つまで
```

### ゲームスキーマへの対応表（次工程の変換フェーズで使用）

| quiz_candidates | GithubQuestion（questions-*.js） |
|---|---|
| quiz_id | id（変換時に `orca-001` 形式へ振り直し） |
| theme_id | storeId |
| topic | topic |
| difficulty | difficulty |
| fake_masao_statement | fakeMasaoLine |
| （変換時に固定文言を付与） | questionText = 「この発言は正しいか？間違っている場合は、最も正確な理由を選べ。」 |
| choices | choices |
| correct_choice | correctChoice |
| is_statement_correct | isFakeMasaoCorrect |
| success_line_draft | successLine（変換時に推敲） |
| failure_line_draft | failureLine（変換時に推敲） |
| review_explanation | reviewExplanation |
| source_memo | sourceMemo |

`packet_ids` / `evidence_summary` / `verification_needed` / `official_verification_required` / `do_not_assert` / `status` は候補管理用フィールドであり、変換時に questions-*.js へは持ち込みません（トレーサビリティのため、変換時に quiz_review.md へ対応を記録します）。

---

## 問題形式の方針

このゲームは二段階回答ではなく、**単段階の4択**です。

```text
偽まさおの発言を提示
→ プレイヤーは4択（「正しい」＋理由3つ）から最も正確な判断を1つ選ぶ
→ 解説（review_explanation）で誤解を修正する
```

問題は、単なる暗記ではなく、初心者の誤解を修正する形式にしてください。

---

## 良い問題の条件

以下を問う問題を優先してください。

```text
- 機能の目的
- 概念の違い
- 初心者の誤解
- ワークフローの意味
- 安全上の注意点
- UI変更に強い概念
- 実務上の判断
- 何をしてよく、何を断定してはいけないか
```

---

## 悪い問題の条件

以下の問題は作らないでください。

```text
- ボタンが画面のどこにあるか
- UIの色やアイコン
- 一時的なリリース時間
- 話者の主観的おすすめ度
- メンバーシップやDiscord告知
- Computer Useの具体的なインストール手順
- 外部サービス連携の仕様断定
- 外出先から使えるかどうかの断定
- 料金・権限・セキュリティに関する未検証の断定
- 公式確認が必要なことを、確定事実として扱う問題
```

---

## 難易度の目安と分布

```text
easy:
用語の役割、基本目的、初心者の大きな誤解を問う

normal:
ワークフロー、機能の使い分け、複数概念の関係を問う

hard:
安全性、未検証仕様、抽象的な設計判断、運用上の注意を問う
```

分布の目安（既存実績: questions-orca.js は easy 10 / normal 14 / hard 6）：

```text
easy: 30〜35%
normal: 45〜50%
hard: 15〜25%
```

---

## true / false 比率

最初の候補生成では、以下を目安にしてください。

```text
正しい発言（is_statement_correct: true）: 30〜40%
誤った発言（is_statement_correct: false）: 60〜70%
```

理由：
このゲームは、偽まさおの誤解を訂正する形式なので、誤った発言がやや多い方が学習効果が高いです。

ただし、全問が誤りになると単調になるため、正しい発言も一定数含めてください。

---

## 問題候補数

1テーマあたりの標準は以下です。

```text
最小: 10問（ゲーム側の tests/data.test.js が「プール10問未満は抽選不成立」として弾く）
標準: 20〜30問
充実: 40問以上
```

今回の処理では、Gemini一次資料から作れる範囲で、まずは以下を目標にしてください。

```text
高品質候補: 10〜20問
追加候補: 可能なら20〜30問
```

素材が不足している場合は、水増ししないでください。
候補が10問に満たない場合は、その旨と不足内容を `quiz_review.md` に記録してください。

---

## quiz_candidates.jsonl の機械検証 【必須】

生成後、`validate_candidates.mjs` で以下をチェックし、結果を `packet_validation_report.md` に追記してください。

```text
- 各行がJSONとしてパース可能か
- quiz_id が一意か
- packet_ids の全要素が context_packets.jsonl に実在するか
- packet_ids の全要素が quiz_allowed: true のパケットか（quiz_allowed ゲート）
- choices がちょうど4件・重複なし・choices[0] == "正しい"
- correct_choice が choices に含まれるか
- is_statement_correct と correct_choice の整合
  （true ⇔ correct_choice == "正しい"）
- difficulty が easy | normal | hard か
- ui_dependency が low | medium | high か
- boolean フィールドが純粋な boolean か
- is_statement_correct: true の比率が 30〜40% か（逸脱する場合は理由を記録）
- difficulty 分布が目安に近いか（逸脱する場合は理由を記録）
```

---

## quiz_review.md の内容

`quiz_review.md` には以下を書いてください。

```text
1. 問題化したpacket一覧
2. 問題化しなかったpacket一覧と理由
3. UI依存が残る問題候補
4. 公式確認が必要な問題候補
5. 初心者向けとして良い問題候補
6. 削除すべき問題候補
7. 追加素材が必要な概念
8. 次に公式確認すべき項目
9. questions-*.js に変換する前の注意点
10. quiz_allowed: false パケット由来で、公式裏取り後に override 候補にしたい問題が
    あれば、その一覧と解禁条件（override 手続きは本プロンプトの「quiz_allowed ゲート」参照）
```

---

## 最終成果物

最終的に以下を作成してください。

```text
data/processed/[theme_id]_[source_id]/raw_gemini_output.md
data/processed/[theme_id]_[source_id]/analysis_summary.json
data/processed/[theme_id]_[source_id]/context_packets.jsonl
data/processed/[theme_id]_[source_id]/review_notes.json
data/processed/[theme_id]_[source_id]/correction_report.json
data/processed/[theme_id]_[source_id]/packet_validation_report.md
data/processed/[theme_id]_[source_id]/quiz_candidates.jsonl
data/processed/[theme_id]_[source_id]/quiz_review.md
data/processed/[theme_id]_[source_id]/validate_packets.mjs      （推奨）
data/processed/[theme_id]_[source_id]/validate_candidates.mjs   （推奨）
```

---

## 最終報告形式

作業完了後、以下の形式で報告してください。

```text
Claude Code Result:
- Created folder:
- Saved raw Gemini output: yes/no
- analysis_summary.json valid: yes/no
- context_packets.jsonl valid: yes/no
- review_notes.json valid: yes/no
- correction_report.json created: yes/no（修正件数: N件）
- Number of context packets:
- Number of quiz candidates:
- quiz_candidates validation passed: yes/no
- quiz_allowed gate violations: 0 であること（0以外なら候補から除去して再検証）
- Excluded packets: （packet_id と理由を列挙）
- Packets requiring official verification:
- true/false ratio:
- difficulty distribution:
- Ready for questions-*.js conversion: yes/no/conditional
- Biggest risk:
- Recommended next action:
```

---

## 作業姿勢

```text
- まず保存
- 次に機械検証（目視のみは禁止）
- 次に再判定と correction_report への記録
- 次に抽出（quiz_allowed ゲート厳守）
- 最後に問題候補化と候補の機械検証
- 不明点は推測で補わない
- 未検証仕様は断定しない
- UI依存問題は避ける
- 安全・権限・料金・外部連携は慎重に扱う
- 宣伝パートは除外する
- Geminiの安全側の判定（verification_needed: true / quiz_allowed: false）を黙って緩めない
- 最終ゲームデータへの変換は、別フェーズに残す
```

---

# Gemini出力貼り付け欄

以下に、Geminiが出力した一次資料を貼り付けてください。

```text
[ここにGeminiの ANALYSIS_SUMMARY / CONTEXT_PACKETS_JSONL / REVIEW_NOTES を貼る]
```
