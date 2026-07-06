/**
 * イントロ会話スクリプト検証。全店舗×両温度をパラメータ化して構造を回帰的に検証する。
 * js/data/introScripts.js に店舗専用スクリプトを追加すると自動で検証対象になる。
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { stores } from "../js/data/stores.js";
import { getIntroSteps, scriptsByStoreId } from "../js/data/introScripts.js";

const DIALOGUE_TYPES = new Set(["narration", "masao", "fake"]);
const TEMP_MODES = ["80", "110"];

test("全店舗×両温度でイントロスクリプトが構造制約を満たす", () => {
  for (const store of stores) {
    for (const tempMode of TEMP_MODES) {
      const label = `店舗「${store.displayName}」temp=${tempMode}`;
      const steps = getIntroSteps(store, tempMode);

      assert.ok(Array.isArray(steps) && steps.length > 0, `${label}: ステップが空`);
      assert.equal(
        steps[steps.length - 1].type,
        "battle-start",
        `${label}: 最終ステップが battle-start でない (onStartQuiz に到達できない)`,
      );
      assert.equal(
        steps.filter((s) => s.type === "reveal").length,
        1,
        `${label}: reveal 演出はちょうど1回必要`,
      );
      assert.equal(
        steps.filter((s) => s.type === "battle-start").length,
        1,
        `${label}: battle-start はちょうど1回必要`,
      );

      for (const [i, step] of steps.entries()) {
        if (step.type === "reveal" || step.type === "battle-start") continue;
        assert.ok(DIALOGUE_TYPES.has(step.type), `${label}: steps[${i}] の type が不正 (${step.type})`);
        assert.ok(
          typeof step.text === "string" && step.text.length > 0,
          `${label}: steps[${i}] (${step.type}) の text が空`,
        );
      }

      const allText = steps.map((s) => s.text || "").join("");
      assert.ok(allText.includes(store.displayName), `${label}: 店舗名が会話に埋め込まれていない`);
      assert.ok(allText.includes(`${tempMode}℃`), `${label}: 選択温度が会話に埋め込まれていない`);
    }
  }
});

test("店舗専用スクリプトの店舗IDは stores.js に実在する", () => {
  const storeIds = new Set(stores.map((s) => s.id));
  for (const id of Object.keys(scriptsByStoreId)) {
    assert.ok(storeIds.has(id), `introScripts の店舗ID「${id}」が stores.js に存在しない`);
  }
});

test("Orca店は専用スクリプトで、デフォルト店舗と会話内容が異なる", () => {
  const orca = stores.find((s) => s.id === "orca");
  const github = stores.find((s) => s.id === "github");
  const orcaTexts = getIntroSteps(orca, "80").map((s) => s.text || s.type);
  const githubTexts = getIntroSteps(github, "80").map((s) => s.text || s.type);
  assert.notDeepEqual(orcaTexts, githubTexts, "Orca店の専用スクリプトが配線されていない");
});

test("店舗未選択でもデフォルトスクリプトにフォールバックする", () => {
  const steps = getIntroSteps(null, undefined);
  assert.ok(Array.isArray(steps) && steps.length > 0);
  assert.equal(steps[steps.length - 1].type, "battle-start");
});
