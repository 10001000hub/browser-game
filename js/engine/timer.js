/**
 * 耐久タイマー（performance.now()ベース、累積誤差なし）。
 * DOM非依存（Node環境でも import 可能。requestAnimationFrame は start() 呼び出し時にのみ参照する）。
 */

/**
 * @param {{ durationMs: number, onTick: (remainingMs:number)=>void, onExpire: ()=>void }} config
 * @returns {TimerController}
 */
export function createTimer({ durationMs, onTick, onExpire }) {
  let endTimestamp = 0;
  let running = false;
  let rafId = null;

  function loop() {
    if (!running) return;
    const remaining = Math.max(0, endTimestamp - performance.now());
    onTick(remaining);
    if (remaining <= 0) {
      running = false;
      onExpire();
      return; // 次フレームはスケジュールしない
    }
    rafId = requestAnimationFrame(loop);
  }

  return {
    start() {
      endTimestamp = performance.now() + durationMs;
      running = true;
      loop();
    },
    stop() {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    applyPenalty(penaltyMs) {
      endTimestamp -= penaltyMs;
    },
    revive(newDurationMs) {
      const safeDuration = Math.max(1, newDurationMs);
      endTimestamp = performance.now() + safeDuration;
      if (!running) {
        running = true;
        loop();
      }
    },
    getRemainingMs() {
      return Math.max(0, endTimestamp - performance.now());
    },
  };
}

/**
 * @typedef {object} TimerController
 * @property {() => void} start
 * @property {() => void} stop
 * @property {(penaltyMs: number) => void} applyPenalty
 * @property {(newDurationMs: number) => void} revive
 * @property {() => number} getRemainingMs
 */
