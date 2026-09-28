/**
 * 「赤坂 GitHub 店」— GitHub と Git の基本（30問）
 *
 * 出典は GitHub Docs（docs.github.com）と Git 公式ドキュメント（git-scm.com）に限る（2026-09-28 確認）。
 *
 * 内訳: 全30問 / ゴウが正しい=9問, 間違い=21問
 */
import { defineQuestions } from "./defineQuestions.js";

const src = (...pages) => pages.map(([name, url]) => `${name} ${url}`).join(" / ");
const S = {
  about: [
    "GitHub Docs「About Git」",
    "https://docs.github.com/en/get-started/using-git/about-git"
  ],
  hello: [
    "GitHub Docs「Hello World」",
    "https://docs.github.com/en/get-started/using-github/hello-world"
  ],
  repos: [
    "GitHub Docs「About repositories」",
    "https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories"
  ],
  readme: [
    "GitHub Docs「About READMEs」",
    "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"
  ],
  commits: [
    "GitHub Docs「Commits」",
    "https://docs.github.com/en/pull-requests/reference/commits"
  ],
  push: [
    "GitHub Docs「Pushing commits to a remote repository」",
    "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository"
  ],
  clone: [
    "GitHub Docs「Cloning a repository」",
    "https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository"
  ],
  pull: [
    "GitHub Docs「Getting changes from a remote repository」",
    "https://docs.github.com/en/get-started/using-git/getting-changes-from-a-remote-repository"
  ],
  branches: [
    "GitHub Docs「Branches」",
    "https://docs.github.com/en/pull-requests/reference/branches"
  ],
  conflicts: [
    "GitHub Docs「Merge conflicts」",
    "https://docs.github.com/en/pull-requests/reference/merge-conflicts"
  ],
  issues: [
    "GitHub Docs「About issues」",
    "https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues"
  ],
  prs: [
    "GitHub Docs「Pull requests」",
    "https://docs.github.com/en/pull-requests/reference/pull-requests"
  ],
  protected: [
    "GitHub Docs「About protected branches」",
    "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches"
  ],
  pages: [
    "GitHub Docs「What is GitHub Pages?」",
    "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages"
  ],
  cd: [
    "GitHub Docs「Continuous deployment」",
    "https://docs.github.com/en/actions/get-started/continuous-deployment"
  ],
  actions: [
    "GitHub Docs「Understanding GitHub Actions」",
    "https://docs.github.com/en/actions/get-started/understand-github-actions"
  ],
  events: [
    "GitHub Docs「Events that trigger workflows」",
    "https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows"
  ],
  gitignore: [
    "Git 公式ドキュメント「gitignore」",
    "https://git-scm.com/docs/gitignore"
  ],
  sensitive: [
    "GitHub Docs「Removing sensitive data from a repository」",
    "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository"
  ],
  scanning: [
    "GitHub Docs「Secret scanning」",
    "https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning"
  ],
  visibility: [
    "GitHub Docs「Setting repository visibility」",
    "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility"
  ],
  review: [
    "GitHub Docs「Reviewing proposed changes in a pull request」",
    "https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request"
  ],
  gitlog: [
    "Git 公式ドキュメント「git-log」",
    "https://git-scm.com/docs/git-log"
  ],
  remotes: [
    "GitHub Docs「About remote repositories」",
    "https://docs.github.com/en/get-started/git-basics/about-remote-repositories"
  ],
  revert: [
    "Git 公式ドキュメント「git-revert」",
    "https://git-scm.com/docs/git-revert"
  ],
  reset: [
    "Git 公式ドキュメント「git-reset」",
    "https://git-scm.com/docs/git-reset"
  ],
  copilot: [
    "GitHub Docs「Responsible use of GitHub Copilot Chat」",
    "https://docs.github.com/en/copilot/responsible-use/chat"
  ]
};

export const githubQuestions = defineQuestions("github", [
  {
    id: "gh-001",
    topic: "GitとGitHubの違い",
    difficulty: "easy",
    line: "GitとGitHubは同じものだよ。呼び方が違うだけ。",
    choices: [
      "正しい",
      "GitはGitHub社が開発した道具なので、GitHubにログインしていないと使えない",
      "Gitは履歴を管理する道具、GitHubはGitのリポジトリを預かるWebサービスで別物",
      "GitHubはGitの有料版で、中身の仕組みも使い方もまったく同じもの",
    ],
    answer: 2,
    explain:
      "Gitはローカルのパソコン上だけでも動作するバージョン管理システムで、GitHub社が生まれる前から存在します。GitHubはそのGitリポジトリをインターネット上でホスティングし、共同作業やレビューをしやすくするWebサービスです。GitはGitHub社製ではなくLinus Torvaldsが開発したオープンソースのツールなので、GitHubがなくてもGitだけで使えます。有料版云々という話でもなく、単純に「ツール」と「そのツールを使ったサービス」という別レイヤーの話です。",
    source: src(S.about),
    successLine: "……チッ。まぐれだろ。",
    failureLine: "ほら見ろ。その程度か。",
  },
  {
    id: "gh-002",
    topic: "GitHubとは何か",
    difficulty: "easy",
    line: "GitHubはGitリポジトリをインターネット上に置いて、みんなで一緒にコードを開発できるようにするWebサービスだよ。",
    choices: [
      "GitHubはWebサービスではなく、パソコンにインストールする専用アプリのことである",
      "正しい",
      "GitHubは個人利用専用で、複数人での共同開発には対応していない",
      "GitHubはGitとはまったく別のバージョン管理の仕組みを使っている",
    ],
    answer: 1,
    explain:
      "この発言は正しいです。GitHubはGitリポジトリをホスティングし、Issueやプルリクエストなどの機能を通じて複数人での共同開発をしやすくするWebサービスです。ブラウザからアクセスできる点が特徴で、専用アプリのインストールが必須というわけではありません。個人利用はもちろん、企業やOSSコミュニティでのチーム開発にも広く使われています。裏側で使われているバージョン管理の仕組みはGitそのものです。",
    source: src(S.hello),
    successLine: "は？　偶然だし。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
  },
  {
    id: "gh-003",
    topic: "GitHubとは何か",
    difficulty: "easy",
    line: "GitHubは自分のパソコンにあるファイルを保存しておくためのオンラインストレージだよ。Dropboxとだいたい同じようなものだね。",
    choices: [
      "正しい",
      "変更履歴とブランチを前提にした共同開発の場で、単なるファイル置き場とは違う",
      "Dropboxと違うのは保存容量が無制限という点だけで、使い道はほとんど同じ",
      "パソコンのフォルダと自動で同期されるので、使い方もDropboxと同じ",
    ],
    answer: 1,
    explain:
      "GitHubは単なるファイルの置き場所ではなく、Gitによる変更履歴の管理、ブランチを使った並行作業、プルリクエストによるレビューなど、開発プロセスそのものを支える仕組みを持つサービスです。Dropboxのような汎用ストレージは「最新版のファイル同期」が主目的ですが、GitHubは「誰がいつ何を変更したか」を細かく追跡できる点が本質的に異なります。また、パソコンのフォルダと自動で同期する仕組みでもなく、手元の変更はcommitとpushで明示的に送ります。",
    source: src(S.repos),
    successLine: "ふん、今のはノーカンな。",
    failureLine: "残念、サウナ室から出直してこい。",
  },
  {
    id: "gh-004",
    topic: "repository（リポジトリ）",
    difficulty: "easy",
    line: "GitHubのリポジトリって、プロジェクトのファイルとその変更履歴をまとめて管理する場所のことだよ。",
    choices: [
      "リポジトリはファイルだけを保存する場所で、変更履歴は別サービスで管理する必要がある",
      "正しい",
      "リポジトリは1つのアカウントにつき1個しか作れない",
      "リポジトリはGitHub社の許可を得た人しか作成できない",
    ],
    answer: 1,
    explain:
      "この発言は正しいです。リポジトリ（repository）は、プロジェクトのファイル一式に加えて、それらがどう変更されてきたかというコミット履歴もまとめて保持する入れ物です。アカウント1つにつき複数のリポジトリを自由に作成でき、個人アカウントでも無料で新規作成が可能なので、数の制限や許可制という点も誤りです。",
    source: src(S.repos),
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "甘い甘い、100度じゃ足りねえな。",
  },
  {
    id: "gh-005",
    topic: "README",
    difficulty: "easy",
    line: "READMEファイルは、そのプロジェクトが何なのか、使い方などを説明するためのファイルだよ。",
    choices: [
      "READMEはプログラムの実行に必須のファイルで、削除するとアプリが動かなくなる",
      "READMEはGitHubが自動生成するファイルなので、人間が書く必要はない",
      "正しい",
      "READMEはIssueやプルリクエストの内容を自動でまとめたログファイルである",
    ],
    answer: 2,
    explain:
      "この発言は正しいです。READMEはリポジトリのトップページに表示される説明文書で、プロジェクトの概要、使い方、セットアップ手順などを人間向けに書いておくものです。多くの場合Markdown形式で書かれますが、あくまで説明用のドキュメントであり、プログラムの動作そのものには関与しません。GitHubが内容を自動生成するわけでもなく、執筆は開発者自身が行います。",
    source: src(S.readme),
    successLine: "これだから初心者は……いや今回は負けたわ。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
  },
  {
    id: "gh-006",
    topic: "READMEと完成度の勘違い",
    difficulty: "normal",
    line: "GitHubのREADMEがちゃんと書いてあれば、そのアプリはもう完成してる証拠だよ。",
    choices: [
      "正しい",
      "READMEが立派でも、コードが動くか・完成しているかは別に確かめる必要がある",
      "READMEはGitHubが内容を自動で検証しているので、書かれている機能は必ず動く",
      "READMEがあるのは公開審査に通ったリポジトリだけなので、完成品と言える",
    ],
    answer: 1,
    explain:
      "READMEはあくまで開発者が「書いた」説明文であり、内容の正確性や実装の完成度をGitHubが自動でチェックしてくれるわけではありません。理想を先に書いてから実装が追いついていないケースや、開発初期のまま更新されずに残っているケースも珍しくありません。実際に動くかどうかを確認するには、コードを読む・実行してみる・テストを確認するといった作業が別途必要です。GitHubに審査制度があるという事実もありません。",
    source: src(S.readme),
    successLine: "俺に勝つにはまだ10年早い……はずだったのにな。",
    failureLine: "整いすぎて脳みそ茹だったか？",
  },
  {
    id: "gh-007",
    topic: "commit",
    difficulty: "easy",
    line: "コミットするとその内容は自動的にGitHub上のリモートリポジトリにも同時に反映されるんだよ。",
    choices: [
      "正しい",
      "コミットはGitHub上でしかできず、手元のパソコンでは記録できない",
      "コミットは手元のリポジトリへの記録で、GitHubへ送るには別にpushが要る",
      "コミットは自動で反映されるが、GitHub側の画面に表示されるのは翌日以降になる",
    ],
    answer: 2,
    explain:
      "コミットはあくまで自分のパソコン内（ローカルリポジトリ）に変更の記録を残す操作です。この時点ではGitHub上のリモートリポジトリには何の変化もありません。ローカルの変更をGitHubに反映させるにはpush操作が必要で、pushして初めて他の人からも見える状態になります。コミット自体はローカルでもGitHub上のWeb編集でも行えるので、GitHub上でしかできないという説明も誤りです。",
    source: src(S.commits, S.push),
    successLine: "ととのうにはまだ早いな……って言いたかったのに。",
    failureLine: "ロウリュ効きすぎたんじゃねえの。",
  },
  {
    id: "gh-008",
    topic: "push",
    difficulty: "normal",
    line: "pushしたらGitHub上のファイルは更新されるけど、そのぶんローカルのパソコンに残っていたコミット履歴は消えちゃうんだよ。",
    choices: [
      "正しい",
      "消えるのは手元ではなくリモート側の履歴で、すべて手元の内容に置き換わる",
      "pushは送ったコミットを圧縮するので、手元では1つにまとめられる",
      "pushは手元のコミットをリモートへ送るだけで、手元の履歴はそのまま残る",
    ],
    answer: 3,
    explain:
      "pushは、ローカルリポジトリに積み上がったコミットをリモートリポジトリ（GitHub）に送って反映させる操作です。この操作によってローカル側のコミット履歴が失われることはなく、pushした後もローカルとリモートの両方に同じ履歴が存在する状態になります。リモート側の履歴が消えるという説明や、履歴圧縮のための操作という説明もいずれも誤りです。",
    source: src(S.push),
    successLine: "へえ、やるじゃん……くやしいけど。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
  },
  {
    id: "gh-009",
    topic: "clone",
    difficulty: "normal",
    line: "cloneした後に自分のパソコン側でファイルを変更すると、その変更は自動的に元のGitHub上のリポジトリにも反映されていくんだよ。",
    choices: [
      "正しい",
      "cloneはその時点のコピーを作るだけで、変更を戻すにはcommitとpushが要る",
      "clone中はリモートがロックされ、手元の変更が終わるまで誰も編集できない",
      "cloneで作ったコピーは読み取り専用なので、手元で編集すること自体ができない",
    ],
    answer: 1,
    explain:
      "cloneは、GitHub上にあるリポジトリのその時点の内容と履歴を丸ごと自分のパソコンにコピーしてくる操作です。しかしこれは一度きりのコピー動作であり、その後にローカルでファイルを編集しても自動的にリモートへ反映されることはありません。変更を反映させるには、変更内容をコミットしてからpushするという明示的な操作が必要です。cloneした後もファイルの編集自体は普通に行えるので、読み取り専用という説明も誤りです。",
    source: src(S.clone),
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
  },
  {
    id: "gh-010",
    topic: "pull",
    difficulty: "normal",
    line: "pullは、リモートリポジトリにある最新の変更を自分のローカル環境に取り込む操作だよ。",
    choices: [
      "正しい",
      "pullは手元の変更をリモートへ送る操作で、説明が逆になっている",
      "pullは最新の変更を確認するだけで、手元のファイルは変わらない",
      "pullは他人のリポジトリを自分のアカウントに複製して独立させる操作",
    ],
    answer: 0,
    explain:
      "この発言は正しいです。pullは、リモートリポジトリの最新の変更を取得（fetch）し、それを自分のローカルブランチに統合（merge）するところまでを一気に行う操作です。手元の作業を最新の状態に追いつかせたいときによく使います。ローカルからリモートへ送る操作はpushであり、pullとは向きが逆なので、それを混同した説明は誤りです。他人のリポジトリを自分名義にコピーする操作はforkと呼ばれ、pullとは別物です。変更を確認するだけで手元のファイルを変えない操作はfetchで、pullはfetchしたうえで手元に取り込みます。",
    source: src(S.pull),
    successLine: "あーもう、サウナ入り直すわ。",
    failureLine: "これだから初心者は。",
  },
  {
    id: "gh-011",
    topic: "branch",
    difficulty: "normal",
    line: "ブランチは1つのリポジトリにつき1個しか作れないから、みんな同じブランチの上で作業するしかないんだよ。",
    choices: [
      "正しい",
      "無料プランではブランチは1本までで、複数作るには有料プランの契約が要る",
      "ブランチは1人1本までなので、参加している人数分しか作れない",
      "1つのリポジトリに複数のブランチを作れ、機能ごとに並行して作業できる",
    ],
    answer: 3,
    explain:
      "ブランチはリポジトリの中に何個でも自由に作成できる、履歴の枝分かれです。機能追加ごとにブランチを分けたり、個人ごとに作業ブランチを分けたりすることで、お互いの作業がぶつからないように並行して開発を進められます。この機能はGitHubの無料プランでも制限なく使えるため、有料プランでのみ複数作成できるという説明も誤りです。",
    source: src(S.branches),
    successLine: "次はねえぞ、覚えとけよ……とか言っといて負けたわ。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
  },
  {
    id: "gh-012",
    topic: "merge",
    difficulty: "hard",
    line: "マージすると、片方のブランチの内容は完全に消えてなくなって、もう片方の内容だけが残るんだよ。",
    choices: [
      "正しい",
      "マージは一方の変更をもう一方へ取り込んで統合する操作で、変更は消えない",
      "マージは両方のブランチの履歴を消し、統合した後の状態だけを新しく残す",
      "マージは2つのブランチの差を表示するだけで、ファイルは変わらない",
    ],
    answer: 1,
    explain:
      "マージ（merge）は、あるブランチに加えられた変更を別のブランチに取り込んで一つに統合する操作です。統合される側のブランチが持っていた変更内容は消えるのではなく、マージ先のブランチに反映されます。マージ元のブランチ自体もGit上に残り続け、別途削除しない限りなくなりません。ファイルが変更されないという説明も誤りで、実際には差分を反映した新しいコミットが作られます。競合（コンフリクト）が起きた場合は手動で解消が必要になる点も初心者がつまずきやすいポイントです。",
    source: src(S.conflicts),
    successLine: "ふん、今のはノーカンな。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
  },
  {
    id: "gh-013",
    topic: "issue",
    difficulty: "easy",
    line: "Issueは、バグ報告や機能要望、やるべきタスクなどを記録して管理するための機能だよ。",
    choices: [
      "コードそのものを保存する場所で、ファイルの一種として扱われる",
      "正しい",
      "GitHub Actionsが自動生成するエラーログのことである",
      "有料プランの契約者しか作成できない機能である",
    ],
    answer: 1,
    explain:
      "この発言は正しいです。IssueはGitHub上でバグ報告、機能要望、TODOタスクなどを1件ずつチケットのように登録し、コメントやラベル、担当者付けをしながら管理できる機能です。コードファイルそのものではなく、あくまで議論・管理用の記録です。誰でも（権限があれば）自由に作成でき、無料プランでも制限なく使えます。",
    source: src(S.issues),
    successLine: "は？　偶然だし。",
    failureLine: "これだから初心者は。",
  },
  {
    id: "gh-014",
    topic: "pull request",
    difficulty: "normal",
    line: "プルリクエストを出したら、その時点で自動的にmainブランチにマージされるんだよ。",
    choices: [
      "正しい",
      "PRはレビューがなくても、24時間たつと自動でmainにマージされる",
      "PRを出した時点でmainに入り、問題があればレビューで取り消す仕組み",
      "PRは変更を取り込んでほしいという提案で、誰かがマージするまで入らない",
    ],
    answer: 3,
    explain:
      "プルリクエスト（PR）は、あるブランチの変更内容を別のブランチに取り込んでほしいという「提案」であり、出した時点では自動的にマージされません。レビュー担当者がコードを確認し、必要なら修正を経てから、誰かが明示的にマージボタンを押す（またはマージ操作を行う）ことで初めて取り込まれます。自動マージの設定を有効にしているリポジトリもありますが、それはあくまでオプション機能であり、標準の挙動ではありません。",
    source: src(S.prs),
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
  },
  {
    id: "gh-015",
    topic: "pull request",
    difficulty: "hard",
    line: "プルリクエストを経由するのは技術的に必須のルールで、mainブランチに直接pushすることはGitHub上そもそも不可能なんだよ。",
    choices: [
      "正しい",
      "PR経由は運用ルールで、保護ルールを設定しなければmainへ直接pushできる",
      "無料プランでは直接pushできるが、有料プランでは技術的に禁止される",
      "直接pushはできるが、そのコミットはGitHubが自動でPRに作り替える",
    ],
    answer: 1,
    explain:
      "プルリクエストを経由してレビューしてから取り込む、という運用は多くのチームが品質担保のために採用している「習慣・チーム運用ルール」であり、Git・GitHubの技術的な制約でそうなっているわけではありません。ブランチ保護ルール（branch protection rules）を設定していないリポジトリでは、権限を持つ人がmainブランチへ直接pushすること自体は技術的に可能です。プランの有無で直接pushの可否が変わるわけでもなく、直接pushしたからといってリポジトリが削除されることもありません。",
    source: src(S.protected),
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "整いすぎて脳みそ茹だったか？",
  },
  {
    id: "gh-016",
    topic: "GitHub Pages",
    difficulty: "normal",
    line: "GitHub Pagesを使えば、どんなプログラミング言語で書かれたサーバーサイドのプログラムでも動かせるすごい機能だよ。",
    choices: [
      "正しい",
      "サーバー処理は動くが、使える言語はRubyとJavaScriptの2つに限られる",
      "Pagesが配るのはHTML・CSS・JSなどの静的ファイルで、サーバー処理は動かない",
      "サーバー処理を動かせるのは有料プランだけで、無料では静的ページのみ",
    ],
    answer: 2,
    explain:
      "GitHub Pagesは、リポジトリ内のHTML・CSS・JavaScriptなどの静的ファイルをWebサイトとして公開するための機能です。ブラウザ側で動くJavaScriptは実行できますが、サーバー側で任意のプログラミング言語のコードを常駐実行するような、いわゆるサーバーサイド処理の機能は提供していません。特定の言語だけ動く、有料プランなら動く、という話でもなく、サーバー処理を動かさないのは静的サイトホスティングというGitHub Pagesの性質そのものです。",
    source: src(S.pages),
    successLine: "次はねえぞ、覚えとけよ。",
    failureLine: "ロウリュ効きすぎたんじゃねえの。",
  },
  {
    id: "gh-017",
    topic: "GitHub Pages",
    difficulty: "easy",
    line: "GitHub Pagesを使うと、リポジトリの中身を無料で公開のWebサイトとして公開できるよ。",
    choices: [
      "正しい",
      "リポジトリを非公開（プライベート）にしないと利用できない",
      "PHPなどのサーバー側プログラムも動くので、Webアプリを丸ごと置ける",
      "独自ドメインは使えず、必ずgithub.ioのアドレスで公開される",
    ],
    answer: 0,
    explain:
      "この発言は正しいです。GitHub Pagesは無料アカウントでも使える機能で、リポジトリ内の静的ファイルを指定するだけで、誰でもアクセスできる公開Webサイトとして配信できます。ただし正確には、無料プランでPagesを使えるのは公開（パブリック）リポジトリのみで、プライベートリポジトリでPagesを使うにはProなどの有料プランが必要です。むしろ公開サイトとして機能させることが目的なので、プライベートにしないと使えないという説明は実態と逆です。公開できるのはHTML・CSS・JavaScriptなどの静的なファイルで、PHPのようなサーバー側のプログラムは動きません。独自ドメインを設定することもできます。",
    source: src(S.pages),
    successLine: "へえ、やるじゃん……くやしいけど。",
    failureLine: "甘い甘い、100度じゃ足りねえな。",
  },
  {
    id: "gh-018",
    topic: "deploy（デプロイ）",
    difficulty: "normal",
    line: "GitHubにpushした瞬間、世界中のユーザーが使ってる本番環境にもそのまま自動的に反映されるんだよ。",
    choices: [
      "正しい",
      "pushはリポジトリを更新するだけで、本番への反映にはデプロイの仕組みが別に要る",
      "有料プランならpushと同時に本番へ反映されるが、無料プランでは手動での作業になる",
      "pushで本番に反映されるのはmainだけで、他のブランチは反映されない",
    ],
    answer: 1,
    explain:
      "pushはあくまでGitHub上のリポジトリの内容を更新するだけの操作で、それだけでは本番環境（実際にユーザーが使うサーバー）には何も起きません。本番環境に反映させる（デプロイする）には、GitHub ActionsなどのCI/CDパイプラインや、Vercel・Netlifyのような外部サービスとの連携を別途設定しておく必要があります。プラン課金によって自動デプロイが有効になるという事実もなく、これは設定次第の話です。",
    source: src(S.cd),
    successLine: "ふん、今のはノーカンな。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
  },
  {
    id: "gh-019",
    topic: "GitHub Actions",
    difficulty: "hard",
    line: "GitHub Actionsは、GitHub社の社員がリポジトリを人力でチェックしてくれる有人レビューサービスだよ。",
    choices: [
      "正しい",
      "Actionsは人ではなくAIがコードをレビューし、合否をコメントしてくれる機能",
      "Actionsはイベントをきっかけに、ワークフローに書いた処理を自動で実行する仕組み",
      "Actionsは人手のレビューだが、担当するのは社員ではなく外部の協力者",
    ],
    answer: 2,
    explain:
      "GitHub Actionsは、リポジトリ内に置いたYAML形式の設定ファイルでワークフローを定義し、push・プルリクエスト作成などのイベントをトリガーに、テストの実行やビルド、デプロイなどを自動化する仕組みです。GitHub社の社員が手動でチェックしているわけではなく、あくまでサーバー上で自動実行されるプログラムです。AIがレビューして合否を付ける機能でもなく、何を実行するかはワークフローに書いた内容で決まります。",
    source: src(S.actions),
    successLine: "……チッ。まぐれだろ。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
  },
  {
    id: "gh-020",
    topic: "GitHub Actions",
    difficulty: "normal",
    line: "GitHub Actionsを使うと、pushやプルリクエストの作成をきっかけに、テストやビルドなどを自動で実行できるんだよ。",
    choices: [
      "GitHub ActionsはIssueが作成された時にしか実行できない",
      "正しい",
      "GitHub Actionsを使うには、対象のリポジトリを有料プランに変更しなければならない",
      "GitHub Actionsで実行できるのはテストのみで、ビルドやデプロイには使えない",
    ],
    answer: 1,
    explain:
      "この発言は正しいです。GitHub Actionsは、push、プルリクエストの作成・更新、スケジュール実行など、さまざまなイベントをトリガーにワークフローを自動実行できる仕組みです。テストの自動実行だけでなく、ビルドやデプロイまで含めた一連の作業を自動化することもできます。パブリックリポジトリであれば無料プランでも一定の範囲で利用可能で、Issue作成時にしか動かないという制限もありません。",
    source: src(S.actions, S.events),
    successLine: "あーもう、サウナ入り直すわ。",
    failureLine: "これだから初心者は。",
  },
  {
    id: "gh-021",
    topic: ".gitignore",
    difficulty: "easy",
    line: "`.gitignore`に書いておけば、すでにGitで管理されている（コミット済みの）ファイルも自動的に無視されるようになるよ。",
    choices: [
      "正しい",
      ".gitignoreが効くのはまだ追跡していないファイルだけで、追跡済みには効かない",
      ".gitignoreに書くと追跡済みのファイルは消えるので、先にバックアップが要る",
      ".gitignoreは次のpushから効くので、コミット済みのファイルも送られなくなる",
    ],
    answer: 1,
    explain:
      "`.gitignore`は、まだGitに一度も追跡されていない（untrackedな）ファイルやフォルダを「コミット対象から除外する」ための設定です。すでにコミット済みで追跡されているファイルに後から書き加えても、そのファイル自体の追跡は自動的には止まりません。追跡から外すには`git rm --cached`のようなコマンドで明示的に外す作業が必要です。`.gitignore`に書いても追跡済みのファイルが消えることはなく、次のpushから送られなくなるわけでもありません。",
    source: src(S.gitignore),
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
  },
  {
    id: "gh-022",
    topic: ".envと秘密情報の管理",
    difficulty: "normal",
    line: "うっかりAPIキーを`.env`ファイルごとpushしちゃっても、後で気づいてリポジトリから削除すればもう漏洩の心配はないよ。",
    choices: [
      "正しい",
      "GitHubが漏れたキーを見つけると、すべての履歴から自動で消してくれる",
      "履歴に残り、すでに読まれた恐れもあるので、キー自体を無効化して再発行する",
      "ファイルを消した次のコミットで履歴も上書きされるので、削除だけで足りる",
    ],
    answer: 2,
    explain:
      "一度GitHubにpushされたAPIキーは、後からファイルを削除する新しいコミットを作っても、それより前のコミット履歴には残ったままです。パブリックリポジトリであれば誰かに閲覧・取得された可能性もありますし、ボットが常時スキャンして漏洩したキーを収集しているとも言われています。したがって最も安全な対応は、ファイルを消すことではなく、そのキー自体を無効化して新しいキーに再発行（ローテーション）することです。GitHubには機密情報のpushを検知する仕組み（シークレットスキャン等）はありますが、履歴を自動的に完全消去してくれるわけではありません。",
    source: src(S.sensitive, S.scanning),
    successLine: "ふん、今のはノーカンな。",
    failureLine: "整いすぎて脳みそ茹だったか？",
  },
  {
    id: "gh-023",
    topic: ".envと秘密情報の管理",
    difficulty: "hard",
    line: "一度GitHubにpushしちゃったAPIキーは、たとえその後すぐにファイルを削除しても、漏洩したものとして扱ってキー自体を再発行（ローテーション）するべきだよ。",
    choices: [
      "正しい",
      "ファイルさえ削除すれば履歴からも自動的に消えるので、キーの再発行までは不要である",
      "プライベートリポジトリであれば、削除さえすればキーの再発行は不要である",
      "GitHubにpushした情報は非公開設定にしている限り、外部からは絶対に閲覧不可能である",
    ],
    answer: 0,
    explain:
      "この発言は正しいです。Gitではコミット履歴が過去の状態も含めて残り続けるため、後からファイルを1つ削除するコミットを積んでも、それより前のコミットを遡れば元のAPIキーの値を見ることができてしまいます。クローンやフォーク、キャッシュなどを通じて既に第三者の手に渡っている可能性もゼロではないため、実務上は「見られた前提」で対応するのが安全です。プライベートリポジトリであっても、共同作業者の存在や設定変更のリスクがあるため、同様にローテーションが推奨されます。",
    source: src(S.sensitive),
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
  },
  {
    id: "gh-024",
    topic: ".envと秘密情報の管理",
    difficulty: "normal",
    line: "プライベートリポジトリになら`.env`ファイルをそのままコミットしても、他人に見られる心配は全くないから安心だよ。",
    choices: [
      "正しい",
      "非公開でも共同作業者や公開設定の変更などで広がりうるので、秘密はコミットしない",
      "非公開リポジトリは中身が暗号化されるので、.envを入れても読めなくなる",
      "非公開にすれば、あとで公開に切り替えても過去のコミットは見えない",
    ],
    answer: 1,
    explain:
      "プライベートリポジトリは第三者から見えにくくはなりますが、絶対安全というわけではありません。共同作業者を追加した場合、その人にも中身が見えますし、うっかり公開設定に変更してしまう事故や、誰かがクローンしたコピーを別の場所に持ち出すことも起こり得ます。そのため業界的なベストプラクティスは「プライベートかどうかにかかわらず秘密情報はそもそもコミットしない」ことであり、`.env`などは`.gitignore`で除外し、環境変数やシークレット管理サービスで管理するのが基本です。リポジトリ自体が自動暗号化されて中身が読めなくなるという仕様もありません。",
    source: src(S.visibility),
    successLine: "次はねえぞ、覚えとけよ。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
  },
  {
    id: "gh-025",
    topic: "「GitHubに置いてある＝動く完成品」ではない",
    difficulty: "normal",
    line: "GitHubにソースコードが上がっていれば、それはもうちゃんと動作する完成品だと考えていいよ。",
    choices: [
      "正しい",
      "GitHubはアップロード時に動作確認をし、動かないコードは公開を拒否する",
      "公開されていることと動く完成品であることは別で、開発途中やバグ入りも多い",
      "スターが10以上ついたリポジトリは、GitHubが動作を保証している",
    ],
    answer: 2,
    explain:
      "GitHubは誰でも自由にコードを公開できる場所であり、公開されているというだけではそのコードが完成しているとも、正しく動作するとも限りません。作りかけのまま放置されたプロジェクト、必要なライブラリのインストール手順が書かれていないプロジェクト、特定の環境でしか動かないプロジェクトなどが大量に存在します。GitHubがアップロード時に動作確認や審査を行う仕組みは存在せず、実際に動くかどうかを確かめるには自分で環境を整えて実行してみる必要があります。",
    source: src(S.repos),
    successLine: "……チッ。まぐれだろ。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
  },
  {
    id: "gh-026",
    topic: "差分確認（diff）",
    difficulty: "normal",
    line: "GitHubの差分（diff）画面って、緑色の行が削除された行で、赤色の行が新しく追加された行を表してるんだよ。",
    choices: [
      "正しい",
      "緑も赤も「変更された行」という意味で、追加と削除の区別は表示されない",
      "色は見る人の設定で決まり、既定では緑が削除・赤が追加になっている",
      "緑が追加された行、赤が削除された行で、色の割り当てが逆になっている",
    ],
    answer: 3,
    explain:
      "GitHubのプルリクエストやコミットのdiff（差分）表示では、一般的に緑色の背景が「追加された行」、赤色の背景が「削除された行」を表します。発言では色の意味が逆になっており、初心者が最初によく混同しやすいポイントです。diff表示には追加と削除を区別する色分けがあり、既定の配色では緑が追加、赤が削除です。差分を正しく読めるようになると、プルリクエストのレビューで「実際に何が変わったか」を素早く把握できるようになります。",
    source: src(S.review),
    successLine: "ふん、今のはノーカンな。",
    failureLine: "甘い甘い、100度じゃ足りねえな。",
  },
  {
    id: "gh-027",
    topic: "コミット履歴",
    difficulty: "normal",
    line: "GitHubのコミット履歴は、新しくpushするたびにそれまでの履歴が消えて、直近のpush分だけに置き換わっていくんだよ。",
    choices: [
      "正しい",
      "履歴は積み上がっていき、pushのたびに新しいコミットが後ろに加わる",
      "GitHubが保存するのは直近100件までで、古いコミットから順に消える",
      "pushのたびに過去のコミットは1つにまとめられ、細かい履歴は消える",
    ],
    answer: 1,
    explain:
      "Gitのコミット履歴は基本的に追記型で、pushするたびに新しいコミットが履歴の末尾に積み重なっていきます。特別な操作（force pushによる履歴の書き換えなど）をしない限り、過去のコミット履歴が勝手に消えることはありません。GitHub上のリポジトリページやコミット一覧からもすべての履歴を辿って確認できるため、件数に上限があるわけでも、pushのたびに過去のコミットが1つにまとめられるわけでもありません。",
    source: src(S.gitlog),
    successLine: "へえ、やるじゃん……くやしいけど。",
    failureLine: "残念、サウナ室から出直してこい。",
  },
  {
    id: "gh-028",
    topic: "ローカルとリモートの違い",
    difficulty: "easy",
    line: "ローカルリポジトリは自分のパソコンの中にあるGit管理下のプロジェクトのことで、リモートリポジトリはGitHubなど別の場所に置かれているコピーのことだよ。",
    choices: [
      "ローカルとリモートは常に自動的に同じ内容に同期され続けており、区別する意味がない",
      "正しい",
      "リモートリポジトリという概念は存在せず、GitHub上のものもすべてローカルリポジトリと呼ぶ",
      "ローカルリポジトリはコミットができず、閲覧専用の存在である",
    ],
    answer: 1,
    explain:
      "この発言は正しいです。ローカルリポジトリは自分のパソコン上にあるGit管理下のプロジェクトのコピーで、リモートリポジトリはGitHubなどのサーバー上に置かれた同じプロジェクトのコピーです。両者は自動的に常時同期されるわけではなく、pushやpullといった操作を通じて手動でタイミングを合わせて同期させる必要があります。ローカルリポジトリでも通常どおりコミットができるので、閲覧専用という説明も誤りです。",
    source: src(S.remotes),
    successLine: "は？　偶然だし。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
  },
  {
    id: "gh-029",
    topic: "ローカルとリモートの違い",
    difficulty: "hard",
    line: "ローカルでコミットを取り消したり（revertやreset）しても、何もしなくてもリモートのGitHub上の履歴には自動的にその変更が反映されるんだよ。",
    choices: [
      "正しい",
      "revertは自動で反映されるが、resetはGitHub上の画面でしか行えない",
      "手元でresetするとリモートが自動でロックされ、誰も操作できなくなる",
      "手元の取り消しは手元だけの変更で、リモートへ反映するにはpushが要る",
    ],
    answer: 3,
    explain:
      "revertやresetでローカルのコミット履歴を取り消したり書き換えたりしても、その変更はローカルリポジトリの中だけで完結しており、GitHub上のリモートリポジトリには自動的には反映されません。反映させるにはpush操作が必要で、特にresetのように過去の履歴そのものを書き換えた場合は、通常のpushでは拒否されるため、force push（強制push）という慎重に扱うべき操作が必要になることもあります。revertやresetはローカルのコマンドラインやGitクライアントで行う操作で、GitHubのWeb画面専用の機能ではありません。",
    source: src(S.revert, S.reset),
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
  },
  {
    id: "gh-030",
    topic: "AIにGitHubリポジトリを読ませるときの注意",
    difficulty: "hard",
    line: "AIにGitHubのリポジトリを読み込ませて質問すれば、READMEに書いてある通りに実際のコードも完璧に動くかどうかまで保証してくれるんだよ。",
    choices: [
      "正しい",
      "AIは読解の助けにはなるが、実行して確かめるわけではなく誤読もありうる",
      "AIは中でコードを実行して確かめるので、動かない部分があれば必ず指摘する",
      "READMEと実装がずれている場合だけは、AIが自動で気づいて警告してくれる",
    ],
    answer: 1,
    explain:
      "AIはREADMEやコードを要約・解説する助けにはなりますが、読んだだけで実際にコードを動かして確かめているわけではありません。GitHub の公式文書も、Copilot Chat が生成する説明は正確・完全とは限らないのでレビューが必要だとしています。READMEと実装のズレや、AI自身の誤読もありえます。動くかどうかは、自分で実行して確かめるのが基本です。",
    source: src(S.copilot),
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "整いすぎて脳みそ茹だったか？",
  },
]);
