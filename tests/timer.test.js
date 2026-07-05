/**
 * timer 単体テスト。フェイククロックで performance.now()/rAF を制御し、
 * 実時間に依存せず決定論的に検証する。
 */
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { createTimer } from "../js/engine/timer.js";
import { installFakeClock } from "./helpers/fakeClock.js";

let fake;

beforeEach(() => {
  fake = installFakeClock();
});
afterEach(() => {
  fake.uninstall();
});

test("start 直後は残り時間 = durationMs", () => {
  const timer = createTimer({ durationMs: 5000, onTick() {}, onExpire() {} });
  timer.start();
  assert.equal(timer.getRemainingMs(), 5000);
});

test("時間経過に応じて残り時間が減り、onTick に渡る", () => {
  const ticks = [];
  const timer = createTimer({
    durationMs: 5000,
    onTick: (r) => ticks.push(r),
    onExpire() {},
  });
  timer.start(); // 同期的に onTick(5000)
  assert.equal(ticks.at(-1), 5000);

  fake.clock.now = 2000;
  fake.flushRaf();
  assert.equal(timer.getRemainingMs(), 3000);
  assert.equal(ticks.at(-1), 3000);
});

test("残り0で onExpire が一度だけ発火し、以降フレームを止める", () => {
  let expireCount = 0;
  const timer = createTimer({
    durationMs: 1000,
    onTick() {},
    onExpire: () => expireCount++,
  });
  timer.start();

  fake.clock.now = 1500; // 期限超過
  fake.flushRaf();
  assert.equal(expireCount, 1);
  assert.equal(timer.getRemainingMs(), 0);

  // 追加でフレームを流しても再発火しない
  fake.clock.now = 3000;
  fake.flushRaf();
  fake.flushRaf();
  assert.equal(expireCount, 1);
});

test("applyPenalty は残り時間を即座に減らす", () => {
  const timer = createTimer({ durationMs: 10_000, onTick() {}, onExpire() {} });
  timer.start();
  timer.applyPenalty(3000);
  assert.equal(timer.getRemainingMs(), 7000);
});

test("stop 後はフレームを流しても onTick が呼ばれない", () => {
  let tickCount = 0;
  const timer = createTimer({
    durationMs: 5000,
    onTick: () => tickCount++,
    onExpire() {},
  });
  timer.start();
  const countAfterStart = tickCount;
  timer.stop();

  fake.clock.now = 2000;
  fake.flushRaf();
  assert.equal(tickCount, countAfterStart, "stop 後に onTick が発火した");
});

test("revive: 停止中のタイマーを新しい残り時間で再開する", () => {
  let expired = false;
  const timer = createTimer({
    durationMs: 5000,
    onTick() {},
    onExpire: () => {
      expired = true;
    },
  });
  timer.start();
  fake.clock.now = 5000;
  fake.flushRaf();
  assert.equal(expired, true, "前提: 一度期限切れ");

  expired = false;
  timer.revive(3000);
  assert.equal(timer.getRemainingMs(), 3000);

  fake.clock.now = 8000; // 復活後3000msちょうど経過
  fake.flushRaf();
  assert.equal(expired, true, "復活後に再度期限切れするはず");
});

test("revive: 0以下を渡しても最低1msにクランプされる", () => {
  const timer = createTimer({ durationMs: 5000, onTick() {}, onExpire() {} });
  timer.start();
  timer.stop();
  timer.revive(0);
  assert.equal(timer.getRemainingMs(), 1);
});
