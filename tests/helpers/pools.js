/**
 * 出題プールのレジストリ（テスト用）。
 *
 * js/main.js の `questionPools` を鏡写しにしたもの。新店舗の問題プールを追加したら、
 * ここに import 1行 + エントリ1行を足すだけで、data.test.js の検証対象に自動で含まれる
 * （新店舗追加時の回帰テスト）。main.js 側の questionPools への追加も忘れないこと。
 *
 * @type {Record<string, import('../../js/data/questions-github.js').GithubQuestion[]>}
 */
import { githubQuestions } from "../../js/data/questions-github.js";

export const questionPools = {
  github: githubQuestions,
};
