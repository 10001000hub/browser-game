import { stores } from "./data/stores.js";
import { githubQuestions } from "./data/questions-github.js";
import { TEMP_CONFIG } from "./data/tempConfig.js";
import { shuffleArray, selectTenQuestions, isCorrectChoice } from "./engine/quizPicker.js";
import { createTimer } from "./engine/timer.js";
import { playSfx, unlockAudio, isMuted, toggleMute } from "./engine/sfx.js";
import { getBestRemainingMs, recordClear } from "./engine/records.js";
import * as titleScreen from "./screens/titleScreen.js";
import * as storeSelectScreen from "./screens/storeSelectScreen.js";
import * as tempSelectScreen from "./screens/tempSelectScreen.js";
import * as introScreen from "./screens/introScreen.js";
import * as quizScreen from "./screens/quizScreen.js";
import * as continueScreen from "./screens/continueScreen.js";
import * as resultScreen from "./screens/resultScreen.js";
import * as reviewScreen from "./screens/reviewScreen.js";

/** 店舗IDごとの出題プール。GitHub店のみMVPで実装済み。 */
const questionPools = {
  github: githubQuestions,
};

let screenRoot = null;
let ringEl = null;
let timeEl = null;
let bodyEl = null;
let currentUnmount = null;

/** 現在の耐久リング表示の分母（100%とみなす残り時間）。start/revive時に更新。 */
let segmentDurationMs = 0;

/** @returns {import('./engine/timer.js').TimerController|null} */
function freshState() {
  return {
    phase: "TITLE",
    selectedStore: null,
    tempMode: null,
    quizSet: [],
    currentQuestionIndex: 0,
    currentChoiceOrder: [],
    wrongChoicesThisQuestion: new Set(),
    reviewLog: [],
    revivalUsed: false,
    timerController: null,
    locked: false,
    pausedRemainingMs: 0,
  };
}

let state = freshState();

function mountScreen(mountFn, context) {
  if (currentUnmount) {
    currentUnmount();
    currentUnmount = null;
  }
  if (screenRoot) {
    screenRoot.innerHTML = "";
  }
  const { unmount } = mountFn(screenRoot, context);
  currentUnmount = unmount;
}

function setRingVisible(visible) {
  if (!ringEl || !timeEl) return;
  ringEl.classList.toggle("is-visible", visible);
  timeEl.classList.toggle("is-visible", visible);
}

function updateRingGeometry() {
  if (!ringEl) return;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const sw = 6;
  const d = `M ${W / 2},${sw / 2} H ${W - sw / 2} V ${H - sw / 2} H ${sw / 2} V ${sw / 2} Z`;
  ringEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
  ringEl.querySelectorAll("path").forEach((p) => p.setAttribute("d", d));
}

function updateRingUI(remainingMs) {
  if (!ringEl || !timeEl || !bodyEl) return;
  const pct = segmentDurationMs > 0 ? Math.max(0, Math.min(100, (remainingMs / segmentDurationMs) * 100)) : 0;
  const offset = 100 - pct;
  ringEl.querySelectorAll(".stamina-ring__progress, .stamina-ring__glow").forEach((p) => {
    p.style.strokeDashoffset = String(offset);
  });

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  timeEl.textContent = `${mm}:${String(ss).padStart(2, "0")}`;

  let heat = "normal";
  if (pct <= 9) heat = "critical";
  else if (pct <= 29) heat = "danger";
  else if (pct <= 59) heat = "warm";
  bodyEl.dataset.heat = heat;
}

/* ---------------- 画面遷移 ---------------- */

function goToTitle() {
  state = freshState();
  setRingVisible(false);
  if (bodyEl) bodyEl.dataset.heat = "normal";
  mountScreen(titleScreen.mount, { onStart: goToStoreSelect });
}

function goToStoreSelect() {
  state.phase = "STORE_SELECT";
  mountScreen(storeSelectScreen.mount, {
    stores,
    onSelectStore(storeId) {
      const store = stores.find((s) => s.id === storeId);
      if (!store || store.status !== "available") return;
      state.selectedStore = store;
      goToTempSelect();
    },
    onBack() {
      state.selectedStore = null;
      goToTitle();
    },
  });
}

function goToTempSelect() {
  state.phase = "TEMP_SELECT";
  mountScreen(tempSelectScreen.mount, {
    bestRecords: {
      "80": getBestRemainingMs(state.selectedStore.id, "80"),
      "110": getBestRemainingMs(state.selectedStore.id, "110"),
    },
    onSelectTemp(tempMode) {
      state.tempMode = tempMode;
      goToIntro();
    },
    onBack() {
      state.tempMode = null;
      goToStoreSelect();
    },
  });
}

function goToIntro() {
  state.phase = "INTRO";
  mountScreen(introScreen.mount, {
    selectedStore: state.selectedStore,
    tempMode: state.tempMode,
    onStartQuiz: startQuiz,
  });
}

function startQuiz() {
  const pool = questionPools[state.selectedStore.questionPoolId] || [];
  state.quizSet = selectTenQuestions(pool);
  state.currentQuestionIndex = 0;
  state.reviewLog = new Array(state.quizSet.length).fill(null);
  state.revivalUsed = false;
  state.wrongChoicesThisQuestion = new Set();
  state.currentChoiceOrder = state.quizSet.length
    ? shuffleArray(state.quizSet[0].choices)
    : [];
  state.locked = false;
  state.phase = "QUIZ";

  const config = TEMP_CONFIG[state.tempMode];
  segmentDurationMs = config.durationMs;
  state.timerController = createTimer({
    durationMs: config.durationMs,
    onTick: updateRingUI,
    onExpire: handleTimerExpire,
  });
  setRingVisible(true);
  state.timerController.start();
  mountQuizScreen();
}

function mountQuizScreen() {
  const question = state.quizSet[state.currentQuestionIndex];
  mountScreen(quizScreen.mount, {
    question,
    choiceOrder: state.currentChoiceOrder,
    wrongChoices: state.wrongChoicesThisQuestion,
    questionNumber: state.currentQuestionIndex + 1,
    totalQuestions: state.quizSet.length,
    tempMode: state.tempMode,
    onChoiceClick: handleChoiceClick,
    onAdvance: handleAdvance,
  });
}

/**
 * 4章・5章の判定ロジック本体。画面(quizScreen)からの唯一の入口。
 * @param {string} text
 */
function handleChoiceClick(text) {
  if (state.locked) return { ignored: true };
  if (state.phase !== "QUIZ") return { ignored: true }; // エッジケース#2
  if (state.wrongChoicesThisQuestion.has(text)) return { ignored: true }; // エッジケース#6

  const question = state.quizSet[state.currentQuestionIndex];
  const correct = isCorrectChoice(question, text);
  const isFirstAttempt =
    state.wrongChoicesThisQuestion.size === 0 && !state.reviewLog[state.currentQuestionIndex];

  if (isFirstAttempt) {
    state.reviewLog[state.currentQuestionIndex] = {
      index: state.currentQuestionIndex + 1,
      statement: question.fakeMasaoLine,
      firstAnswer: text,
      correctAnswer: question.correctChoice,
      isFirstAnswerCorrect: correct,
      explanation: question.reviewExplanation,
      topic: question.topic,
      sourceMemo: question.sourceMemo,
    };
  }

  if (correct) {
    state.locked = true; // エッジケース#1・#3: 正解確定時点で二重発火をロック
    const isLastQuestion = state.currentQuestionIndex === state.quizSet.length - 1;
    // 正解確定済みの問題のフィードバック表示中に時間切れが発火すると、
    // 正解が没収されてCONTINUE/敗北へ遷移してしまうため、タイマーを一時停止する
    // （次の問題へ進むときに handleAdvance で残り時間から再開する）
    state.pausedRemainingMs = state.timerController.getRemainingMs();
    state.timerController.stop();
    playSfx("correct");
    return { correct: true, line: question.successLine, isLastQuestion };
  }

  state.wrongChoicesThisQuestion.add(text);
  state.timerController.applyPenalty(TEMP_CONFIG[state.tempMode].penaltyMs);
  playSfx("incorrect");
  return { correct: false, line: question.failureLine };
}

/** 正解フィードバック表示後、quizScreenから呼ばれる */
function handleAdvance() {
  const wasLast = state.currentQuestionIndex === state.quizSet.length - 1;
  if (wasLast) {
    goToResult(true);
    return;
  }
  state.currentQuestionIndex += 1;
  state.wrongChoicesThisQuestion = new Set();
  state.currentChoiceOrder = shuffleArray(state.quizSet[state.currentQuestionIndex].choices);
  state.locked = false;
  state.timerController.revive(state.pausedRemainingMs); // 正解時に一時停止したタイマーを残り時間から再開
  mountQuizScreen();
}

function handleTimerExpire() {
  if (state.phase !== "QUIZ") return;
  playSfx("timeout");
  if (!state.revivalUsed) {
    goToContinue();
  } else {
    goToResult(false);
  }
}

function goToContinue() {
  state.phase = "CONTINUE";
  state.revivalUsed = true; // 7.2: 突入した時点で使用済み扱い（成功・失敗問わず）
  mountScreen(continueScreen.mount, {
    onSuccess: continueSuccess,
    onFail: () => goToResult(false),
  });
}

function continueSuccess() {
  const config = TEMP_CONFIG[state.tempMode];
  segmentDurationMs = config.revivalMs;
  state.timerController.revive(config.revivalMs);
  state.phase = "QUIZ";
  state.locked = false;
  mountQuizScreen();
}

function goToResult(didWin) {
  state.phase = "RESULT";
  if (state.timerController) state.timerController.stop();
  setRingVisible(false);
  // 整い場（リザルト・振り返り）では耐久リングと熱演出（外周のシェイク/明滅=タイムの枠）を消す
  if (bodyEl) bodyEl.dataset.heat = "normal";
  playSfx(didWin ? "win" : "lose");

  // クリア時のみ、残り時間を店舗×温度のベスト記録として保存する。
  // state.pausedRemainingMs は最終問題を正解した瞬間の残り時間（handleChoiceClickで確定）。
  let recordResult = null;
  if (didWin && state.selectedStore && state.tempMode) {
    recordResult = recordClear(state.selectedStore.id, state.tempMode, state.pausedRemainingMs);
  }

  mountScreen(resultScreen.mount, {
    didWin,
    reviewLog: state.reviewLog,
    tempMode: state.tempMode,
    clearRemainingMs: didWin ? state.pausedRemainingMs : null,
    recordResult,
    onGoToReview: goToReview,
  });
}

function goToReview() {
  state.phase = "REVIEW";
  mountScreen(reviewScreen.mount, {
    reviewLog: state.reviewLog,
    onReturnToTitle: goToTitle,
  });
}

/**
 * ゲーム初期化。DOM要素の取得とTITLE画面の初回マウントを行う。
 * @param {HTMLElement} rootElement - #screen-root
 */
export function initGame(rootElement) {
  screenRoot = rootElement;
  ringEl = document.getElementById("stamina-ring");
  timeEl = document.getElementById("stamina-time");
  bodyEl = document.body;

  updateRingGeometry();
  window.addEventListener("resize", updateRingGeometry);
  window.addEventListener("orientationchange", updateRingGeometry);

  setupAudioUnlock();
  setupMuteToggle();

  goToTitle();
}

/**
 * モバイルの自動再生制限対策。最初のユーザー操作でAudioContextをresumeする。
 * once相当（解放後は自身でリスナーを外す）。
 */
function setupAudioUnlock() {
  const unlock = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  window.addEventListener("touchstart", unlock);
}

/** ミュート切り替えボタンの初期表示と操作を配線する。 */
function setupMuteToggle() {
  const btn = document.getElementById("mute-toggle");
  if (!btn) return;
  const iconEl = btn.querySelector(".mute-toggle__icon");
  const render = () => {
    const m = isMuted();
    btn.setAttribute("aria-pressed", String(m));
    btn.setAttribute("aria-label", m ? "効果音をオンにする" : "効果音をオフにする");
    if (iconEl) iconEl.textContent = m ? "🔇" : "🔊";
  };
  render();
  btn.addEventListener("click", () => {
    toggleMute();
    render();
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initGame(document.getElementById("screen-root"));
    });
  } else {
    initGame(document.getElementById("screen-root"));
  }
}
