/**
 * 問題パックを短く書くためのヘルパー。
 *
 * 各問題は「ゴウの発言（line）」「4択（choices）」「正解の位置（answer）」「解説（explain）」
 * 「出典（source）」だけを書けばよい。設問文・正誤フラグ・台詞は共通の値で補う。
 * 出力は questions-github.js と同じ形（Question）なので、ゲーム本体とテストは区別しない。
 *
 * 問題を追加するときは配列の末尾に足し、既存の id は変えない（出題ローテーションが id で記録するため）。
 *
 * @typedef {Object} QuestionInput
 * @property {string} id
 * @property {string} topic
 * @property {"easy"|"normal"|"hard"} difficulty
 * @property {string} line        - ゴウの発言
 * @property {string[]} choices   - 4択。どれか1つは必ず "正しい"
 * @property {number} answer      - 正解の choices 上の位置（0〜3）
 * @property {string} explain     - 解説
 * @property {string} source      - 出典（公式ドキュメントの名前とURL）
 * @property {string} [successLine]
 * @property {string} [failureLine]
 */

export const QUESTION_TEXT = "この発言は正しいか？ 間違っているなら、どこが違うかを選べ。";

const SUCCESS_LINES = [
  "……チッ。ウラを取られたか。",
  "ほう、ちゃんと調べてるじゃねえか。",
  "熱波が効かねえ……だと？",
  "今のは小手調べだ。次はこうはいかねえ。",
  "くっ、ソースを出されちゃ黙るしかねえ。",
];

const FAILURE_LINES = [
  "ほら見ろ、雰囲気で答えるからだ。",
  "汗だけかいて中身はスカスカだな。",
  "それっぽい話に弱いねえ、キミ。",
  "ウラ取りはどうした？",
  "オレの熱波にやられたな。",
];

/**
 * @param {string} storeId
 * @param {QuestionInput[]} inputs
 */
export function defineQuestions(storeId, inputs) {
  return inputs.map((q, i) => {
    const correctChoice = q.choices[q.answer];
    return {
      id: q.id,
      storeId,
      topic: q.topic,
      difficulty: q.difficulty,
      rivalLine: q.line,
      questionText: QUESTION_TEXT,
      choices: q.choices,
      correctChoice,
      isRivalCorrect: correctChoice === "正しい",
      successLine: q.successLine || SUCCESS_LINES[i % SUCCESS_LINES.length],
      failureLine: q.failureLine || FAILURE_LINES[i % FAILURE_LINES.length],
      reviewExplanation: q.explain,
      sourceMemo: q.source,
    };
  });
}
