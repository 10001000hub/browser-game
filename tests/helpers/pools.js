/**
 * 出題プールのレジストリ（テスト用）。
 *
 * js/data/questionPools.js を再エクスポートしているだけで、独自のプールは持たない。
 * これにより、テストは常に本番と同一のレジストリを検証している（main.js が実際に
 * 読み込むオブジェクトそのものが対象）。新店舗の問題プールを追加する際は
 * js/data/questionPools.js に1箇所だけ登録すれば、data.test.js の検証対象にも
 * 自動で含まれる。
 *
 * @type {Record<string, import('../../js/data/questions-github.js').GithubQuestion[]>}
 */
export { questionPools } from "../../js/data/questionPools.js";
