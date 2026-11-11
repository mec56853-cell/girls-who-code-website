"use strict";

const missions = [
    {
        title: "Open the check-in desk",
        rule: "Open check-in when at least 3 volunteers are ready. Otherwise, keep it closed.",
        hint: "With exactly 3 volunteers, the desk should open. Which comparison includes 3?",
        options: [
            { code: "volunteers > 3", check: ({ volunteers }) => volunteers > 3 },
            { code: "volunteers >= 3", check: ({ volunteers }) => volunteers >= 3 },
            { code: "volunteers === 3", check: ({ volunteers }) => volunteers === 3 },
        ],
        actions: ["openCheckIn", "keepCheckInClosed"],
        outcomes: ["Open check-in", "Keep closed"],
        tests: [
            { label: "2 volunteers", input: { volunteers: 2 }, expected: false },
            { label: "3 volunteers", input: { volunteers: 3 }, expected: true },
            { label: "4 volunteers", input: { volunteers: 4 }, expected: true },
        ],
    },
    {
        title: "Confirm a workshop spot",
        rule: "Confirm a spot only when at least 1 seat is left and a mentor is present. Otherwise, offer the waitlist.",
        hint: "A free seat is only half the rule. Which operator checks that both a seat and a mentor are available?",
        options: [
            { code: "seats >= 1 || mentorPresent", check: ({ seats, mentorPresent }) => seats >= 1 || mentorPresent },
            { code: "seats > 1 && mentorPresent", check: ({ seats, mentorPresent }) => seats > 1 && mentorPresent },
            { code: "seats >= 1 && mentorPresent", check: ({ seats, mentorPresent }) => seats >= 1 && mentorPresent },
        ],
        actions: ["confirmSpot", "offerWaitlist"],
        outcomes: ["Confirm spot", "Offer waitlist"],
        tests: [
            { label: "1 seat, mentor present", input: { seats: 1, mentorPresent: true }, expected: true },
            { label: "2 seats, mentor absent", input: { seats: 2, mentorPresent: false }, expected: false },
            { label: "0 seats, mentor present", input: { seats: 0, mentorPresent: true }, expected: false },
        ],
    },
    {
        title: "Switch to the backup venue",
        rule: "Move indoors if rain is expected or the outdoor space is closed. If neither is true, stay outdoors.",
        hint: "Try a rainy day with the outdoor space still open. One true condition should trigger the backup plan.",
        options: [
            { code: "rainExpected && spaceClosed", check: ({ rainExpected, spaceClosed }) => rainExpected && spaceClosed },
            { code: "rainExpected || spaceClosed", check: ({ rainExpected, spaceClosed }) => rainExpected || spaceClosed },
            { code: "rainExpected", check: ({ rainExpected }) => rainExpected },
        ],
        actions: ["moveIndoors", "stayOutdoors"],
        outcomes: ["Move indoors", "Stay outdoors"],
        tests: [
            { label: "Clear, space open", input: { rainExpected: false, spaceClosed: false }, expected: false },
            { label: "Rain, space open", input: { rainExpected: true, spaceClosed: false }, expected: true },
            { label: "Clear, space closed", input: { rainExpected: false, spaceClosed: true }, expected: true },
            { label: "Rain, space closed", input: { rainExpected: true, spaceClosed: true }, expected: true },
        ],
    },
];

const challenge = document.getElementById("challenge");
const finished = document.getElementById("finished");
const progress = document.getElementById("progress");
const missionTitle = document.getElementById("mission");
const rule = document.getElementById("rule");
const condition = document.getElementById("condition");
const trueAction = document.getElementById("true-action");
const falseAction = document.getElementById("false-action");
const hint = document.getElementById("hint");
const hintText = document.getElementById("hint-text");
const results = document.getElementById("results");
const testRows = document.getElementById("test-rows");
const feedback = document.getElementById("feedback");
const next = document.getElementById("next");

let round = 0;

function clearResults() {
    results.hidden = true;
    next.hidden = true;
    feedback.textContent = "";
}

function showMission() {
    const mission = missions[round];
    progress.textContent = `Round ${round + 1} of ${missions.length}`;
    missionTitle.textContent = mission.title;
    rule.textContent = mission.rule;
    condition.replaceChildren(...mission.options.map(({ code }) => new Option(code)));
    trueAction.textContent = `${mission.actions[0]}();`;
    falseAction.textContent = `${mission.actions[1]}();`;
    hint.open = false;
    hintText.textContent = mission.hint;
    next.textContent = round === missions.length - 1 ? "Finish challenge" : "Next round";
    clearResults();
}

function runTests() {
    const mission = missions[round];
    const { check } = mission.options[condition.selectedIndex];
    const [trueOutcome, falseOutcome] = mission.outcomes;
    let passed = 0;

    testRows.replaceChildren();
    for (const { label, input, expected } of mission.tests) {
        const actual = check(input);
        const matches = actual === expected;
        passed += Number(matches);

        const row = testRows.insertRow();
        const scenario = document.createElement("th");
        scenario.scope = "row";
        scenario.textContent = label;
        row.append(scenario);
        row.insertCell().textContent = expected ? trueOutcome : falseOutcome;
        const output = row.insertCell();
        output.textContent = `${actual ? trueOutcome : falseOutcome} · ${matches ? "Pass" : "Fail"}`;
        output.className = matches ? "result-pass" : "result-retry";
    }

    const allPassed = passed === mission.tests.length;
    results.hidden = false;
    next.hidden = !allPassed;
    feedback.textContent = allPassed
        ? `All ${passed} tests passed!`
        : `${passed} of ${mission.tests.length} tests passed. Find a row marked Fail below. Check what should happen, then choose a different condition and run the tests again.`;
}

condition.addEventListener("change", clearResults);
document.getElementById("run").addEventListener("click", runTests);
next.addEventListener("click", () => {
    round += 1;
    if (round === missions.length) {
        challenge.hidden = true;
        finished.hidden = false;
        document.getElementById("finish-title").focus();
        return;
    }

    showMission();
    missionTitle.focus();
});
document.getElementById("replay").addEventListener("click", () => {
    round = 0;
    finished.hidden = true;
    challenge.hidden = false;
    showMission();
    missionTitle.focus();
});

showMission();
challenge.hidden = false;
