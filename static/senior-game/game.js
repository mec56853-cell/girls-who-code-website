(function () {
  const SPOTLIGHT = {
    name: "Jordan",
    project: "River Cleanup App",
    serviceHours: 15,
  };

  const MESSAGE_OPTIONS = [
    {
      id: "presents",
      code: 'name + " presents " + project',
      build(name, project) {
        return `${name} presents ${project}`;
      },
    },
    {
      id: "jammed",
      code: "name + project",
      build(name, project) {
        return `${name}${project}`;
      },
    },
    {
      id: "word-only",
      code: '"presents"',
      build() {
        return "presents";
      },
    },
  ];

  const READY_OPTIONS = [
    {
      id: "at-least-10",
      code: "serviceHours >= 10",
      check(hours) {
        return hours >= 10;
      },
    },
    {
      id: "over-10",
      code: "serviceHours > 10",
      check(hours) {
        return hours > 10;
      },
    },
    {
      id: "under-10",
      code: "serviceHours < 10",
      check(hours) {
        return hours < 10;
      },
    },
  ];

  const BADGE_OPTIONS = [
    { id: "spotlight", code: '"Senior Spotlight"', label: "Senior Spotlight" },
    { id: "coming-soon", code: '"Coming soon"', label: "Coming soon" },
    { id: "hours", code: "serviceHours", label: null },
  ];

  const CORRECT = {
    message: "presents",
    ready: "at-least-10",
    badge: "spotlight",
  };

  const READY_CASES = [
    { hours: 9, expected: false },
    { hours: 10, expected: true },
    { hours: 15, expected: true },
  ];

  function findById(options, id) {
    return options.find((option) => option.id === id) || null;
  }

  function badgeText(option, hours, ready) {
    if (!option) {
      return "Choose a line";
    }
    if (!ready) {
      return "In progress";
    }
    if (option.label == null) {
      return String(hours);
    }
    return option.label;
  }

  function gradeSpotlight(choices) {
    const message = findById(MESSAGE_OPTIONS, choices.message);
    const ready = findById(READY_OPTIONS, choices.ready);
    const badge = findById(BADGE_OPTIONS, choices.badge);
    const sampleReady = ready ? ready.check(SPOTLIGHT.serviceHours) : false;

    const rows = [
      {
        scenario: "Build the sentence",
        expected: `${SPOTLIGHT.name} presents ${SPOTLIGHT.project}`,
        actual: message
          ? message.build(SPOTLIGHT.name, SPOTLIGHT.project)
          : "Choose a line",
      },
      ...READY_CASES.map((item) => ({
        scenario: `${item.hours} service hours`,
        expected: item.expected ? "Ready" : "Not yet",
        actual: ready ? (ready.check(item.hours) ? "Ready" : "Not yet") : "Choose a line",
      })),
      {
        scenario: "Badge at 15 hours",
        expected: "Senior Spotlight",
        actual: badgeText(badge, SPOTLIGHT.serviceHours, sampleReady),
      },
    ];

    const graded = rows.map((row) => ({
      ...row,
      passed: row.actual === row.expected,
    }));

    return {
      passed: graded.every((row) => row.passed),
      rows: graded,
      preview: {
        message: message
          ? message.build(SPOTLIGHT.name, SPOTLIGHT.project)
          : "Choose a sentence",
        badge: badgeText(badge, SPOTLIGHT.serviceHours, sampleReady),
        hours: SPOTLIGHT.serviceHours,
      },
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      SPOTLIGHT,
      MESSAGE_OPTIONS,
      READY_OPTIONS,
      BADGE_OPTIONS,
      CORRECT,
      gradeSpotlight,
    };
  }

  if (typeof document === "undefined") {
    return;
  }

  const challenge = document.getElementById("challenge");
  const finished = document.getElementById("finished");
  const messageSelect = document.getElementById("message");
  const readySelect = document.getElementById("ready");
  const badgeSelect = document.getElementById("badge");
  const runButton = document.getElementById("run");
  const replayButton = document.getElementById("replay");
  const feedback = document.getElementById("feedback");
  const preview = document.getElementById("preview");
  const previewMessage = document.getElementById("preview-message");
  const previewBadge = document.getElementById("preview-badge");
  const previewHours = document.getElementById("preview-hours");
  const results = document.getElementById("results");
  const testRows = document.getElementById("test-rows");
  const finishTitle = document.getElementById("finish-title");

  function fillSelect(select, options) {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a line";
    select.append(placeholder);
    options.forEach((option) => {
      const node = document.createElement("option");
      node.value = option.id;
      node.textContent = option.code;
      select.append(node);
    });
  }

  function resetActivity() {
    messageSelect.value = "";
    readySelect.value = "";
    badgeSelect.value = "";
    feedback.textContent = "";
    preview.hidden = true;
    results.hidden = true;
    testRows.replaceChildren();
    finished.hidden = true;
    challenge.hidden = false;
    messageSelect.focus();
  }

  function renderResult(result) {
    preview.hidden = false;
    previewMessage.textContent = result.preview.message;
    previewBadge.textContent = result.preview.badge;
    previewHours.textContent = `${result.preview.hours} service hours`;
    results.hidden = false;
    testRows.replaceChildren();

    result.rows.forEach((row) => {
      const tr = document.createElement("tr");
      [row.scenario, row.expected, row.actual].forEach((value, index) => {
        const cell = document.createElement(index === 0 ? "th" : "td");
        if (index === 0) {
          cell.scope = "row";
        }
        cell.textContent = value;
        if (index === 2) {
          cell.className = row.passed ? "result-pass" : "result-retry";
        }
        tr.append(cell);
      });
      testRows.append(tr);
    });

    if (result.passed) {
      feedback.textContent = "All three lines work. Publishing the spotlight.";
      challenge.hidden = true;
      finished.hidden = false;
      finishTitle.focus();
      return;
    }

    feedback.textContent =
      "A line still needs a change. Compare Expected with Your code, then run it again.";
  }

  fillSelect(messageSelect, MESSAGE_OPTIONS);
  fillSelect(readySelect, READY_OPTIONS);
  fillSelect(badgeSelect, BADGE_OPTIONS);
  challenge.hidden = false;

  runButton.addEventListener("click", () => {
    renderResult(
      gradeSpotlight({
        message: messageSelect.value,
        ready: readySelect.value,
        badge: badgeSelect.value,
      }),
    );
  });

  replayButton.addEventListener("click", resetActivity);
})();
