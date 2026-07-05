/**
 * 効果音エンジン。
 *
 * Web Audio API のオシレーター合成のみで完結する（外部音源ファイル・CDN 不使用）。
 * AudioContext はシングルトンとして遅延生成し、モバイルの自動再生制限に対応するため
 * 最初のユーザー操作を起点に resume する（{@link unlockAudio}）。
 * ミュート状態は localStorage に永続化する。
 */

const STORAGE_KEY = "oregamasao.muted";

/** @type {AudioContext|null} */
let audioCtx = null;
/** @type {GainNode|null} */
let masterGain = null;
let muted = false;

// 直前のセッションで設定されたミュート状態を復元
try {
  muted = window.localStorage.getItem(STORAGE_KEY) === "1";
} catch (_e) {
  muted = false;
}

/**
 * AudioContext と masterGain を必要に応じて生成して返す。
 * 非対応環境（AudioContext が存在しない）では null を返す。
 * @returns {AudioContext|null}
 */
function ensureContext() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = muted ? 0 : 1;
  masterGain.connect(audioCtx.destination);
  return audioCtx;
}

/**
 * AudioContext を resume する（モバイルの自動再生制限対策）。
 * ユーザー操作（pointerdown / keydown 等）のハンドラ内で一度呼べば以降は解放済みになる。
 */
export function unlockAudio() {
  const ctx = ensureContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

/**
 * 単一トーンをスケジュールする。周波数スイープ・簡易ADSRエンベロープに対応。
 * @param {AudioContext} ctx
 * @param {number} startAt - ctx.currentTime 基準の開始時刻(秒)
 * @param {{type?: OscillatorType, freq: number, endFreq?: number, duration: number, gain?: number, attack?: number, release?: number}} spec
 */
function scheduleTone(ctx, startAt, spec) {
  const {
    type = "sine",
    freq,
    endFreq,
    duration,
    gain = 0.2,
    attack = 0.005,
    release = 0.06,
  } = spec;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  if (endFreq && endFreq !== freq) {
    // exponentialRamp は 0 を扱えないため下限を設ける
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), startAt + duration);
  }

  const holdUntil = startAt + Math.max(attack, duration - release);
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + attack);
  g.gain.setValueAtTime(gain, holdUntil);
  g.gain.linearRampToValueAtTime(0, startAt + duration);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

/**
 * 効果音名 → トーン列（`at` は発音開始のオフセット秒）。
 * @param {string} name
 * @returns {Array<{at: number} & Parameters<typeof scheduleTone>[2]>|null}
 */
function tonesFor(name) {
  switch (name) {
    // 正解: 明るい2音の上昇
    case "correct":
      return [
        { at: 0, type: "triangle", freq: 660, duration: 0.09, gain: 0.22 },
        { at: 0.075, type: "triangle", freq: 988, duration: 0.16, gain: 0.22 },
      ];
    // 不正解: 低く沈むブザー
    case "incorrect":
      return [
        { at: 0, type: "sawtooth", freq: 196, endFreq: 92, duration: 0.24, gain: 0.16 },
      ];
    // 「俺がまさおだ」演出: 重い一撃＋高音のシャキーン
    case "reveal":
      return [
        { at: 0, type: "sine", freq: 130, endFreq: 55, duration: 0.55, gain: 0.3 },
        { at: 0.02, type: "square", freq: 880, endFreq: 1760, duration: 0.28, gain: 0.05 },
      ];
    // BATTLE START: 上昇するファンファーレ
    case "battleStart":
      return [
        { at: 0, type: "square", freq: 523, duration: 0.1, gain: 0.13 },
        { at: 0.12, type: "square", freq: 659, duration: 0.1, gain: 0.13 },
        { at: 0.24, type: "square", freq: 784, duration: 0.1, gain: 0.13 },
        { at: 0.36, type: "square", freq: 1047, duration: 0.3, gain: 0.15 },
      ];
    // 時間切れ: 落下するアラーム
    case "timeout":
      return [
        { at: 0, type: "sawtooth", freq: 440, endFreq: 110, duration: 0.6, gain: 0.2 },
      ];
    // コンティニュー連打: 短い打点
    case "mash":
      return [
        { at: 0, type: "square", freq: 1200, duration: 0.03, gain: 0.1 },
      ];
    // 勝利: 明るいメジャーアルペジオ
    case "win":
      return [
        { at: 0, type: "triangle", freq: 523, duration: 0.12, gain: 0.2 },
        { at: 0.13, type: "triangle", freq: 659, duration: 0.12, gain: 0.2 },
        { at: 0.26, type: "triangle", freq: 784, duration: 0.12, gain: 0.2 },
        { at: 0.39, type: "triangle", freq: 1047, duration: 0.38, gain: 0.22 },
      ];
    // 敗北: 沈んでいくマイナー下降
    case "lose":
      return [
        { at: 0, type: "triangle", freq: 440, duration: 0.2, gain: 0.2 },
        { at: 0.2, type: "triangle", freq: 349, duration: 0.2, gain: 0.2 },
        { at: 0.4, type: "triangle", freq: 262, duration: 0.45, gain: 0.2 },
      ];
    default:
      return null;
  }
}

/**
 * 効果音を再生する。ミュート時・未定義名・非対応環境では何もしない。
 * @param {string} name - correct / incorrect / reveal / battleStart / timeout / mash / win / lose
 */
export function playSfx(name) {
  if (muted) return;
  const specs = tonesFor(name);
  if (!specs) return;
  const ctx = ensureContext();
  if (!ctx) return;
  // ユーザー操作起点で呼ばれる想定だが、念のため suspended なら resume を試みる
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const now = ctx.currentTime;
  for (const spec of specs) {
    scheduleTone(ctx, now + spec.at, spec);
  }
}

/** @returns {boolean} 現在のミュート状態 */
export function isMuted() {
  return muted;
}

/**
 * ミュート状態を設定し、localStorage に永続化する。
 * @param {boolean} value
 * @returns {boolean} 設定後のミュート状態
 */
export function setMuted(value) {
  muted = Boolean(value);
  try {
    window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  } catch (_e) {
    /* localStorage 非対応/拒否時は永続化を諦める */
  }
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : 1;
  }
  return muted;
}

/**
 * ミュートのオン/オフを反転する。
 * @returns {boolean} 反転後のミュート状態
 */
export function toggleMute() {
  return setMuted(!muted);
}
