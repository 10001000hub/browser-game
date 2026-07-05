/**
 * 出題プールのレジストリ（本番用・唯一の登録場所）。
 *
 * stores.js の各店舗が持つ questionPoolId をキーとして、対応する出題データ配列を
 * ここで一元管理する。js/main.js と tests/helpers/pools.js は両方ともこのファイルを
 * 参照するだけで、独自にプールを組み立てない。
 *
 * 新店舗を追加するときは、questions-<storeId>.js を作成した上で、このファイルに
 * import 1行 + questionPools への追加1行、の1箇所だけ登録すればよい
 * （stores.js 側の questionPoolId と一致させること）。
 *
 * @type {Record<string, import('./questions-github.js').GithubQuestion[]>}
 */
import { githubQuestions } from "./questions-github.js";
import { orcaQuestions } from "./questions-orca.js";

export const questionPools = {
  github: githubQuestions,
  orca: orcaQuestions,
};
