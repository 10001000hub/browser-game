/**
 * jsdom E2E: 実DOM上で main.js を起動し、画面遷移とゲーム進行を検証する。
 *
 * クイズフロー / コンティニューフロー / タイマー一時停止 の3本柱。
 * フェイククロックで rAF・setTimeout・performance.now() を制御するため実時間に依存しない。
 *
 * jsdom はこのリポジトリの devDependency（`npm install` で導入）。未解決の環境では
 * スイート全体を skip する（README「テスト」節参照）。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { installFakeClock } from "./helpers/fakeClock.js";
import { TEMP_CONFIG } from "../js/data/tempConfig.js";

const require = createRequire(import.meta.url);

/** jsdom を複数戦略で解決する。見つからなければ null（→ スイートを skip）。 */
function loadJSDOM() {
  const candidates = ["jsdom"];
  if (process.env.JSDOM_PATH) candidates.push(process.env.JSDOM_PATH);
  candidates.push("/home/user/.hermes/hermes-agent/node_modules/jsdom");
  for (const spec of candidates) {
    try {
      return require(spec).JSDOM;
    } catch {
      /* 次の候補へ */
    }
  }
  return null;
}

const JSDOM = loadJSDOM();

const indexHtml = readFileSync(
  fileURLToPath(new URL("../index.html", import.meta.url)),
  "utf8",
);
const mainUrl = new URL("../js/main.js", import.meta.url).href;

/** main.js の module-level state をテストごとにリセットするためのキャッシュバスター。 */
let importCounter = 0;

/**
 * 新しい jsdom 環境を立ち上げ、フェイククロックを差し込んで main.js を起動する。
 * @returns {Promise<{ document: Document, window: Window, fake: object, teardown: () => void }>}
 */
async function bootGame() {
  const dom = new JSDOM(indexHtml, { url: "https://example.test/" });
  const { window } = dom;

  // main.js / 各スクリーンが参照する global を jsdom のものに差し替える
  globalThis.window = window;
  globalThis.document = window.document;

  // global参照（timer.js / continueScreen）と window.* 参照（quizScreen / introScreen）の両方を制御
  const fake = installFakeClock([globalThis, window]);

  // 起動（副作用でも initGame は走り得るが、readyState 差異に依存しないよう明示的に呼ぶ）
  const main = await import(`${mainUrl}?boot=${importCounter++}`);
  main.initGame(window.document.getElementById("screen-root"));

  function teardown() {
    fake.uninstall();
    window.close();
    delete globalThis.window;
    delete globalThis.document;
  }

  return { document: window.document, window, fake, teardown };
}

const suiteOptions = {
  skip: JSDOM ? false : "jsdom未検出のためE2Eをスキップ（README「テスト」参照）",
};

// globalThis.window/document を共有するため、3シナリオは1つの test 内で
// `await t.test(...)` により逐次実行する（並行だと bootGame の await 中に
// グローバルを奪い合い、別ドキュメントへ描画されてしまう）。
test("E2E", suiteOptions, async (t) => {
  /** 現在表示中のスクリーン種別（data-screen）。 */
  function currentScreen(document) {
    const el = document.querySelector("[data-screen]");
    return el ? el.dataset.screen : null;
  }

  function click(window, el) {
    el.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  }

  /** タイトル → 店舗選択(github) → 温度選択 → イントロskip → クイズ、まで進める。 */
  function navigateToQuiz(env, tempMode) {
    const { document, window } = env;
    click(window, document.querySelector(".tap-start"));
    click(window, document.querySelector('.shop-card[data-store-id="github"]'));
    // 扉は開扉アニメ用に 220ms の setTimeout 越しに onSelectTemp を呼ぶため、
    // 保留タイマーを1段だけ進める（runAllTimersだとイントロ自動進行まで巻き込む）
    click(window, document.querySelector(`.door[data-temp="${tempMode}"]`));
    env.fake.runPendingTimers();
    click(window, document.querySelector(".dialogue-skip"));
    assert.equal(currentScreen(document), "quiz-battle", "クイズ画面に到達していない");
  }

  /** 表示中の設問に正解する（正解が出るまで有効な選択肢を順にクリック）。 */
  function answerCurrentQuestionCorrectly(env) {
    const { document, window } = env;
    for (let attempt = 0; attempt < 4; attempt++) {
      const section = document.querySelector('[data-screen="quiz-battle"]');
      assert.ok(section, "クイズ画面が存在しない");
      const choices = [...section.querySelectorAll(".choice")].filter(
        (b) => !b.disabled,
      );
      assert.ok(choices.length > 0, "クリック可能な選択肢がない");
      click(window, choices[0]);
      if (section.querySelector(".feedback-toast").classList.contains("is-correct")) {
        return;
      }
    }
    assert.fail("4回試しても正解に到達しなかった");
  }

  await t.test("クイズフロー: 全問正解で勝利画面に到達する", async () => {
    const env = await bootGame();
    try {
      navigateToQuiz(env, "80");
      for (let i = 0; i < 10; i++) {
        assert.equal(currentScreen(env.document), "quiz-battle", `${i + 1}問目が表示されていない`);
        answerCurrentQuestionCorrectly(env);
        env.fake.runAllTimers(); // 正解フィードバック後の自動 advance を進める
      }
      const result = env.document.querySelector('[data-screen="result"]');
      assert.ok(result, "結果画面に到達していない");
      assert.equal(result.dataset.result, "win", "勝利になっていない");
    } finally {
      env.teardown();
    }
  });

  await t.test("コンティニューフロー: 時間切れ→連打成功でクイズに復帰する", async () => {
    const env = await bootGame();
    try {
      navigateToQuiz(env, "80");

      // 持ち時間を超過させて時間切れを発火 → コンティニュー画面へ
      env.fake.clock.now = TEMP_CONFIG["80"].durationMs + 1000;
      env.fake.flushRaf();
      assert.equal(currentScreen(env.document), "continue", "コンティニュー画面に遷移していない");

      // 30回連打して復活
      const mashBtn = env.document.querySelector(".mash-btn");
      for (let i = 0; i < 30; i++) {
        mashBtn.dispatchEvent(
          new env.window.Event("pointerdown", { bubbles: true, cancelable: true }),
        );
      }
      assert.equal(currentScreen(env.document), "quiz-battle", "連打成功後にクイズへ復帰していない");
    } finally {
      env.teardown();
    }
  });

  await t.test("タイマー一時停止: 正解フィードバック表示中は時間切れが発火しない", async () => {
    const env = await bootGame();
    try {
      navigateToQuiz(env, "80");
      answerCurrentQuestionCorrectly(env); // 正解 → タイマー停止・advance保留

      // フィードバック表示中に大幅に時間を進めてフレームを流す
      env.fake.clock.now = TEMP_CONFIG["80"].durationMs * 100;
      env.fake.flushRaf();
      env.fake.flushRaf();

      // タイマーが停止していれば CONTINUE へ遷移しない
      assert.equal(
        currentScreen(env.document),
        "quiz-battle",
        "一時停止が効かずコンティニューへ遷移してしまった",
      );

      // 保留中の advance を進めても引き続きクイズ（次問）に留まる
      env.fake.runAllTimers();
      assert.equal(currentScreen(env.document), "quiz-battle", "次の設問へ進めていない");
    } finally {
      env.teardown();
    }
  });
});
