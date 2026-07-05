/**
 * 温度モード別の設定（持ち時間・誤答ペナルティ・コンティニュー復活後の残り時間）。
 * マジックナンバー散在防止のため、この一箇所にまとめる。
 */
export const TEMP_CONFIG = {
  "80": { durationMs: 300_000, penaltyMs: 20_000, revivalMs: 60_000 },
  "110": { durationMs: 60_000, penaltyMs: 7_000, revivalMs: 15_000 },
};
