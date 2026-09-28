/**
 * 「銀座 Orca 店」— 複数のAIエージェントを並べて走らせる開発環境「Orca」の問題（20問）
 *
 * 出典は Orca の公式リポジトリの README と公式ドキュメントだけに限る（2026-09-28 確認）。
 * 画面のボタン位置など、版で変わりやすい細部は問わない。
 *
 * 内訳: 全20問 / ゴウが正しい=7問, 間違い=13問
 */
import { defineQuestions } from "./defineQuestions.js";

const README = "Orca 公式リポジトリ README https://github.com/stablyai/orca";
const DOCS = "Orca 公式ドキュメント https://www.onorca.dev/docs";

export const orcaQuestions = defineQuestions("orca", [
  {
    id: "orca-001",
    topic: "Orcaの正体",
    difficulty: "easy",
    line: "Orcaってのは、それ自体が新しいAIモデルなんだよ。",
    choices: [
      "正しい",
      "Orca社が独自に学習させた、コードを書くことに特化した大規模言語モデル",
      "モデルではなく、既存のAIエージェントを並べて動かす開発用のアプリ",
      "モデルではあるが、中身はClaudeとGPTを混ぜて作った合成モデル",
    ],
    answer: 2,
    explain:
      "公式ドキュメントは、Orcaを「複数のAIコーディングエージェントを並べて動かすデスクトップIDE」と説明し、Orca自体はモデルではないと明記しています。Claude Code や Codex など、すでに使っているエージェントを動かす場所です。",
    source: DOCS,
  },
  {
    id: "orca-002",
    topic: "worktree",
    difficulty: "easy",
    line: "Orcaは仕事ごとに専用のgit worktreeを作って、その中でエージェントを動かすんだぜ。",
    choices: [
      "正しい",
      "worktreeは使わず、すべてのエージェントが同じフォルダを編集する",
      "仕事ごとにリポジトリを丸ごと複製し、別々の履歴として管理する",
      "worktreeを作るのは最初の1回だけで、全部の仕事がそれを使い回す",
    ],
    answer: 0,
    explain:
      "正しいです。Orcaでは仕事（タスク）ごとに専用の git worktree、専用のエージェント用ターミナル、専用のブラウザタブが用意されます。互いのファイルを上書きし合わずに並行して作業できるのが狙いです。",
    source: DOCS,
  },
  {
    id: "orca-003",
    topic: "worktree",
    difficulty: "normal",
    line: "worktreeってのは、リポジトリを丸ごとコピーして、履歴も別々に持つ仕組みだよ。",
    choices: [
      "正しい",
      "同じGitの履歴を共有したまま、別のブランチを別のフォルダに取り出す仕組み",
      "Git履歴は共有するが、取り出せるのは読み取り専用のコピーで編集はできない",
      "履歴は別々ではないが、1つのリポジトリで作れるworktreeは2つまでに限られる",
    ],
    answer: 1,
    explain:
      "git worktree は、1つのリポジトリの履歴を共有したまま、別のブランチを別のフォルダに取り出す Git の機能です。コピーとは違い、履歴は1つなので、どのフォルダで作ったコミットも同じリポジトリに記録されます。",
    source: `${DOCS} / Git 公式 git-worktree https://git-scm.com/docs/git-worktree`,
  },
  {
    id: "orca-004",
    topic: "対応エージェント",
    difficulty: "easy",
    line: "Orcaで動かせるのは、Orca専用に作られたエージェントだけだ。",
    choices: [
      "正しい",
      "動かせるのはOrcaの公式ストアで配布されている、審査済みのエージェントだけ",
      "Claude CodeやCodexなど、既存のCLIエージェントをそのまま動かせる",
      "他社のエージェントも動くが、同時に動かせるのは1種類のエージェントだけ",
    ],
    answer: 2,
    explain:
      "README は「ターミナルで動くCLIエージェントなら何でも使える」と説明し、Claude Code、Codex、OpenCode などを例に挙げています。Orca専用のエージェントが必要なわけではありません。",
    source: README,
  },
  {
    id: "orca-005",
    topic: "対応OS",
    difficulty: "easy",
    line: "OrcaのデスクトップアプリはmacOS、Windows、Linuxで動く。",
    choices: [
      "正しい",
      "macOSでしか動かない",
      "ブラウザで開くWebアプリで、パソコンには入れられない",
      "WindowsではWSLの中でしか動かない",
    ],
    answer: 0,
    explain: "正しいです。公式ドキュメントと README は、デスクトップ版の対応OSとして macOS・Windows・Linux を挙げています。",
    source: `${README} / ${DOCS}`,
  },
  {
    id: "orca-006",
    topic: "ライセンス",
    difficulty: "normal",
    line: "Orcaはソースコード非公開の有料ソフトだから、中身は誰にも見られない。",
    choices: [
      "正しい",
      "MITライセンスのオープンソースで、無料で使えて中身も公開されている",
      "無料で使えるが、ソースコードは非公開で、有料プランのときだけ中身を読める",
      "中身は公開されているが、商用利用には有料のライセンス契約が必要になる",
    ],
    answer: 1,
    explain:
      "Orca は GitHub で公開されているオープンソースソフトで、README には MIT License と書かれています。公式ドキュメントも「無料でオープンソース」と説明しています。",
    source: `${README} / ${DOCS}`,
  },
  {
    id: "orca-007",
    topic: "worktree",
    difficulty: "normal",
    line: "Orcaのworktreeは独自形式だから、普通のgitコマンドは使えないぞ。",
    choices: [
      "正しい",
      "gitコマンドは使えるが、コミットとpushだけはOrcaの画面からしかできない",
      "Orcaが作るのは普通のgit worktreeで、いつものgitコマンドがそのまま使える",
      "中身は普通のフォルダだが、Orcaを閉じるとworktreeは中身ごと自動で消される",
    ],
    answer: 2,
    explain:
      "公式ドキュメントは、Orca の worktree は本物の git worktree で、普通の git コマンドで操作できると説明しています。Orca を使っていても、中身はいつもの Git です。",
    source: DOCS,
  },
  {
    id: "orca-008",
    topic: "並列実行",
    difficulty: "normal",
    line: "同じ頼みごとを、複数のエージェントにそれぞれ別のworktreeでやらせて、出来のいいほうを選べるんだ。",
    choices: [
      "正しい",
      "1つの頼みごとは1つのエージェントにしか渡せない",
      "複数に渡せるが、全員が同じworktreeを共有して作業する",
      "複数に渡せるが、結果は自動で1つに混ぜられて選べない",
    ],
    answer: 0,
    explain:
      "正しいです。README は「1つのプロンプトを5つのエージェントに広げ、それぞれを独立した git worktree で動かす」使い方を紹介しています。結果を見比べて良いものを選べます。",
    source: README,
  },
  {
    id: "orca-009",
    topic: "並列実行",
    difficulty: "normal",
    line: "エージェントを並べるなら、同じフォルダで一斉に編集させるのが一番速いよ。",
    choices: [
      "正しい",
      "同じファイルを同時に書き換えると衝突するので、worktreeで場所を分ける",
      "同じフォルダでも衝突はOrcaが自動で解決するので、分けるより速く終わる",
      "フォルダを分けるとGitの履歴が別々になり、あとから1つにまとめられなくなる",
    ],
    answer: 1,
    explain:
      "同じフォルダで複数のエージェントが同時に編集すると、互いの変更を上書きしてしまいます。Orca が仕事ごとに worktree を分けるのは、この衝突を避けて並行作業するためです。",
    source: DOCS,
  },
  {
    id: "orca-010",
    topic: "差分レビュー",
    difficulty: "normal",
    line: "AIが書いた変更なんて見なくていい。Orcaにはレビューの機能も無いしな。",
    choices: [
      "正しい",
      "差分は見られるが、コメントはGitHubのプルリクエスト画面でしか付けられない",
      "Orcaには差分を見る機能があり、行にコメントを付けてエージェントに返せる",
      "Orcaはレビュー機能で変更を自動採点し、合格したものだけを取り込む",
    ],
    answer: 2,
    explain:
      "公式ドキュメントは差分ビューアと、AIの差分に注釈を付ける機能を挙げています。README も「差分のどの行にもコメントを付けられる」と説明しています。AIの変更を人が読んで判断するための道具です。",
    source: `${README} / ${DOCS}`,
  },
  {
    id: "orca-011",
    topic: "モバイル",
    difficulty: "easy",
    line: "スマホのアプリから、エージェントの様子を見たり指示を出したりできるんだ。",
    choices: [
      "正しい",
      "スマホからは状態を見られるだけで、指示は出せない",
      "スマホアプリは無く、ブラウザからしか様子を見られない",
      "スマホではエージェントを止めることしかできない",
    ],
    answer: 0,
    explain: "正しいです。README は、スマホのコンパニオンアプリで「エージェントを監視し、操作できる」と説明しています。iOS と Android が挙げられています。",
    source: README,
  },
  {
    id: "orca-012",
    topic: "動く場所",
    difficulty: "normal",
    line: "Orcaはエージェントを全部Orca社のクラウドで動かすホスティングサービスだ。",
    choices: [
      "正しい",
      "基本は自分のパソコンで動かすアプリで、クラウドを貸すサービスではない",
      "クラウドで動かすが、利用料はOrcaではなく各AIの会社にまとめて請求される",
      "自分のパソコンでも動くが、エージェントの処理だけはOrcaのサーバーで行う",
    ],
    answer: 1,
    explain:
      "公式ドキュメントは、Orca は既定ではホスティング型のサーバー製品ではないと説明しています。基本は手元のデスクトップで動かし、必要なら SSH でつないだ別のマシンでも動かせます。",
    source: DOCS,
  },
  {
    id: "orca-013",
    topic: "SSH",
    difficulty: "hard",
    line: "SSHでつないだリモートのマシンの上でも、worktreeを作ってエージェントを走らせられる。",
    choices: [
      "正しい",
      "SSHには対応していない",
      "SSHではファイルを見ることしかできない",
      "SSH先ではworktreeを作れず、手元に取り込んでから動かす",
    ],
    answer: 0,
    explain:
      "正しいです。README は SSH worktree として、性能の高いリモートマシンでエージェントを動かし、ファイル編集・git・ターミナルも使えると説明しています。",
    source: `${README} / ${DOCS}`,
  },
  {
    id: "orca-014",
    topic: "料金の考え方",
    difficulty: "normal",
    line: "Orcaを使えば、AIの利用料は全部Orcaの請求にまとまるんだよ。",
    choices: [
      "正しい",
      "Orcaの料金にAIの利用料が含まれるので、各社との契約は解約してよい",
      "AIの利用料はまとまらないが、Orca経由で使うと各社の料金が半額になる",
      "エージェントの利用には、自分が契約しているサブスクリプションをそのまま使う",
    ],
    answer: 3,
    explain:
      "README は「自分のサブスクリプションで、どのコーディングエージェントでも動かせる」と説明しています。Orca は料金をまとめる窓口ではなく、手持ちのエージェントを動かす場所です。",
    source: README,
  },
  {
    id: "orca-015",
    topic: "内蔵ブラウザ",
    difficulty: "hard",
    line: "Orcaの中のブラウザは、ただのWeb閲覧用だ。エージェントとは関係ない。",
    choices: [
      "正しい",
      "デザインモードで画面の部品を選ぶと、そのHTMLやCSSをエージェントへの指示に送れる",
      "内蔵ブラウザで開いたページは、エージェントが自動で全部読み込んで学習する",
      "内蔵ブラウザはOrcaの説明書を見るためだけのもので、外部のサイトは開けない",
    ],
    answer: 1,
    explain:
      "README は、Design Mode で画面の要素をクリックすると、その HTML・CSS・切り抜いたスクリーンショットをエージェントのプロンプトに送れると説明しています。見た目の修正を具体的に頼むための機能です。",
    source: README,
  },
  {
    id: "orca-016",
    topic: "通知",
    difficulty: "easy",
    line: "エージェントが作業を終えたり、人の対応が必要になったりしたら、通知で分かる。",
    choices: [
      "正しい",
      "通知の機能は無く、画面を見張り続けるしかない",
      "通知はメールでしか届かない",
      "通知はエラーで止まったときだけ届き、完了は知らせない",
    ],
    answer: 0,
    explain: "正しいです。README は、エージェントが終わったときや注意が必要なときを追える通知の機能を挙げています。",
    source: README,
  },
  {
    id: "orca-017",
    topic: "GitHub連携",
    difficulty: "normal",
    line: "OrcaはGitHubとつながらないから、プルリクエストやIssueは毎回ブラウザで開くしかない。",
    choices: [
      "正しい",
      "GitHubとはつながるが、見られるのはIssueだけでプルリクエストは見られない",
      "GitHubとつなぐと、Orcaがリポジトリの設定を自動で公開に切り替える",
      "Orcaの中でプルリクエスト・Issue・プロジェクトボードを見られる",
    ],
    answer: 3,
    explain: "README は、GitHub と Linear の連携として、アプリ内でプルリクエスト・Issue・プロジェクトボードを見られると説明しています。",
    source: README,
  },
  {
    id: "orca-018",
    topic: "CLI",
    difficulty: "hard",
    line: "OrcaにはCLIもあって、worktreeを作るような操作をスクリプトから呼べる。",
    choices: [
      "正しい",
      "Orcaはマウス操作でしか使えず、スクリプトからは呼べない",
      "CLIはあるが、表示を切り替えることしかできない",
      "CLIを使うには有料プランが必要",
    ],
    answer: 0,
    explain: "正しいです。README は `orca worktree create` などのコマンドを例に、CLI で作業の流れをスクリプト化できると説明しています。",
    source: README,
  },
  {
    id: "orca-019",
    topic: "Gitとの関係",
    difficulty: "normal",
    line: "Orcaはgitの代わりになる、新しいバージョン管理システムだ。",
    choices: [
      "正しい",
      "gitの代わりではないが、Orcaを入れるとgitの設定が独自形式に変わる",
      "Orcaはgitを置き換えるものではなく、gitの上で動く道具",
      "Orcaはgitの履歴を圧縮して保存し直す、git用の軽量化ツールである",
    ],
    answer: 2,
    explain: "公式ドキュメントは、Orca は git の置き換えではないと明記しています。変更の記録は、これまでどおり Git が担います。",
    source: DOCS,
  },
  {
    id: "orca-020",
    topic: "使い方の考え方",
    difficulty: "hard",
    line: "エージェントを増やせば増やすほど、人が確認しなくても品質は勝手に上がる。",
    choices: [
      "正しい",
      "品質は上がるが、それはエージェント同士が互いのコードを採点し合うから",
      "エージェントは3つ以上並べると、互いの作業を打ち消して品質が下がる",
      "並べると候補は増えるが、どれを採るかは差分を読んで人が決める",
    ],
    answer: 3,
    explain:
      "Orca は複数の結果を並べて比べ、差分にコメントを付けて返す作業を助ける道具です。公式ドキュメントも、すでにコードを書く人が AI をてこにするための道具だと説明しています。採るかどうかを決めるのは人です。",
    source: `${README} / ${DOCS}`,
  },
]);
