const assert = require("node:assert/strict");
const test = require("node:test");

const { CORRECT, gradeSpotlight } = require("../static/senior-game/game.js");

test("the three correct lines publish the Senior Spotlight", () => {
  const result = gradeSpotlight(CORRECT);

  assert.equal(result.passed, true);
  assert.equal(result.preview.message, "Jordan presents River Cleanup App");
  assert.equal(result.preview.badge, "Senior Spotlight");
  assert.deepEqual(
    result.rows.map((row) => row.actual),
    [
      "Jordan presents River Cleanup App",
      "Not yet",
      "Ready",
      "Ready",
      "Senior Spotlight",
    ],
  );
});

test("more than 10 misses a project with exactly 10 hours", () => {
  const result = gradeSpotlight({ ...CORRECT, ready: "over-10" });
  const tenHours = result.rows.find((row) => row.scenario === "10 service hours");

  assert.equal(result.passed, false);
  assert.equal(tenHours.actual, "Not yet");
  assert.equal(tenHours.passed, false);
});

test("joining the name and project without a space fails the sentence", () => {
  const result = gradeSpotlight({ ...CORRECT, message: "jammed" });

  assert.equal(result.preview.message, "JordanRiver Cleanup App");
  assert.equal(result.rows[0].passed, false);
});

test("using the hour count as the badge fails the spotlight label", () => {
  const result = gradeSpotlight({ ...CORRECT, badge: "hours" });

  assert.equal(result.preview.badge, "15");
  assert.equal(result.passed, false);
});

test("blank lines stay unfinished", () => {
  const result = gradeSpotlight({ message: "", ready: "", badge: "" });

  assert.equal(result.passed, false);
  assert.ok(result.rows.every((row) => row.actual === "Choose a line"));
});
