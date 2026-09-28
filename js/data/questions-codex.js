/**
 * 「池袋 Codex 店」— OpenAI のコーディングエージェント「Codex」の問題（20問）
 *
 * 出典は Codex の公式ドキュメント（learn.chatgpt.com/docs、旧 developers.openai.com/codex）に限る（2026-09-28 確認）。
 * コマンド名や既定値は版で変わりうるので、出典の点検（scripts/check-sources.mjs）で変化を追う。
 *
 * 内訳: 全20問 / ゴウが正しい=7問, 間違い=13問
 */
import { defineQuestions } from "./defineQuestions.js";

const D = "https://learn.chatgpt.com/docs";
const src = (...pages) => pages.map(([page, name]) => `Codex 公式ドキュメント ${name} ${D}/${page}`).join(" / ");
const P = {
  cli: ["codex/cli", "Codex CLI"],
  ide: ["codex/ide", "IDE extension"],
  cloud: ["cloud", "Codex cloud"],
  agentsMd: ["agent-configuration/agents-md", "AGENTS.md"],
  commands: ["developer-commands", "Commands"],
  security: ["agent-approvals-security", "Agent approvals & security"],
  sandbox: ["sandboxing", "Sandboxing"],
  exec: ["non-interactive-mode", "Non-interactive mode"],
  config: ["config-file/config-basic", "Config basics"],
  skills: ["build-skills", "Agent Skills"],
  mcp: ["extend/mcp", "Model Context Protocol"],
  auth: ["auth", "Authentication"],
};

export const codexQuestions = defineQuestions("codex", [
  {
    id: "cx-001",
    topic: "動く場所",
    difficulty: "easy",
    line: "Codexはブラウザの中でしか動かないAIなんだよ。",
    choices: [
      "正しい",
      "ブラウザ版が本体で、CLIはその画面を文字で映しているだけの道具",
      "ターミナルのCLIのほか、IDE拡張やクラウドのタスクとしても使える",
      "手元で動くのはIDE拡張だけで、ターミナル用のCLIは提供されていない",
    ],
    answer: 2,
    explain:
      "Codex CLI は手元のターミナルで動くコーディングエージェントで、選んだフォルダのコードを読み、書き換え、コマンドを実行できます。VS Code などの IDE 拡張からも使え、Codex cloud ではクラウドの隔離された環境でタスクを並行して進められます。",
    source: src(P.cli, P.ide, P.cloud),
  },
  {
    id: "cx-002",
    topic: "AGENTS.md",
    difficulty: "easy",
    line: "リポジトリに AGENTS.md を置くと、Codexは作業の前にそれを読んで、決めごととして使うんだ。",
    choices: [
      "正しい",
      "AGENTS.md は人が読む説明書で、Codexは中身を読み込まない",
      "読み込まれるのは /init で作った直後の1回だけで、後の変更は反映されない",
      "AGENTS.md が読まれるのはクラウドのタスクだけで、手元のCLIでは無視される",
    ],
    answer: 0,
    explain:
      "Codex は作業を始める前に AGENTS.md を読みます。指示の組み立ては実行のたびにやり直されるので、書き足した内容は次の実行から効きます。テストの回し方やコードの決まりなど、毎回伝えたいことを書いておく場所です。",
    source: src(P.agentsMd),
  },
  {
    id: "cx-003",
    topic: "AGENTS.md の重ね方",
    difficulty: "hard",
    line: "AGENTS.md はリポジトリの一番上に1つしか置けない。サブフォルダに置いても無視される。",
    choices: [
      "正しい",
      "サブフォルダにも置けるが、読まれるのは一番深いフォルダの1つだけになる",
      "サブフォルダに置いたものは、フォルダ名を毎回指示に書いたときだけ読まれる",
      "上の階層から作業フォルダまで順に読まれ、近いフォルダの指示ほど後に来て優先される",
    ],
    answer: 3,
    explain:
      "Codex はプロジェクトの一番上（Git のルート）から今いるフォルダまで、各フォルダの AGENTS.md を順につなげて読みます。近いフォルダのものほど後ろに来るので、上の階層の指示を上書きできます。ホームの ~/.codex にも全体用の AGENTS.md を置けます。",
    source: src(P.agentsMd),
  },
  {
    id: "cx-004",
    topic: "/init",
    difficulty: "easy",
    line: "/init を打つと、AGENTS.md のひな形を作ってくれる。",
    choices: [
      "正しい",
      "/init は設定をすべて初期値に戻すコマンド",
      "/init は新しいgitリポジトリを作るだけで、ファイルは作らない",
      "/init はログイン情報を消して、最初からサインインし直すコマンド",
    ],
    answer: 0,
    explain:
      "/init は今のフォルダに AGENTS.md のひな形を作るコマンドです。できた下書きに、そのリポジトリで毎回守ってほしい指示を書き足して使います。サインアウトは /logout という別のコマンドです。",
    source: src(P.commands, P.agentsMd),
  },
  {
    id: "cx-005",
    topic: "承認と既定の動き",
    difficulty: "normal",
    line: "Codexは最初から、どこでも自由にファイルを書き換えて、ネットにもつなぐ。",
    choices: [
      "正しい",
      "既定ではネットは切られ、作業フォルダの外の編集やネット接続の前に許可を求める",
      "既定ではネットにはつながるが、ファイルの編集だけは毎回必ず許可を求める",
      "既定では何も編集できない読み取り専用で、書き換えるには再インストールが要る",
    ],
    answer: 1,
    explain:
      "手元の Codex は、OS の仕組みで守られたサンドボックスと、承認のルールを組み合わせて動きます。既定ではネット接続は切られていて、作業フォルダの外を編集したりネットを使ったりする前に許可を求めます。/permissions で読み取り専用などに切り替えることもできます。",
    source: src(P.security),
  },
  {
    id: "cx-006",
    topic: "サンドボックスと承認",
    difficulty: "normal",
    line: "サンドボックスは『技術的に何ができるか』、承認のルールは『いつ人に聞くか』を決める別々の仕組みだ。",
    choices: [
      "正しい",
      "2つは同じ設定の別名で、片方を変えるともう片方も同じ値に変わる",
      "サンドボックスはクラウド専用で、手元のCLIでは承認のルールしか働かない",
      "承認のルールを決めると、サンドボックスは自動で無効になる",
    ],
    answer: 0,
    explain:
      "公式ドキュメントは、サンドボックスを「Codex が技術的にできることの範囲」、承認のルールを「実行の前に確認を求めるタイミング」として分けて説明しています。設定でも sandbox_mode と approval_policy は別の項目です。",
    source: src(P.security, P.config),
  },
  {
    id: "cx-007",
    topic: "サンドボックスの範囲",
    difficulty: "hard",
    line: "サンドボックスが効くのはCodex本体だけ。Codexが呼んだgitやテストのコマンドは制限されない。",
    choices: [
      "正しい",
      "制限がかかるのはネット接続だけで、ファイルの書き込みは制限されない",
      "制限はかかるが、それはmacOSだけで、LinuxやWSLでは制限が効かない",
      "Codexが起動するgit・パッケージ管理・テストなどのコマンドにも制限がかかる",
    ],
    answer: 3,
    explain:
      "サンドボックスは、Codex が起動するコマンド（git、パッケージ管理、テストの実行など）にも適用されます。macOS は Seatbelt、Linux と WSL2 は bubblewrap、Windows は専用のサンドボックスという、OS ごとの仕組みで守られます。",
    source: src(P.sandbox),
  },
  {
    id: "cx-008",
    topic: "サンドボックスのモード",
    difficulty: "normal",
    line: "サンドボックスのモードは『全部許可』か『全部禁止』の2つしかない。",
    choices: [
      "正しい",
      "読み取りだけ・作業フォルダへの書き込み・制限なし、の3つのモードがある",
      "2つのほかに『ネットだけ許可』があるが、使えるのは有料プランに限られる",
      "モードは3つあるが、選べるのはクラウドのタスクを作るときだけである",
    ],
    answer: 1,
    explain:
      "モードは read-only（読み取りだけ）、workspace-write（作業フォルダへの書き込み）、danger-full-access（制限なし）の3つです。手元での普段使いには workspace-write が手間の少ない既定として案内されています。制限なしは名前のとおり危険を伴うので、使う場面を選びます。",
    source: src(P.sandbox),
  },
  {
    id: "cx-009",
    topic: "codex exec",
    difficulty: "normal",
    line: "codex exec を使うと、対話の画面を開かずに、スクリプトやCIからCodexを動かせる。",
    choices: [
      "正しい",
      "codex exec は Codex を最新版に更新するためのコマンド",
      "codex exec は対話の画面を開いて、人の入力を待つためのコマンド",
      "codex exec はクラウドのタスクを作るだけで、手元では何も動かさない",
    ],
    answer: 0,
    explain:
      "codex exec は対話しないで Codex を動かすためのコマンドで、スクリプトや CI に組み込む用途が案内されています。--json を付けると動作の記録を JSON Lines で受け取れます。GitHub Actions で使う場合は、公式の Codex GitHub Action が案内されています。",
    source: src(P.exec),
  },
  {
    id: "cx-010",
    topic: "codex exec の権限",
    difficulty: "hard",
    line: "codex exec は無人で動くから、最初からファイルを自由に書き換えられる。",
    choices: [
      "正しい",
      "既定で書き換えられるが、書き換えてよいのは Git で管理されたファイルだけ",
      "既定は読み取り専用で、編集させるにはサンドボックスの指定を変える必要がある",
      "書き換えはできるが、終わったら変更は必ず自動で元に戻される仕組みになっている",
    ],
    answer: 2,
    explain:
      "codex exec は既定で読み取り専用のサンドボックスで動きます。ファイルを編集させたいときは --sandbox workspace-write のように指定します。公式ドキュメントは、自動化では仕事に必要な最小限の権限にするよう勧めています。",
    source: src(P.exec),
  },
  {
    id: "cx-011",
    topic: "codex exec の出力",
    difficulty: "hard",
    line: "codex exec の途中経過も最後の答えも、全部まとめて標準出力に流れてくる。",
    choices: [
      "正しい",
      "途中経過は出ないが、最後の答えは必ずJSONの形で標準出力に出てくる",
      "途中経過も答えも標準出力には出ず、すべてログファイルにだけ書き込まれる",
      "途中経過は標準エラーに出て、標準出力には最後のメッセージだけが出る",
    ],
    answer: 3,
    explain:
      "codex exec は途中経過を標準エラー（stderr）に流し、最後のメッセージだけを標準出力（stdout）に出します。そのため、結果をそのままファイルに保存したり、次のコマンドに渡したりしやすくなっています。",
    source: src(P.exec),
  },
  {
    id: "cx-012",
    topic: "設定ファイル",
    difficulty: "easy",
    line: "Codexの設定は ~/.codex/config.toml に書く。CLIとIDE拡張で同じ設定が使われる。",
    choices: [
      "正しい",
      "設定はCLIとIDE拡張で別々のファイルに書き、互いには共有されない",
      "設定ファイルは JSON 形式で、~/.codex/settings.json に書く",
      "設定はクラウドにしか保存できず、手元のファイルでは変えられない",
    ],
    answer: 0,
    explain:
      "個人の設定は ~/.codex/config.toml に TOML 形式で書きます。CLI と IDE 拡張は同じ設定の層を共有します。使うモデル、承認のルール、サンドボックスのモードなどをここで決められます。",
    source: src(P.config),
  },
  {
    id: "cx-013",
    topic: "プロジェクトの設定",
    difficulty: "hard",
    line: "プロジェクトの .codex/config.toml は、どのフォルダでも無条件で読み込まれる。",
    choices: [
      "正しい",
      "無条件で読み込まれるが、ユーザーの設定と食い違う部分は必ず無視される",
      "プロジェクトの設定は、Gitで管理されていないフォルダでしか読み込まれない",
      "プロジェクトの設定が読み込まれるのは、そのプロジェクトを信頼したときだけ",
    ],
    answer: 3,
    explain:
      "安全のため、Codex がプロジェクトの .codex/ の設定を読むのは、そのプロジェクトを信頼したときだけです。信頼しないと、プロジェクト用の設定・フック・ルールは読み飛ばされ、ユーザー全体とシステムの設定だけが使われます。",
    source: src(P.config),
  },
  {
    id: "cx-014",
    topic: "設定の優先順位",
    difficulty: "hard",
    line: "設定が食い違ったら、ユーザー全体の config.toml が一番強い。コマンドの引数では上書きできない。",
    choices: [
      "正しい",
      "コマンドの引数が一番強く、プロジェクトの設定はユーザーの設定より優先される",
      "ユーザーの設定が一番強いが、引数で上書きできる項目もモデル名だけある",
      "一番強いのはシステム全体の /etc の設定で、ユーザーの設定はその次にくる",
    ],
    answer: 1,
    explain:
      "優先順位は、コマンドの引数（--config を含む）、プロジェクトの設定、プロファイル、ユーザーの設定、システム全体の設定、組み込みの既定値の順です。そのため、1回だけ設定を変えたいときは引数で上書きできます。",
    source: src(P.config),
  },
  {
    id: "cx-015",
    topic: "スキル",
    difficulty: "normal",
    line: "スキルは SKILL.md を入れたフォルダで、必要になったときに中身が読み込まれる。",
    choices: [
      "正しい",
      "スキルは起動時に中身がすべて読み込まれるので、増やすほど会話が圧迫される",
      "スキルは Python のプログラムで、SKILL.md という名前のファイルは使わない",
      "スキルは OpenAI が配布するものだけで、自分で作ることはできない",
    ],
    answer: 0,
    explain:
      "スキルは、名前と説明を書いた SKILL.md を入れたフォルダです。最初に読まれるのは名前と説明だけで、使うと決まったときに中身が読み込まれます（段階的な読み込み）。$skill-creator を使って自分で作ることもできます。",
    source: src(P.skills),
  },
  {
    id: "cx-016",
    topic: "スキルの置き場所",
    difficulty: "normal",
    line: "リポジトリ用のスキルは、どこに置いても自動で見つけてくれる。",
    choices: [
      "正しい",
      "リポジトリ用のスキルは、リポジトリの一番上に SKILL.md を1つだけ置く",
      "リポジトリ用のスキルは .agents/skills という決まった場所に置く",
      "どこに置いても見つかるが、名前が skill- で始まるフォルダに限られる",
    ],
    answer: 2,
    explain:
      "リポジトリでは、今いるフォルダからリポジトリの一番上までの各階層にある .agents/skills が探されます。個人用は $HOME/.agents/skills、管理者用は /etc/codex/skills です。決まった場所に置かないと見つかりません。",
    source: src(P.skills),
  },
  {
    id: "cx-017",
    topic: "MCP",
    difficulty: "normal",
    line: "MCPサーバーを設定すると、Codexが外部の道具やデータを使えるようになる。設定は config.toml に書く。",
    choices: [
      "正しい",
      "MCPはCodexの料金プランの名前で、道具の追加とは関係ない",
      "つなげるMCPサーバーは、OpenAIが用意したものに限られる",
      "MCPの設定はIDE拡張だけのもので、CLIからは使えない",
    ],
    answer: 0,
    explain:
      "MCP サーバーは config.toml の [mcp_servers.<名前>] に書くか、codex mcp add で追加します。手元で動かす STDIO 型と、URL でつなぐ Streamable HTTP 型に対応しています。設定はデスクトップアプリ・CLI・IDE 拡張で共有されます。",
    source: src(P.mcp),
  },
  {
    id: "cx-018",
    topic: "サインイン",
    difficulty: "easy",
    line: "Codexを使うには、必ずAPIキーを買って、従量課金で払うしかない。",
    choices: [
      "正しい",
      "APIキーは要らないが、Codexを使うには専用のCodexプランの契約が必要",
      "ChatGPTでサインインできるのはクラウドだけで、CLIではAPIキーが必須になる",
      "ChatGPTのアカウントでサインインでき、APIキーでの従量課金も選べる",
    ],
    answer: 3,
    explain:
      "Codex には ChatGPT のアカウント（サブスクリプションの範囲で使う）か、API キー（使った分だけ払う）でサインインできます。Codex cloud を使うには ChatGPT でのサインインが必要です。CLI と IDE 拡張はサインイン情報を共有します。",
    source: src(P.auth),
  },
  {
    id: "cx-019",
    topic: "クラウドのネット接続",
    difficulty: "hard",
    line: "Codexのクラウドは、作業中ずっとインターネットに自由につながっている。",
    choices: [
      "正しい",
      "準備の段階ではネットを使えるが、エージェントが作業する段階は既定でオフライン",
      "作業中はつながっているが、アクセスできるのは GitHub のサイトだけに限られる",
      "クラウドは最初から最後までオフラインで、準備の段階でもネットは使えない",
    ],
    answer: 1,
    explain:
      "Codex cloud は2段階で動きます。準備（setup）の段階では依存関係を入れるためにネットを使えますが、エージェントが作業する段階は、環境の設定でネットを許可しない限りオフラインです。クラウド用に設定した秘密の値も準備の段階でだけ使え、作業の段階の前に取り除かれます。",
    source: src(P.security, P.cloud),
  },
  {
    id: "cx-020",
    topic: "/review",
    difficulty: "normal",
    line: "Codexの /review は、見つけた問題をその場で勝手に直して、ファイルを書き換える。",
    choices: [
      "正しい",
      "/review が見られるのはコミット済みの変更だけで、未コミットの変更は対象外",
      "/review は直すが、書き換えたファイルは自動で別のブランチに退避される",
      "/review は変更を読んで指摘を返すだけで、作業中のファイルは書き換えない",
    ],
    answer: 3,
    explain:
      "/review は、未コミットの変更・特定のコミット・基準のブランチとの差などを読んで、問題点を指摘するコマンドです。作業中のファイルは書き換えません。公式ドキュメントは、作業の前後に Git のチェックポイントを作って、いつでも戻せるようにすることも勧めています。",
    source: src(P.commands, P.cli),
  },
]);
