/**
 * 決定論的なフェイククロック。
 *
 * timer.js / 各スクリーンが参照する `performance.now()`・`requestAnimationFrame`・
 * `setTimeout` をテスト側で完全に制御するためのユーティリティ。実時間に依存せず、
 * clock.now を進めて flushRaf()/runAllTimers() を呼ぶことでフレーム・タイマーを進める。
 *
 * @param {object[]} [targets] - フェイクを差し込む対象（既定は globalThis のみ）。
 *   jsdom E2E では [globalThis, dom.window] を渡し、global参照と window.* 参照の
 *   両方を差し替える。
 * @returns {{
 *   clock: { now: number },
 *   flushRaf: () => void,
 *   runAllTimers: () => void,
 *   uninstall: () => void,
 * }}
 */
export function installFakeClock(targets = [globalThis]) {
  const clock = { now: 0 };

  let rafSeq = 0;
  const rafCbs = new Map();
  let toSeq = 0;
  const timeouts = new Map();

  const fakePerformance = { now: () => clock.now };
  const requestAnimationFrame = (cb) => {
    const id = ++rafSeq;
    rafCbs.set(id, cb);
    return id;
  };
  const cancelAnimationFrame = (id) => {
    rafCbs.delete(id);
  };
  const setTimeout = (cb, _delay, ...args) => {
    const id = ++toSeq;
    timeouts.set(id, () => cb(...args));
    return id;
  };
  const clearTimeout = (id) => {
    timeouts.delete(id);
  };

  const saved = targets.map((t) => ({
    t,
    performance: Object.getOwnPropertyDescriptor(t, "performance"),
    requestAnimationFrame: t.requestAnimationFrame,
    cancelAnimationFrame: t.cancelAnimationFrame,
    setTimeout: t.setTimeout,
    clearTimeout: t.clearTimeout,
  }));

  for (const t of targets) {
    try {
      Object.defineProperty(t, "performance", {
        value: fakePerformance,
        configurable: true,
        writable: true,
      });
    } catch {
      t.performance = fakePerformance;
    }
    t.requestAnimationFrame = requestAnimationFrame;
    t.cancelAnimationFrame = cancelAnimationFrame;
    t.setTimeout = setTimeout;
    t.clearTimeout = clearTimeout;
  }

  /** 現在キューされている rAF コールバックを一括実行する（実行中の再スケジュール分は次回へ）。 */
  function flushRaf() {
    const snapshot = [...rafCbs.entries()];
    rafCbs.clear();
    for (const [, cb] of snapshot) cb();
  }

  /** 遅延に関わらずキュー済みタイマーを空になるまで実行する。 */
  function runAllTimers() {
    let guard = 0;
    while (timeouts.size && guard++ < 10_000) {
      const [id, fn] = timeouts.entries().next().value;
      timeouts.delete(id);
      fn();
    }
  }

  function uninstall() {
    for (const s of saved) {
      if (s.performance) {
        Object.defineProperty(s.t, "performance", s.performance);
      }
      s.t.requestAnimationFrame = s.requestAnimationFrame;
      s.t.cancelAnimationFrame = s.cancelAnimationFrame;
      s.t.setTimeout = s.setTimeout;
      s.t.clearTimeout = s.clearTimeout;
    }
  }

  return { clock, flushRaf, runAllTimers, uninstall };
}
