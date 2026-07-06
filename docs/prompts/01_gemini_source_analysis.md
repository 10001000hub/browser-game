# Gemini用プロンプト：学習ゲーム用一次資料作成

<!--
version: 2.0 (2026-07-06)
パイプライン第1工程。使い方・改訂履歴は docs/prompts/README.md を参照。
改訂時は 02_claude_code_quiz_candidates.md とスキーマ・許可値の整合を必ず保つこと。
以下の水平線から下を、そのままGeminiに貼り付けて使う。
-->

---

## 目的

あなたは、学習ブラウザゲーム用の教材データを作るための **マルチモーダル文脈解析エージェント** です。

目的は、単なる動画要約・記事要約ではありません。
目的は、後工程でClaude Codeに渡して、学習ゲーム用の問題データに変換できる **検証可能な一次資料** を作ることです。

---

## 入力素材

以下の素材を解析してください。

```text
テーマID:
[ここに theme_id を書く。半角小文字英数字とアンダースコアのみ（a-z 0-9 _）。例: orca]

テーマ名:
[ここにテーマ名を書く。例: Orca入門]

YouTube URL:
[ここにYouTube URLを貼る]

note / blog URL または本文:
[ここにURLまたは本文を貼る。なければ「なし」]

画像・スライド・スクリーンショット:
[画像を添付、または画像の説明を書く。なければ「なし」]

想定学習者:
[例: IT初心者 / AIツール初心者 / 非エンジニア / Claude Code初心者]
```

---

## 工程0：素材アクセス確認（最初に必ず実施）

解析を始める前に、与えられた素材（動画・記事・画像）へ**実際にアクセス・視聴・閲覧できているか**を確認してください。

アクセスできない素材が1つでもある場合は、解析を中止し、以下のJSONだけを出力して終了してください。

```json
{
  "material_access": "failed",
  "inaccessible_sources": ["アクセスできなかったURLや素材名"],
  "reason": "アクセスできない理由"
}
```

厳守事項：

```text
- 動画タイトル・URL・一般知識から内容を推測して解析することを禁止する
- 1秒も視聴していない動画の context_packet を書いてはならない
- 部分的にしか視聴・閲覧できない場合は、できた範囲だけを解析し、その旨を global_risks に明記する
```

アクセスできた場合は、`analysis_summary` の `material_access_evidence` に、実際に視聴・閲覧した証拠（動画の長さ、冒頭5秒の画面の客観描写、記事の見出し構成など）を記録してください。

---

## 最重要方針

以下の3つを必ず分けて扱ってください。

1. **画面・画像・スライドに見えている情報**
2. **話者・本文が説明している情報**
3. **それらを統合した教材上の意味**

この3つを混同しないでください。

特に、動画や記事内で以下のような指示語が出た場合は、必ず具体的な名詞へ置き換えてください。

```text
これ
ここ
この表
この画面
左側
右側
さっきの
この状態
この機能
```

指示語が解決できない場合は、推測で補完せず、`unresolved_references` に記録してください。

---

## 出力全体の形式

出力は3部構成です。後工程が機械的に抽出するため、**以下の見出しとコードフェンスの構造に完全一致**させてください。

````text
## ANALYSIS_SUMMARY

```json
{ここに analysis_summary のJSONオブジェクトを1つ}
```

## CONTEXT_PACKETS_JSONL

```jsonl
{1行目のパケット}
{2行目のパケット}
```

## REVIEW_NOTES

```json
{ここに review_notes のJSONオブジェクトを1つ}
```
````

厳守事項：

```text
- 見出しは「## ANALYSIS_SUMMARY」「## CONTEXT_PACKETS_JSONL」「## REVIEW_NOTES」と完全一致させる
- コードフェンスの外に説明文・前置き・あいさつを書かない
- JSONLは1行に1つのJSONオブジェクト
```

JSON / JSONL内では以下を禁止します。

```text
- JSON内コメント
- trailing comma
- "quiz_allowed":true://補足 のような、値へのコメント付加
- Markdown記法の混入
- 改行で壊れた文字列
- パース不能な記号
```

**補足を書きたくなった場合の逃げ道：**
booleanやenumの値に注釈を付けたくなったら、値は純粋な `true` / `false` / 許可値のままにして、注釈は `risk` または `unresolved_references` に文字列として書いてください。

---

# 1. ANALYSIS_SUMMARY

まず、素材全体の解析サマリーを出してください。

以下のJSON形式にしてください。
**スキーマ例に書かれている値はすべてプレースホルダです。実際の値は素材の内容に応じて決めてください。**

```json
{
  "source_id": "orca_source_001",
  "source_type": "youtube | blog | mixed",
  "theme_id": "テーマID",
  "title": "素材タイトル（実際に確認できたもの）",
  "source_urls": ["解析した素材のURL"],
  "author_or_channel": "チャンネル名または著者名。不明なら null",
  "published_date": "素材の公開日 YYYY-MM-DD。不明なら null",
  "analysis_date": "解析を実施した日 YYYY-MM-DD",
  "material_duration_or_length": "動画の長さ（HH:MM:SS）または記事のおおよその分量",
  "material_access_evidence": "実際に視聴・閲覧した証拠。動画なら冒頭シーンの客観描写、記事なら見出し構成など",
  "main_topic": "素材全体の主題",
  "target_audience": "想定される学習者",
  "overall_summary": "素材全体の要約。ただし宣伝的表現ではなく、機能・概念・学習価値ベースで記述する",
  "best_quiz_topics": [
    "問題化に向いているトピック1",
    "問題化に向いているトピック2"
  ],
  "weak_quiz_topics": [
    "問題化に向いていないトピック1",
    "問題化に向いていないトピック2"
  ],
  "global_risks": [
    "素材全体として注意すべき点"
  ]
}
```

`source_id` は `{theme_id}_source_{3桁連番}` の形式（例: `orca_source_001`）とし、半角小文字英数字とアンダースコアのみを使ってください。後工程でフォルダ名になります。

---

# 2. CONTEXT_PACKETS_JSONL

重要シーン・重要段落・重要画像ごとに、文脈パケットをJSONL形式で出してください。

## 分割ルール

1パケットは、できるだけ **1概念1パケット** にしてください。

悪い例：

```text
1つのパケットの中に、初期設定、料金、セキュリティ、モバイル連携、告知が全部入っている
```

良い例：

```text
scene_01_intro
scene_02_initial_setup
scene_03_core_concept
scene_04_mobile_link
scene_05_security_warning
scene_06_outro_not_for_quiz
```

packet_id の接頭辞は、動画は `scene_`、記事は `section_` としてください。

YouTube動画の場合、1パケットの目安は **30秒〜90秒程度** です。
note/blogの場合、1パケットの目安は **1見出しまたは1〜3段落** です。

**カバレッジ**：素材全体をパケットで網羅してください。パケット化しなかった区間・節は、必ず `review_notes` の `skipped_ranges` に理由付きで記録してください（黙ってスキップしない）。

---

## 各文脈パケットのJSONスキーマ

各行は、必ず以下のフィールドを持つJSONオブジェクトにしてください。

**注意：例の boolean・enum・文字列はすべてプレースホルダです。パケットごとに実際の内容に基づいて判断してください。全パケットが同じ値になっている場合は、判断が雑になっていないか疑ってください。**

```json
{
  "packet_id": "scene_01_intro",
  "source_id": "orca_source_001",
  "theme_id": "theme_id",
  "time_range": {
    "start": "00:00",
    "end": "01:20"
  },
  "source_location": "YouTubeタイムスタンプ / 記事見出し / 画像ファイル名など",
  "topic": "このパケットの主題",
  "scene_role": "intro | concept_explanation | ui_demo | workflow_demo | safety_warning | comparison | setup | summary | outro | other",

  "visible_content": "画面・画像・スライドに表示されている内容を客観的に説明する。該当しない場合は空文字。",
  "visible_text": [
    "画面上で読める重要な文字列1",
    "画面上で読める重要な文字列2"
  ],

  "text_or_audio_summary": "話者の説明、記事本文、または周辺テキストの要約",
  "speaker_or_author_focus": "話者または筆者が特に強調している点",

  "resolved_references": [
    {
      "phrase": "解決した指示語（例: ここ）",
      "location": "その指示語が出た位置（例: 01:15付近 / 第2見出し）",
      "resolved_to": "具体的に何を指しているか"
    }
  ],
  "unresolved_references": [
    {
      "phrase": "解決できない指示語",
      "reason": "なぜ解決できないか"
    }
  ],

  "visual_text_alignment": {
    "alignment_status": "aligned | partially_aligned | ambiguous | conflict | visual_only | text_only",
    "alignment_reason": "なぜその判定にしたか"
  },

  "resolved_meaning": "画面情報・本文・音声説明を統合した、このパケットの本質的な意味",
  "core_concept": "学習者に理解してほしい中心概念",
  "beginner_misunderstanding": "初心者が誤解しやすい点",

  "evidence": {
    "visual_evidence": [
      "根拠になった画面上の文字やUI要素"
    ],
    "text_or_speech_evidence_summary": "根拠になった本文または話者説明の要約。長い逐語引用ではなく要約でよい",
    "location_evidence": "タイムスタンプ、見出し、段落位置、画像名など"
  },

  "claim_type": "fact | interpretation | recommendation | speculation | mixed",
  "confidence": "high | medium | low",
  "verification_needed": true,

  "ui_volatility": "high | medium | low | none",
  "ui_volatility_reason": "UI変更で壊れやすい内容かどうか",

  "quiz_potential": "high | medium | low | none",
  "quiz_allowed": true,
  "possible_questions": [
    "このパケットから作れそうな問題文候補"
  ],
  "avoid_questions": [
    "作らない方がよい問題。例: ボタン位置などUI依存が強い問題"
  ],

  "recommended_question_focus": "concept | purpose | workflow | risk | comparison | terminology | setup | not_recommended",
  "risk": [
    "教材化・問題化する際の注意点"
  ]
}
```

### time_range の規則

```text
- 動画素材のみ使用する。動画以外（記事・画像）の場合は "time_range": null とする
- 1時間未満の動画は "MM:SS"、1時間以上の動画は "HH:MM:SS" 形式にする
- 位置情報は source_location にも必ず書く（記事なら見出し名、画像ならファイル名）
```

---

## alignment_status の判断基準

以下から必ず1つ選んでください。

```text
aligned:
画面・画像・本文・音声説明が明確に一致している

partially_aligned:
大枠は一致するが、一部の説明や画面情報が不足している

ambiguous:
指示語や画面遷移が曖昧で、何を指しているか断定できない

conflict:
画面情報と説明内容が矛盾している

visual_only:
画像や画面には情報があるが、本文や音声説明との対応が弱い

text_only:
本文や音声説明はあるが、画像や画面情報との対応が弱い
```

注意：
すべてを安易に `aligned` にしないでください。
少しでも不明点がある場合は、`partially_aligned` または `ambiguous` を使ってください。

---

## confidence の判断基準

```text
high:
画面・本文・音声などの根拠が明確で、意味がはっきりしている

medium:
大筋は明確だが、一部に推定が含まれる

low:
画面・本文・指示語・文脈の対応に不確実性がある
```

---

## verification_needed の判断基準

**verification_needed は既定で true としてください。**

`false` にしてよいのは、以下の**すべて**を満たす場合だけです。

```text
- UI・手順・設定項目・料金・権限・外部連携・選択可能なエージェント一覧など、
  バージョン更新で変わりうる内容を一切含まない
- 純粋な概念・目的・考え方の説明である
- 画面の文字がすべて明瞭に読め、話者・筆者の説明と完全に一致している
```

特に以下に1つでも該当する場合は、必ず `verification_needed: true` にしてください。

```text
- 公式情報との照合が必要
- UI・料金・権限・セキュリティ・外部連携に関係する
- インストール手順やCLI操作に関係する
- 設定画面の項目名・選択肢・デフォルト値に関係する
- 画面の文字が小さい、または一部しか読めない
- 画面遷移が高速で見落としの可能性がある
- 話者や筆者の説明が省略的
- 機能名や設定名が推定になっている
- 画像と説明の対応が完全ではない
- 最新仕様で変わる可能性がある
```

迷ったら `true` にしてください。安全側に倒してください。

---

## claim_type の判断基準

```text
fact:
画面上の表示、本文、または実演から直接確認できる内容

interpretation:
画面・本文・音声を統合して意味づけした内容

recommendation:
話者や筆者の主観的評価・推奨

speculation:
素材だけでは裏取りできず、推定が混ざる内容

mixed:
事実・解釈・推奨が混ざる内容
```

以下のような表現は、事実として扱わないでください。

```text
おすすめ
最強
高品質
非常に良い
やばい
S+ランク
強力
完全対応
必ず使える
外出先から使える
安全に使える
```

---

## ui_volatility の判断基準

```text
high:
ボタン位置、画面配置、メニュー名、UI上の細かい表示に依存する

medium:
機能名や画面名には依存するが、概念としては残りやすい

low:
UIではなく、機能の目的や概念に関する内容

none:
UIに依存しない内容
```

---

## quiz_potential の判断基準

```text
high:
初学者の理解に重要で、概念問題・安全問題・誤解訂正問題にしやすい

medium:
問題化は可能だが、UI依存や文脈依存がある

low:
導入文や補足には使えるが、問題化には弱い

none:
問題化しない方がよい
```

注意：
`quiz_potential` には問題文を書かないでください。
問題文候補は `possible_questions` に書いてください。

---

## quiz_allowed の判断基準

以下の場合は、必ず `quiz_allowed: false` にしてください。

```text
- alignment_status が ambiguous
- alignment_status が conflict
- confidence が low
- 画面と説明の対応が不明
- ソース根拠が弱い
- UIの位置や見た目だけを問う内容になりそう
- セキュリティ・権限・料金・インストール条件について未検証の断定が必要
- 宣伝、告知、メンバーシップ、コミュニティ案内が主題
- 話者の主観的なおすすめ度が主題
```

`quiz_allowed: false` は後工程で強制力を持ちます（記録付きの解禁手続きなしに問題化されません）。条件付きで問題化できそうな場合は、`false` のまま解禁条件を `risk` に書いてください。boolean の値自体に注釈を付けてはいけません。

---

## possible_questions の方針

良い問題候補：

```text
- 機能の目的を問う
- 概念の違いを問う
- 初心者の誤解を修正する
- 安全上の注意点を問う
- ワークフローの意味を問う
- UIの見た目ではなく、なぜその機能を使うのかを問う
```

悪い問題候補：

```text
- ボタンが画面のどこにあるかを問う
- メニューの細かい位置を問う
- 一時的なUI文言だけを問う
- 話者の主観的なおすすめ度を正解にする
- 公式確認が必要な内容を断定させる
- 宣伝や告知内容を問う
```

---

# 3. REVIEW_NOTES

最後に、教材化前のレビュー用メモを出してください。

以下のJSON形式にしてください。

```json
{
  "skipped_ranges": [
    {
      "range": "パケット化しなかった区間・節（例: 12:30-14:00 / 第5見出し）",
      "reason": "なぜパケット化しなかったか（例: スポンサー読み上げ）"
    }
  ],
  "packets_to_split": [
    {
      "packet_id": "分割すべきpacket_id",
      "reason": "なぜ分割すべきか",
      "suggested_split": [
        "分割案1",
        "分割案2"
      ]
    }
  ],
  "packets_to_verify": [
    {
      "packet_id": "確認が必要なpacket_id",
      "reason": "なぜ確認が必要か"
    }
  ],
  "packets_not_for_quiz": [
    {
      "packet_id": "問題化しない方がよいpacket_id",
      "reason": "なぜ問題化に向かないか"
    }
  ],
  "recommended_quiz_themes": [
    "おすすめの問題テーマ1",
    "おすすめの問題テーマ2"
  ],
  "avoid_quiz_themes": [
    "避けるべき問題テーマ1",
    "避けるべき問題テーマ2"
  ],
  "overall_assessment": "この素材を学習アプリ教材にする上での総合評価"
}
```

`skipped_ranges` は、スキップした区間が無い場合も空配列 `[]` として必ず含めてください。

---

## 出力上の禁止事項

以下は禁止です。

```text
- 素材にアクセスできていないのに、タイトルや一般知識から内容を推測して解析する
- 素材全体を単なる文章要約だけで終わらせる
- quiz_potential に問題文を書く
- 根拠がないのに alignment_status: aligned にする
- 根拠がないのに risk: なし にする
- 評価語を事実として扱う
- UIの位置・色・見た目だけをクイズ化する
- 公式確認が必要な事項を断定する
- 不明点を推測で埋める
- resolved_meaning に宣伝文のような表現を入れる
- JSONL内にコメントを入れる
- boolean・enumの値に「://」などで注釈を付ける（注釈は risk か unresolved_references へ）
```

---

## 最終指示

上記の形式に厳密に従って出力してください。

不足している情報は推測で埋めず、以下のいずれかで処理してください。

```text
- verification_needed: true
- quiz_allowed: false
- confidence: "medium" または "low"
- unresolved_references に記録
- risk に明記
- skipped_ranges に記録
```

最終問題文はまだ完成させないでください。
Claude Codeが後で問題生成できる品質の一次資料作成に集中してください。
