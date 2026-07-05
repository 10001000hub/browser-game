/**
 * innerHTML へ挿入するデータ由来の文字列をエスケープする。
 * 問題データは現状リポジトリ内の静的データだが、将来の外部化・追加投稿に備えた防御。
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
