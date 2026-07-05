/**
 * 「赤坂 GitHub 店」— GitHub初心者向け問題データ（30問）
 *
 * ゲームの仕組み:
 *   偽まさおがGitHub関連の発言をする。プレイヤーはその発言が
 *   「正しいか」「間違っているならどこがどう間違っているか」を4択で答える。
 *   全問、選択肢の1つは必ず "正しい" という文字列。
 *
 * @typedef {Object} GithubQuestion
 * @property {string} id                 - "gh-001" 形式の一意なID
 * @property {string} storeId            - 常に "github"
 * @property {string} topic              - 出題テーマ（日本語）
 * @property {"easy"|"normal"|"hard"} difficulty
 * @property {string} fakeMasaoLine       - 偽まさおの発言（口語・断定調）
 * @property {string} questionText        - プレイヤーへの設問文
 * @property {string[]} choices           - 4択。必ず "正しい" を含む
 * @property {string} correctChoice       - choices内の文字列と完全一致する正解
 * @property {boolean} isFakeMasaoCorrect - 偽まさおの発言が正しいかどうか
 * @property {string} successLine         - 正解時の偽まさおの捨て台詞
 * @property {string} failureLine         - 不正解時の偽まさおの煽り台詞
 * @property {string} reviewExplanation   - 解説（3〜5文）
 * @property {string} sourceMemo          - 参考にした一般的な公式情報源
 *
 * 内訳: 全30問 / isFakeMasaoCorrect true=9問, false=21問
 *       difficulty: easy=10, normal=14, hard=6
 *
 * @type {GithubQuestion[]}
 */
export const githubQuestions = [
  {
    id: "gh-001",
    storeId: "github",
    topic: "GitとGitHubの違い",
    difficulty: "easy",
    fakeMasaoLine: "GitとGitHubは同じものだよ。呼び方が違うだけ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "Gitはバージョン管理システム、GitHubはそれをホスティングするWebサービスで別物",
      "GitはGitHub社が作ったツールなので、GitHubがないと使えない",
      "GitHubはGitの有料版のことである",
    ],
    correctChoice:
      "Gitはバージョン管理システム、GitHubはそれをホスティングするWebサービスで別物",
    isFakeMasaoCorrect: false,
    successLine: "……チッ。まぐれだろ。",
    failureLine: "ほら見ろ。その程度か。",
    reviewExplanation:
      "Gitはローカルのパソコン上だけでも動作するバージョン管理システムで、GitHub社が生まれる前から存在します。GitHubはそのGitリポジトリをインターネット上でホスティングし、共同作業やレビューをしやすくするWebサービスです。GitはGitHub社製ではなくLinus Torvaldsが開発したオープンソースのツールなので、GitHubがなくてもGitだけで使えます。有料版云々という話でもなく、単純に「ツール」と「そのツールを使ったサービス」という別レイヤーの話です。",
    sourceMemo: "GitHub Docs: About Git / Git公式サイト About",
  },
  {
    id: "gh-002",
    storeId: "github",
    topic: "GitHubとは何か",
    difficulty: "easy",
    fakeMasaoLine:
      "GitHubはGitリポジトリをインターネット上に置いて、みんなで一緒にコードを開発できるようにするWebサービスだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "GitHubはWebサービスではなく、パソコンにインストールする専用アプリのことである",
      "正しい",
      "GitHubは個人利用専用で、複数人での共同開発には対応していない",
      "GitHubはGitとはまったく別のバージョン管理の仕組みを使っている",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "は？　偶然だし。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
    reviewExplanation:
      "この発言は正しいです。GitHubはGitリポジトリをホスティングし、Issueやプルリクエストなどの機能を通じて複数人での共同開発をしやすくするWebサービスです。ブラウザからアクセスできる点が特徴で、専用アプリのインストールが必須というわけではありません。個人利用はもちろん、企業やOSSコミュニティでのチーム開発にも広く使われています。裏側で使われているバージョン管理の仕組みはGitそのものです。",
    sourceMemo: "GitHub Docs: Hello World / GitHub about page",
  },
  {
    id: "gh-003",
    storeId: "github",
    topic: "GitHubとは何か",
    difficulty: "easy",
    fakeMasaoLine:
      "GitHubは自分のパソコンにあるファイルを保存しておくためのオンラインストレージだよ。Dropboxとだいたい同じようなものだね。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "GitHubはコードの変更履歴やブランチ管理を前提としたバージョン管理・共同開発サービスであり、単なるファイル保存サービスとは違う",
      "GitHubはファイルの保存すらできず、コードの表示専用のサービスである",
      "GitHubはDropboxよりも保存容量がはるかに大きいという点だけが違う",
    ],
    correctChoice:
      "GitHubはコードの変更履歴やブランチ管理を前提としたバージョン管理・共同開発サービスであり、単なるファイル保存サービスとは違う",
    isFakeMasaoCorrect: false,
    successLine: "ふん、今のはノーカンな。",
    failureLine: "残念、サウナ室から出直してこい。",
    reviewExplanation:
      "GitHubは単なるファイルの置き場所ではなく、Gitによる変更履歴の管理、ブランチを使った並行作業、プルリクエストによるレビューなど、開発プロセスそのものを支える仕組みを持つサービスです。Dropboxのような汎用ストレージは「最新版のファイル同期」が主目的ですが、GitHubは「誰がいつ何を変更したか」を細かく追跡できる点が本質的に異なります。ファイルの保存自体はもちろんできるので、保存できないという選択肢も誤りです。",
    sourceMemo: "GitHub Docs: About repositories",
  },
  {
    id: "gh-004",
    storeId: "github",
    topic: "repository（リポジトリ）",
    difficulty: "easy",
    fakeMasaoLine:
      "GitHubのリポジトリって、プロジェクトのファイルとその変更履歴をまとめて管理する場所のことだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "リポジトリはファイルだけを保存する場所で、変更履歴は別サービスで管理する必要がある",
      "正しい",
      "リポジトリは1つのアカウントにつき1個しか作れない",
      "リポジトリはGitHub社の許可を得た人しか作成できない",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "甘い甘い、100度じゃ足りねえな。",
    reviewExplanation:
      "この発言は正しいです。リポジトリ（repository）は、プロジェクトのファイル一式に加えて、それらがどう変更されてきたかというコミット履歴もまとめて保持する入れ物です。アカウント1つにつき複数のリポジトリを自由に作成でき、個人アカウントでも無料で新規作成が可能なので、数の制限や許可制という点も誤りです。",
    sourceMemo: "GitHub Docs: About repositories",
  },
  {
    id: "gh-005",
    storeId: "github",
    topic: "README",
    difficulty: "easy",
    fakeMasaoLine:
      "READMEファイルは、そのプロジェクトが何なのか、使い方などを説明するためのファイルだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "READMEはプログラムの実行に必須のファイルで、削除するとアプリが動かなくなる",
      "READMEはGitHubが自動生成するファイルなので、人間が書く必要はない",
      "正しい",
      "READMEはIssueやプルリクエストの内容を自動でまとめたログファイルである",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "これだから初心者は……いや今回は負けたわ。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
    reviewExplanation:
      "この発言は正しいです。READMEはリポジトリのトップページに表示される説明文書で、プロジェクトの概要、使い方、セットアップ手順などを人間向けに書いておくものです。多くの場合Markdown形式で書かれますが、あくまで説明用のドキュメントであり、プログラムの動作そのものには関与しません。GitHubが内容を自動生成するわけでもなく、執筆は開発者自身が行います。",
    sourceMemo: "GitHub Docs: About READMEs",
  },
  {
    id: "gh-006",
    storeId: "github",
    topic: "READMEと完成度の勘違い",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHubのREADMEがちゃんと書いてあれば、そのアプリはもう完成してる証拠だよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "READMEの充実度とアプリが実際に動くかどうかは別問題で、READMEが立派でも未完成・動作しないコードのことは多い",
      "READMEはGitHubによって内容の正確性が自動でチェックされているので、書いてある内容は必ず実現されている",
      "READMEが書いてあるリポジトリは、GitHub運営の審査に合格したものだけである",
    ],
    correctChoice:
      "READMEの充実度とアプリが実際に動くかどうかは別問題で、READMEが立派でも未完成・動作しないコードのことは多い",
    isFakeMasaoCorrect: false,
    successLine: "俺に勝つにはまだ10年早い……はずだったのにな。",
    failureLine: "整いすぎて脳みそ茹だったか？",
    reviewExplanation:
      "READMEはあくまで開発者が「書いた」説明文であり、内容の正確性や実装の完成度をGitHubが自動でチェックしてくれるわけではありません。理想を先に書いてから実装が追いついていないケースや、開発初期のまま更新されずに残っているケースも珍しくありません。実際に動くかどうかを確認するには、コードを読む・実行してみる・テストを確認するといった作業が別途必要です。GitHubに審査制度があるという事実もありません。",
    sourceMemo: "GitHub Docs: About READMEs（一般的な留意事項）",
  },
  {
    id: "gh-007",
    storeId: "github",
    topic: "commit",
    difficulty: "easy",
    fakeMasaoLine:
      "コミットするとその内容は自動的にGitHub上のリモートリポジトリにも同時に反映されるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "コミットはローカルリポジトリ内での記録であり、GitHub側に反映するにはpushという別の操作が必要",
      "コミットはGitHub上でしかできない操作で、ローカルでは行えない",
      "コミットするとファイルが暗号化されてリモートに送信される",
    ],
    correctChoice:
      "コミットはローカルリポジトリ内での記録であり、GitHub側に反映するにはpushという別の操作が必要",
    isFakeMasaoCorrect: false,
    successLine: "ととのうにはまだ早いな……って言いたかったのに。",
    failureLine: "ロウリュ効きすぎたんじゃねえの。",
    reviewExplanation:
      "コミットはあくまで自分のパソコン内（ローカルリポジトリ）に変更の記録を残す操作です。この時点ではGitHub上のリモートリポジトリには何の変化もありません。ローカルの変更をGitHubに反映させるにはpush操作が必要で、pushして初めて他の人からも見える状態になります。コミット自体はローカルでもGitHub上のWeb編集でも行えるので、GitHub上でしかできないという説明も誤りです。",
    sourceMemo: "GitHub Docs: Git commit / About commits",
  },
  {
    id: "gh-008",
    storeId: "github",
    topic: "push",
    difficulty: "normal",
    fakeMasaoLine:
      "pushしたらGitHub上のファイルは更新されるけど、そのぶんローカルのパソコンに残っていたコミット履歴は消えちゃうんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "pushはローカルのコミットをリモートに送る操作であり、ローカル側のコミット履歴はそのまま手元にも残り続ける",
      "pushするとリモート側の履歴が消え、ローカルの履歴だけが正になる",
      "pushは履歴を圧縮してファイルサイズを小さくするための操作である",
    ],
    correctChoice:
      "pushはローカルのコミットをリモートに送る操作であり、ローカル側のコミット履歴はそのまま手元にも残り続ける",
    isFakeMasaoCorrect: false,
    successLine: "へえ、やるじゃん……くやしいけど。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
    reviewExplanation:
      "pushは、ローカルリポジトリに積み上がったコミットをリモートリポジトリ（GitHub）に送って反映させる操作です。この操作によってローカル側のコミット履歴が失われることはなく、pushした後もローカルとリモートの両方に同じ履歴が存在する状態になります。リモート側の履歴が消えるという説明や、履歴圧縮のための操作という説明もいずれも誤りです。",
    sourceMemo: "GitHub Docs: Pushing commits to a remote repository",
  },
  {
    id: "gh-009",
    storeId: "github",
    topic: "clone",
    difficulty: "normal",
    fakeMasaoLine:
      "cloneした後に自分のパソコン側でファイルを変更すると、その変更は自動的に元のGitHub上のリポジトリにも反映されていくんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "cloneは特定時点のコピーを手元に作る操作であり、その後の手元での変更をリモートに反映するにはコミットとpushという別の操作が必要",
      "cloneするとリモート側のリポジトリはロックされ、誰も変更できなくなる",
      "cloneは読み取り専用のコピーを作る操作で、そもそも手元で編集すること自体ができない",
    ],
    correctChoice:
      "cloneは特定時点のコピーを手元に作る操作であり、その後の手元での変更をリモートに反映するにはコミットとpushという別の操作が必要",
    isFakeMasaoCorrect: false,
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
    reviewExplanation:
      "cloneは、GitHub上にあるリポジトリのその時点の内容と履歴を丸ごと自分のパソコンにコピーしてくる操作です。しかしこれは一度きりのコピー動作であり、その後にローカルでファイルを編集しても自動的にリモートへ反映されることはありません。変更を反映させるには、変更内容をコミットしてからpushするという明示的な操作が必要です。cloneした後もファイルの編集自体は普通に行えるので、読み取り専用という説明も誤りです。",
    sourceMemo: "GitHub Docs: Cloning a repository",
  },
  {
    id: "gh-010",
    storeId: "github",
    topic: "pull",
    difficulty: "normal",
    fakeMasaoLine:
      "pullは、リモートリポジトリにある最新の変更を自分のローカル環境に取り込む操作だよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "pullはローカルの変更をリモートに送る操作であり、説明が逆である",
      "正しい",
      "pullはリモートリポジトリを完全に削除して作り直す操作である",
      "pullは他人のリポジトリを自分のアカウントにコピーして独立させる操作である",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "あーもう、サウナ入り直すわ。",
    failureLine: "これだから初心者は。",
    reviewExplanation:
      "この発言は正しいです。pullは、リモートリポジトリの最新の変更を取得（fetch）し、それを自分のローカルブランチに統合（merge）するところまでを一気に行う操作です。手元の作業を最新の状態に追いつかせたいときによく使います。ローカルからリモートへ送る操作はpushであり、pullとは向きが逆なので、それを混同した説明は誤りです。他人のリポジトリを自分名義にコピーする操作はforkと呼ばれ、pullとは別物です。",
    sourceMemo: "GitHub Docs: Getting changes from a remote repository (fetch, pull)",
  },
  {
    id: "gh-011",
    storeId: "github",
    topic: "branch",
    difficulty: "normal",
    fakeMasaoLine:
      "ブランチは1つのリポジトリにつき1個しか作れないから、みんな同じブランチの上で作業するしかないんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "1つのリポジトリの中に複数のブランチを自由に作成でき、機能ごとに分かれて並行作業することができる",
      "ブランチは有料プランでのみ複数作成でき、無料プランでは1個までに制限されている",
      "ブランチは1人のユーザーにつき1個までしか作成できない",
    ],
    correctChoice:
      "1つのリポジトリの中に複数のブランチを自由に作成でき、機能ごとに分かれて並行作業することができる",
    isFakeMasaoCorrect: false,
    successLine: "次はねえぞ、覚えとけよ……とか言っといて負けたわ。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
    reviewExplanation:
      "ブランチはリポジトリの中に何個でも自由に作成できる、履歴の枝分かれです。機能追加ごとにブランチを分けたり、個人ごとに作業ブランチを分けたりすることで、お互いの作業がぶつからないように並行して開発を進められます。この機能はGitHubの無料プランでも制限なく使えるため、有料プランでのみ複数作成できるという説明も誤りです。",
    sourceMemo: "GitHub Docs: About branches",
  },
  {
    id: "gh-012",
    storeId: "github",
    topic: "merge",
    difficulty: "hard",
    fakeMasaoLine:
      "マージすると、片方のブランチの内容は完全に消えてなくなって、もう片方の内容だけが残るんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "マージは片方のブランチに加えられた変更を取り込んで統合する操作であり、統合元のブランチの変更内容が消えるわけではない",
      "マージすると2つのブランチのコミット履歴が両方とも完全に削除され、真っさらな状態から始まる",
      "マージはブランチ同士の内容を比較するだけで、実際にはファイルは一切変更されない",
    ],
    correctChoice:
      "マージは片方のブランチに加えられた変更を取り込んで統合する操作であり、統合元のブランチの変更内容が消えるわけではない",
    isFakeMasaoCorrect: false,
    successLine: "ふん、今のはノーカンな。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
    reviewExplanation:
      "マージ（merge）は、あるブランチに加えられた変更を別のブランチに取り込んで一つに統合する操作です。統合される側のブランチが持っていた変更内容は消えるのではなく、マージ先のブランチに反映されます。マージ元のブランチ自体もGit上に残り続け、別途削除しない限りなくなりません。ファイルが変更されないという説明も誤りで、実際には差分を反映した新しいコミットが作られます。競合（コンフリクト）が起きた場合は手動で解消が必要になる点も初心者がつまずきやすいポイントです。",
    sourceMemo: "GitHub Docs: About merge conflicts / Merging a pull request",
  },
  {
    id: "gh-013",
    storeId: "github",
    topic: "issue",
    difficulty: "easy",
    fakeMasaoLine:
      "Issueは、バグ報告や機能要望、やるべきタスクなどを記録して管理するための機能だよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "コードそのものを保存する場所で、ファイルの一種として扱われる",
      "正しい",
      "GitHub Actionsが自動生成するエラーログのことである",
      "有料プランの契約者しか作成できない機能である",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "は？　偶然だし。",
    failureLine: "これだから初心者は。",
    reviewExplanation:
      "この発言は正しいです。IssueはGitHub上でバグ報告、機能要望、TODOタスクなどを1件ずつチケットのように登録し、コメントやラベル、担当者付けをしながら管理できる機能です。コードファイルそのものではなく、あくまで議論・管理用の記録です。誰でも（権限があれば）自由に作成でき、無料プランでも制限なく使えます。",
    sourceMemo: "GitHub Docs: About issues",
  },
  {
    id: "gh-014",
    storeId: "github",
    topic: "pull request",
    difficulty: "normal",
    fakeMasaoLine:
      "プルリクエストを出したら、その時点で自動的にmainブランチにマージされるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "プルリクエストは変更内容をレビューしてもらうための提案であり、レビューを経て誰かが明示的にマージ操作をするまでは取り込まれない",
      "プルリクエストを出すと、レビューの有無に関係なく24時間後に自動でマージされる",
      "プルリクエストはコードを削除する操作であり、マージとは正反対の意味を持つ",
    ],
    correctChoice:
      "プルリクエストは変更内容をレビューしてもらうための提案であり、レビューを経て誰かが明示的にマージ操作をするまでは取り込まれない",
    isFakeMasaoCorrect: false,
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
    reviewExplanation:
      "プルリクエスト（PR）は、あるブランチの変更内容を別のブランチに取り込んでほしいという「提案」であり、出した時点では自動的にマージされません。レビュー担当者がコードを確認し、必要なら修正を経てから、誰かが明示的にマージボタンを押す（またはマージ操作を行う）ことで初めて取り込まれます。自動マージの設定を有効にしているリポジトリもありますが、それはあくまでオプション機能であり、標準の挙動ではありません。",
    sourceMemo: "GitHub Docs: About pull requests / Merging a pull request",
  },
  {
    id: "gh-015",
    storeId: "github",
    topic: "pull request",
    difficulty: "hard",
    fakeMasaoLine:
      "プルリクエストを経由するのは技術的に必須のルールで、mainブランチに直接pushすることはGitHub上そもそも不可能なんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "プルリクエストを使う運用は多くのチームで採用される慣習・設定であり、ブランチ保護ルールを設定していなければmainへの直接pushは技術的に可能である",
      "mainブランチへの直接pushは無料プランでは可能だが、有料プランでは技術的に禁止される",
      "プルリクエストを使わずにpushすると、GitHubがそのリポジトリを自動的に削除する",
    ],
    correctChoice:
      "プルリクエストを使う運用は多くのチームで採用される慣習・設定であり、ブランチ保護ルールを設定していなければmainへの直接pushは技術的に可能である",
    isFakeMasaoCorrect: false,
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "整いすぎて脳みそ茹だったか？",
    reviewExplanation:
      "プルリクエストを経由してレビューしてから取り込む、という運用は多くのチームが品質担保のために採用している「習慣・チーム運用ルール」であり、Git・GitHubの技術的な制約でそうなっているわけではありません。ブランチ保護ルール（branch protection rules）を設定していないリポジトリでは、権限を持つ人がmainブランチへ直接pushすること自体は技術的に可能です。プランの有無で直接pushの可否が変わるわけでもなく、直接pushしたからといってリポジトリが削除されることもありません。",
    sourceMemo: "GitHub Docs: About protected branches",
  },
  {
    id: "gh-016",
    storeId: "github",
    topic: "GitHub Pages",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHub Pagesを使えば、どんなプログラミング言語で書かれたサーバーサイドのプログラムでも動かせるすごい機能だよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "GitHub PagesはHTML・CSS・JavaScriptなどの静的なファイルを公開するための仕組みであり、サーバー上で任意言語のプログラムを実行する機能ではない",
      "GitHub Pagesは動画配信専用のサービスで、Webサイトの公開には使えない",
      "GitHub Pagesは公開できるファイル数に上限がなく、あらゆる種類のサーバーアプリを無制限にホスティングできる",
    ],
    correctChoice:
      "GitHub PagesはHTML・CSS・JavaScriptなどの静的なファイルを公開するための仕組みであり、サーバー上で任意言語のプログラムを実行する機能ではない",
    isFakeMasaoCorrect: false,
    successLine: "次はねえぞ、覚えとけよ。",
    failureLine: "ロウリュ効きすぎたんじゃねえの。",
    reviewExplanation:
      "GitHub Pagesは、リポジトリ内のHTML・CSS・JavaScriptなどの静的ファイルをWebサイトとして公開するための機能です。ブラウザ側で動くJavaScriptは実行できますが、サーバー側で任意のプログラミング言語のコードを常駐実行するような、いわゆるサーバーサイド処理の機能は提供していません。動画配信専用という説明も誤りですし、無制限にどんなサーバーアプリでも動かせるという説明も、静的サイトホスティングというGitHub Pagesの性質に反します。",
    sourceMemo: "GitHub Docs: About GitHub Pages",
  },
  {
    id: "gh-017",
    storeId: "github",
    topic: "GitHub Pages",
    difficulty: "easy",
    fakeMasaoLine:
      "GitHub Pagesを使うと、リポジトリの中身を無料で公開のWebサイトとして公開できるよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "有料プラン契約者のみが使える機能である",
      "正しい",
      "リポジトリを非公開（プライベート）にしないと利用できなくなる",
      "公開から24時間後に自動的に非公開になる",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "へえ、やるじゃん……くやしいけど。",
    failureLine: "甘い甘い、100度じゃ足りねえな。",
    reviewExplanation:
      "この発言は正しいです。GitHub Pagesは無料アカウントでも使える機能で、リポジトリ内の静的ファイルを指定するだけで、誰でもアクセスできる公開Webサイトとして配信できます。むしろ公開サイトとして機能させることが目的なので、プライベートにしないと使えないという説明は実態と逆です。公開が自動で止まるといった時間制限もありません。",
    sourceMemo: "GitHub Docs: About GitHub Pages",
  },
  {
    id: "gh-018",
    storeId: "github",
    topic: "deploy（デプロイ）",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHubにpushした瞬間、世界中のユーザーが使ってる本番環境にもそのまま自動的に反映されるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "pushはリポジトリの内容を更新するだけの操作であり、本番環境への反映（デプロイ）にはデプロイ用の仕組みを別途設定・実行する必要がある",
      "pushすると本番環境だけでなく、他人のリポジトリにも自動的にコードがコピーされる",
      "本番環境への反映は、GitHubの有料プランに加入していれば自動的に行われる",
    ],
    correctChoice:
      "pushはリポジトリの内容を更新するだけの操作であり、本番環境への反映（デプロイ）にはデプロイ用の仕組みを別途設定・実行する必要がある",
    isFakeMasaoCorrect: false,
    successLine: "ふん、今のはノーカンな。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
    reviewExplanation:
      "pushはあくまでGitHub上のリポジトリの内容を更新するだけの操作で、それだけでは本番環境（実際にユーザーが使うサーバー）には何も起きません。本番環境に反映させる（デプロイする）には、GitHub ActionsなどのCI/CDパイプラインや、Vercel・Netlifyのような外部サービスとの連携を別途設定しておく必要があります。プラン課金によって自動デプロイが有効になるという事実もなく、これは設定次第の話です。",
    sourceMemo: "GitHub Docs: About continuous deployment（一般的なデプロイの考え方）",
  },
  {
    id: "gh-019",
    storeId: "github",
    topic: "GitHub Actions",
    difficulty: "hard",
    fakeMasaoLine:
      "GitHub Actionsは、GitHub社の社員がリポジトリを人力でチェックしてくれる有人レビューサービスだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "GitHub ActionsはYAML形式のワークフローに従い、イベントをきっかけに自動でテストやビルドなどを実行する仕組みであり、人による手動レビューではない",
      "GitHub ActionsはIssueに書き込まれた内容をもとに、自動でコードを執筆してくれる機能である",
      "GitHub Actionsはリポジトリの脆弱性を発見すると、自動的にリポジトリを非公開にする機能である",
    ],
    correctChoice:
      "GitHub ActionsはYAML形式のワークフローに従い、イベントをきっかけに自動でテストやビルドなどを実行する仕組みであり、人による手動レビューではない",
    isFakeMasaoCorrect: false,
    successLine: "……チッ。まぐれだろ。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
    reviewExplanation:
      "GitHub Actionsは、リポジトリ内に置いたYAML形式の設定ファイルでワークフローを定義し、push・プルリクエスト作成などのイベントをトリガーに、テストの実行やビルド、デプロイなどを自動化する仕組みです。GitHub社の社員が手動でチェックしているわけではなく、あくまでサーバー上で自動実行されるプログラムです。コードを自動執筆する機能でもなければ、脆弱性発見時に自動でリポジトリを非公開化するような機能でもありません。",
    sourceMemo: "GitHub Docs: Understanding GitHub Actions",
  },
  {
    id: "gh-020",
    storeId: "github",
    topic: "GitHub Actions",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHub Actionsを使うと、pushやプルリクエストの作成をきっかけに、テストやビルドなどを自動で実行できるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "GitHub ActionsはIssueが作成された時にしか実行できない",
      "正しい",
      "GitHub Actionsを使うには、対象のリポジトリを有料プランに変更しなければならない",
      "GitHub Actionsで実行できるのはテストのみで、ビルドやデプロイには使えない",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "あーもう、サウナ入り直すわ。",
    failureLine: "これだから初心者は。",
    reviewExplanation:
      "この発言は正しいです。GitHub Actionsは、push、プルリクエストの作成・更新、スケジュール実行など、さまざまなイベントをトリガーにワークフローを自動実行できる仕組みです。テストの自動実行だけでなく、ビルドやデプロイまで含めた一連の作業を自動化することもできます。パブリックリポジトリであれば無料プランでも一定の範囲で利用可能で、Issue作成時にしか動かないという制限もありません。",
    sourceMemo: "GitHub Docs: Understanding GitHub Actions / Events that trigger workflows",
  },
  {
    id: "gh-021",
    storeId: "github",
    topic: ".gitignore",
    difficulty: "easy",
    fakeMasaoLine:
      "`.gitignore`に書いておけば、すでにGitで管理されている（コミット済みの）ファイルも自動的に無視されるようになるよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "`.gitignore`はまだ一度も追跡されていない（untrackedな）ファイルにしか効果がなく、すでに追跡・コミット済みのファイルには効果がない",
      "`.gitignore`に書いたファイルは、パソコンから物理的に削除される",
      "`.gitignore`はリポジトリ全体を非公開にする設定ファイルである",
    ],
    correctChoice:
      "`.gitignore`はまだ一度も追跡されていない（untrackedな）ファイルにしか効果がなく、すでに追跡・コミット済みのファイルには効果がない",
    isFakeMasaoCorrect: false,
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
    reviewExplanation:
      "`.gitignore`は、まだGitに一度も追跡されていない（untrackedな）ファイルやフォルダを「コミット対象から除外する」ための設定です。すでにコミット済みで追跡されているファイルに後から書き加えても、そのファイル自体の追跡は自動的には止まりません。追跡から外すには`git rm --cached`のようなコマンドで明示的に外す作業が必要です。`.gitignore`はファイルを物理削除したり、リポジトリ全体の公開範囲を変えたりする設定でもありません。",
    sourceMemo: "Git公式ドキュメント: gitignore",
  },
  {
    id: "gh-022",
    storeId: "github",
    topic: ".envと秘密情報の管理",
    difficulty: "normal",
    fakeMasaoLine:
      "うっかりAPIキーを`.env`ファイルごとpushしちゃっても、後で気づいてリポジトリから削除すればもう漏洩の心配はないよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "一度pushしたAPIキーはコミット履歴に残り続け、既に見られたり取得されたりしている可能性があるため、ファイルを削除するだけでは不十分でキー自体を無効化・再発行（ローテーション）する必要がある",
      "GitHubは機密情報が含まれるpushを検知すると、自動的にそのファイルだけを完全にすべての履歴から消してくれる",
      "APIキーをpushしても、リポジトリを削除しない限り誰にも影響はない",
    ],
    correctChoice:
      "一度pushしたAPIキーはコミット履歴に残り続け、既に見られたり取得されたりしている可能性があるため、ファイルを削除するだけでは不十分でキー自体を無効化・再発行（ローテーション）する必要がある",
    isFakeMasaoCorrect: false,
    successLine: "ふん、今のはノーカンな。",
    failureLine: "整いすぎて脳みそ茹だったか？",
    reviewExplanation:
      "一度GitHubにpushされたAPIキーは、後からファイルを削除する新しいコミットを作っても、それより前のコミット履歴には残ったままです。パブリックリポジトリであれば誰かに閲覧・取得された可能性もありますし、ボットが常時スキャンして漏洩したキーを収集しているとも言われています。したがって最も安全な対応は、ファイルを消すことではなく、そのキー自体を無効化して新しいキーに再発行（ローテーション）することです。GitHubには機密情報のpushを検知する仕組み（シークレットスキャン等）はありますが、履歴を自動的に完全消去してくれるわけではありません。",
    sourceMemo:
      "GitHub Docs: Removing sensitive data from a repository / About secret scanning",
  },
  {
    id: "gh-023",
    storeId: "github",
    topic: ".envと秘密情報の管理",
    difficulty: "hard",
    fakeMasaoLine:
      "一度GitHubにpushしちゃったAPIキーは、たとえその後すぐにファイルを削除しても、漏洩したものとして扱ってキー自体を再発行（ローテーション）するべきだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "ファイルさえ削除すれば履歴からも自動的に消えるので、キーの再発行までは不要である",
      "プライベートリポジトリであれば、削除さえすればキーの再発行は不要である",
      "GitHubにpushした情報は非公開設定にしている限り、外部からは絶対に閲覧不可能である",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
    reviewExplanation:
      "この発言は正しいです。Gitではコミット履歴が過去の状態も含めて残り続けるため、後からファイルを1つ削除するコミットを積んでも、それより前のコミットを遡れば元のAPIキーの値を見ることができてしまいます。クローンやフォーク、キャッシュなどを通じて既に第三者の手に渡っている可能性もゼロではないため、実務上は「見られた前提」で対応するのが安全です。プライベートリポジトリであっても、共同作業者の存在や設定変更のリスクがあるため、同様にローテーションが推奨されます。",
    sourceMemo:
      "GitHub Docs: Removing sensitive data from a repository（漏洩時のベストプラクティス）",
  },
  {
    id: "gh-024",
    storeId: "github",
    topic: ".envと秘密情報の管理",
    difficulty: "normal",
    fakeMasaoLine:
      "プライベートリポジトリになら`.env`ファイルをそのままコミットしても、他人に見られる心配は全くないから安心だよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "プライベートリポジトリでも共同作業者の追加、設定変更による公開、フォーク・クローンの持ち出しなどで秘密情報が広がるリスクは残るため、秘密情報はそもそもコミットしないのが基本",
      "プライベートリポジトリは暗号化されているため、`.env`の中身をコミットしても技術的に読み取り不可能になる",
      "プライベートリポジトリに置いたファイルは、GitHub社の従業員であっても閲覧できない",
    ],
    correctChoice:
      "プライベートリポジトリでも共同作業者の追加、設定変更による公開、フォーク・クローンの持ち出しなどで秘密情報が広がるリスクは残るため、秘密情報はそもそもコミットしないのが基本",
    isFakeMasaoCorrect: false,
    successLine: "次はねえぞ、覚えとけよ。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
    reviewExplanation:
      "プライベートリポジトリは第三者から見えにくくはなりますが、絶対安全というわけではありません。共同作業者を追加した場合、その人にも中身が見えますし、うっかり公開設定に変更してしまう事故や、誰かがクローンしたコピーを別の場所に持ち出すことも起こり得ます。そのため業界的なベストプラクティスは「プライベートかどうかにかかわらず秘密情報はそもそもコミットしない」ことであり、`.env`などは`.gitignore`で除外し、環境変数やシークレット管理サービスで管理するのが基本です。リポジトリ自体が自動暗号化されて中身が読めなくなるという仕様もありません。",
    sourceMemo: "GitHub Docs: About repository visibility / セキュリティのベストプラクティス",
  },
  {
    id: "gh-025",
    storeId: "github",
    topic: "「GitHubに置いてある＝動く完成品」ではない",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHubにソースコードが上がっていれば、それはもうちゃんと動作する完成品だと考えていいよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "GitHubにコードが公開されていることと、それが実際に動作する完成したソフトウェアであることは別問題で、開発途中・依存関係未整備・バグありのコードも大量に公開されている",
      "GitHubはコードをアップロードする際に必ず動作確認を行い、動かないコードは公開を拒否する仕組みになっている",
      "GitHubに公開されているコードは、すべてGitHub社の審査担当者によって動作テスト済みである",
    ],
    correctChoice:
      "GitHubにコードが公開されていることと、それが実際に動作する完成したソフトウェアであることは別問題で、開発途中・依存関係未整備・バグありのコードも大量に公開されている",
    isFakeMasaoCorrect: false,
    successLine: "……チッ。まぐれだろ。",
    failureLine: "だから言ったろ、俺は詳しいんだって。",
    reviewExplanation:
      "GitHubは誰でも自由にコードを公開できる場所であり、公開されているというだけではそのコードが完成しているとも、正しく動作するとも限りません。作りかけのまま放置されたプロジェクト、必要なライブラリのインストール手順が書かれていないプロジェクト、特定の環境でしか動かないプロジェクトなどが大量に存在します。GitHubがアップロード時に動作確認や審査を行う仕組みは存在せず、実際に動くかどうかを確かめるには自分で環境を整えて実行してみる必要があります。",
    sourceMemo: "GitHub Docs: About repositories（公開の仕組みに関する一般的理解）",
  },
  {
    id: "gh-026",
    storeId: "github",
    topic: "差分確認（diff）",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHubの差分（diff）画面って、緑色の行が削除された行で、赤色の行が新しく追加された行を表してるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "GitHubのdiff表示では、緑色が追加された行、赤色が削除された行を表しており、発言の色の割り当てが逆になっている",
      "GitHubのdiff表示には色分けの機能自体がなく、変更箇所はすべて同じ色で表示される",
      "GitHubのdiff表示の色は、変更した人のGitHubアイコンの色によって決まる",
    ],
    correctChoice:
      "GitHubのdiff表示では、緑色が追加された行、赤色が削除された行を表しており、発言の色の割り当てが逆になっている",
    isFakeMasaoCorrect: false,
    successLine: "ふん、今のはノーカンな。",
    failureLine: "甘い甘い、100度じゃ足りねえな。",
    reviewExplanation:
      "GitHubのプルリクエストやコミットのdiff（差分）表示では、一般的に緑色の背景が「追加された行」、赤色の背景が「削除された行」を表します。発言では色の意味が逆になっており、初心者が最初によく混同しやすいポイントです。diff表示には明確な色分け機能があり、色は編集者のアイコンとは無関係です。差分を正しく読めるようになると、プルリクエストのレビューで「実際に何が変わったか」を素早く把握できるようになります。",
    sourceMemo: "GitHub Docs: Reviewing proposed changes in a pull request",
  },
  {
    id: "gh-027",
    storeId: "github",
    topic: "コミット履歴",
    difficulty: "normal",
    fakeMasaoLine:
      "GitHubのコミット履歴は、新しくpushするたびにそれまでの履歴が消えて、直近のpush分だけに置き換わっていくんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "コミット履歴は基本的に積み上げ式であり、pushするたびに過去の履歴が消えるのではなく、新しいコミットが追加されて履歴が伸びていく",
      "コミット履歴はGitHub上では見られず、ローカルのパソコンでしか確認できない",
      "コミット履歴は直近5件までしか保存されない仕様になっている",
    ],
    correctChoice:
      "コミット履歴は基本的に積み上げ式であり、pushするたびに過去の履歴が消えるのではなく、新しいコミットが追加されて履歴が伸びていく",
    isFakeMasaoCorrect: false,
    successLine: "へえ、やるじゃん……くやしいけど。",
    failureLine: "残念、サウナ室から出直してこい。",
    reviewExplanation:
      "Gitのコミット履歴は基本的に追記型で、pushするたびに新しいコミットが履歴の末尾に積み重なっていきます。特別な操作（force pushによる履歴の書き換えなど）をしない限り、過去のコミット履歴が勝手に消えることはありません。GitHub上のリポジトリページやコミット一覧からもすべての履歴を辿って確認できるため、ローカルでしか見られないという説明も、件数に上限があるという説明も誤りです。",
    sourceMemo: "GitHub Docs: Viewing a repository's commit history",
  },
  {
    id: "gh-028",
    storeId: "github",
    topic: "ローカルとリモートの違い",
    difficulty: "easy",
    fakeMasaoLine:
      "ローカルリポジトリは自分のパソコンの中にあるGit管理下のプロジェクトのことで、リモートリポジトリはGitHubなど別の場所に置かれているコピーのことだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "ローカルとリモートは常に自動的に同じ内容に同期され続けており、区別する意味がない",
      "正しい",
      "リモートリポジトリという概念は存在せず、GitHub上のものもすべてローカルリポジトリと呼ぶ",
      "ローカルリポジトリはコミットができず、閲覧専用の存在である",
    ],
    correctChoice: "正しい",
    isFakeMasaoCorrect: true,
    successLine: "は？　偶然だし。",
    failureLine: "水風呂入って頭冷やしてこいよ。",
    reviewExplanation:
      "この発言は正しいです。ローカルリポジトリは自分のパソコン上にあるGit管理下のプロジェクトのコピーで、リモートリポジトリはGitHubなどのサーバー上に置かれた同じプロジェクトのコピーです。両者は自動的に常時同期されるわけではなく、pushやpullといった操作を通じて手動でタイミングを合わせて同期させる必要があります。ローカルリポジトリでも通常どおりコミットができるので、閲覧専用という説明も誤りです。",
    sourceMemo: "GitHub Docs: About remote repositories",
  },
  {
    id: "gh-029",
    storeId: "github",
    topic: "ローカルとリモートの違い",
    difficulty: "hard",
    fakeMasaoLine:
      "ローカルでコミットを取り消したり（revertやreset）しても、何もしなくてもリモートのGitHub上の履歴には自動的にその変更が反映されるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "ローカルでの取り消し操作はローカルリポジトリ内で完結しており、リモート側に反映するにはpush（場合によってはforce push）という明示的な操作が必要",
      "ローカルでresetすると、GitHub側のリポジトリが自動的にロックされて誰も操作できなくなる",
      "revertやresetはGitHub上のWeb画面でしか行えず、ローカルのパソコンでは行えない操作である",
    ],
    correctChoice:
      "ローカルでの取り消し操作はローカルリポジトリ内で完結しており、リモート側に反映するにはpush（場合によってはforce push）という明示的な操作が必要",
    isFakeMasaoCorrect: false,
    successLine: "……知ってて当然だろ、調子乗んな。",
    failureLine: "俺に勝つにはまだ10年早いわ。",
    reviewExplanation:
      "revertやresetでローカルのコミット履歴を取り消したり書き換えたりしても、その変更はローカルリポジトリの中だけで完結しており、GitHub上のリモートリポジトリには自動的には反映されません。反映させるにはpush操作が必要で、特にresetのように過去の履歴そのものを書き換えた場合は、通常のpushでは拒否されるため、force push（強制push）という慎重に扱うべき操作が必要になることもあります。revertやresetはローカルのコマンドラインやGitクライアントで行う操作で、GitHubのWeb画面専用の機能ではありません。",
    sourceMemo: "Git公式ドキュメント: git-revert / git-reset",
  },
  {
    id: "gh-030",
    storeId: "github",
    topic: "AIにGitHubリポジトリを読ませるときの注意",
    difficulty: "hard",
    fakeMasaoLine:
      "AIにGitHubのリポジトリを読み込ませて質問すれば、READMEに書いてある通りに実際のコードも完璧に動くかどうかまで保証してくれるんだよ。",
    questionText: "この発言は正しいか？間違っている場合は、最も正確な理由を選べ。",
    choices: [
      "正しい",
      "AIはREADMEやコードの内容を要約・解釈する助けにはなるが、実際にコードを実行して動作を保証するものではなく、READMEと実装のズレやAI自身の誤読・誤解説の可能性も残る",
      "AIにリポジトリを読ませると、AIが自動的に全てのバグを修正してからでないと回答してくれない",
      "AIはGitHubの非公開リポジトリの内容であっても、常に無条件で正確に読み取れることが保証されている",
    ],
    correctChoice:
      "AIはREADMEやコードの内容を要約・解釈する助けにはなるが、実際にコードを実行して動作を保証するものではなく、READMEと実装のズレやAI自身の誤読・誤解説の可能性も残る",
    isFakeMasaoCorrect: false,
    successLine: "うるさいな、次は負けねえから。",
    failureLine: "整いすぎて脳みそ茹だったか？",
    reviewExplanation:
      "AIにリポジトリの内容を読ませて説明してもらうことは、コードの概要をつかむ助けにはなりますが、それは「実際にプログラムを動かして正しく動作することを保証する」ものではありません。READMEの記述が古かったり実装と食い違っていたりするケースもありますし、AI自身がコードを誤って解釈したり、存在しない挙動をもっともらしく説明してしまう（ハルシネーション）可能性もあります。本当に動くかどうかを確認したい場合は、実際に環境を用意してコードを実行し、テストを走らせるといった検証が別途必要です。非公開リポジトリの扱いも、利用しているAIツールの権限設定次第であり、常に無条件で読めるわけでもありません。",
    sourceMemo: "一般的なAIツール利用時の留意事項（README/コード解説の限界に関する知見）",
  },
];
