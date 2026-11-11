(() => {
  const WIDTH = 8;
  const HEIGHT = 6;
  const ROUTES = [
    {
      category: "Camping",
      name: "Pinecone Camp",
      theme: "camping",
      description: "Weave around campfires and fallen trees to reach the cozy cabin.",
      obstacleIcons: ["campfire", "log"],
      obstacleNames: ["a campfire", "a fallen tree"],
      goalIcon: "cabin",
      goalLabel: "cabin",
      start: { x: 1, y: 6 },
      goal: { x: 8, y: 1 },
      obstacles: [
        { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 1, y: 4 }, { x: 3, y: 5 },
        { x: 4, y: 5 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
        { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 4, y: 1 },
      ],
    },
    {
      category: "Hiking",
      name: "Ridge Hike",
      theme: "hiking",
      description: "Climb around boulders and fallen trees to earn the hiking badge.",
      obstacleIcons: ["boulder", "log"],
      obstacleNames: ["a boulder", "a fallen tree"],
      goalIcon: "badge",
      goalLabel: "hiking badge",
      start: { x: 8, y: 6 },
      goal: { x: 1, y: 1 },
      obstacles: [
        { x: 7, y: 6 }, { x: 8, y: 4 }, { x: 6, y: 5 }, { x: 5, y: 5 },
        { x: 6, y: 3 }, { x: 5, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 2 },
        { x: 2, y: 2 }, { x: 5, y: 1 },
      ],
    },
    {
      category: "Wildlife",
      name: "Wildlife Watch",
      theme: "wildlife",
      description: "Pass the ponds and berry bushes without disturbing the wildlife lookout.",
      obstacleIcons: ["pond", "bush"],
      obstacleNames: ["a pond", "a berry bush"],
      goalIcon: "lookout",
      goalLabel: "wildlife lookout",
      start: { x: 1, y: 1 },
      goal: { x: 8, y: 6 },
      obstacles: [
        { x: 3, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
        { x: 5, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 8, y: 4 },
      ],
    },
    {
      category: "Troop adventure",
      name: "Troop Trail",
      theme: "troop",
      description: "Navigate around tents and trail signs to reach the troop badge.",
      obstacleIcons: ["tent", "sign"],
      obstacleNames: ["a tent", "a trail sign"],
      goalIcon: "troopBadge",
      goalLabel: "troop badge",
      start: { x: 8, y: 1 },
      goal: { x: 1, y: 6 },
      obstacles: [
        { x: 7, y: 1 }, { x: 8, y: 3 }, { x: 6, y: 2 }, { x: 5, y: 2 },
        { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 5 },
        { x: 2, y: 5 }, { x: 2, y: 6 },
      ],
    },
  ];
  const ICONS = {
    scout: `<svg class="trail-icon scout-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path fill="#4b2e25" d="M18 22c0-11 6-17 14-17s14 6 14 17v13H18z"/>
      <circle cx="32" cy="22" r="11" fill="#9b5f3f"/>
      <path fill="#183f32" d="M20 18c2-10 22-12 25 1-7-5-17-5-25-1z"/>
      <path fill="#00a94f" d="M20 38c3-6 21-6 24 0l-2 15H22z"/>
      <path fill="#fff" d="M28 37h8l-4 7z"/><circle cx="28" cy="22" r="1.3"/><circle cx="36" cy="22" r="1.3"/>
      <path fill="none" stroke="#5c2f22" stroke-linecap="round" stroke-width="1.5" d="M29 27c2 2 4 2 6 0"/>
      <path fill="none" stroke="#163d30" stroke-linecap="round" stroke-width="4" d="M26 52l-2 7m14-7 2 7"/>
      <path fill="#d5f267" d="M41 10l2 3 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z"/>
    </svg>`,
    campfire: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#7b4a2d" d="M13 48l4-6 34 12-4 6zm38-6 4 6-38 12-4-6z"/><path fill="#ffb000" d="M32 50c-12 0-17-8-11-18 3-5 7-7 8-15 8 6 16 15 14 23-1 6-5 10-11 10z"/><path fill="#ef5b2a" d="M32 48c-6 0-8-5-5-10 2-3 4-5 4-9 5 4 8 9 7 14-1 3-3 5-6 5z"/></svg>`,
    log: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#6e432b" d="M13 22h38v23H13z" transform="rotate(-18 32 34)"/><ellipse cx="50" cy="28" rx="9" ry="12" fill="#9b6645" transform="rotate(-18 50 28)"/><ellipse cx="50" cy="28" rx="5" ry="7" fill="none" stroke="#6e432b" stroke-width="2" transform="rotate(-18 50 28)"/><path fill="#447d3e" d="M10 28c1-8 8-12 14-7-4 2-7 6-8 11z"/></svg>`,
    boulder: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#78838a" d="M9 51l5-25 12-13 20 4 9 18-8 17z"/><path fill="#aab4b8" d="M20 26l8-8 12 3-7 8z"/><path fill="none" stroke="#56636a" stroke-width="3" d="M40 30l7 8-5 10"/></svg>`,
    pond: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="38" rx="25" ry="15" fill="#55b6cf"/><path fill="none" stroke="#dff8ff" stroke-linecap="round" stroke-width="3" d="M15 35c7-4 11 4 18 0s11 4 17 0M20 44c5-3 9 3 14 0s8 2 12 0"/><path fill="#3d843f" d="M10 27l6 8-8-2zm41-4 5 10-9-4z"/></svg>`,
    bush: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="35" r="14" fill="#4f8f43"/><circle cx="39" cy="31" r="17" fill="#65a650"/><circle cx="49" cy="41" r="11" fill="#397a39"/><circle cx="18" cy="31" r="3" fill="#8c3f63"/><circle cx="39" cy="25" r="3" fill="#8c3f63"/><circle cx="47" cy="40" r="3" fill="#8c3f63"/><path fill="#5b3c26" d="M30 47h6v11h-6z"/></svg>`,
    tent: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#e96f45" d="M7 53L31 9l26 44z"/><path fill="#ffb25e" d="M31 9l2 44H7z"/><path fill="#6d392a" d="M32 34l12 19H32z"/><path fill="none" stroke="#324d3d" stroke-width="2" d="M31 7v48"/></svg>`,
    sign: `<svg class="trail-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#68432b" d="M29 12h7v46h-7z"/><path fill="#e0a34f" stroke="#68432b" stroke-width="2" d="M8 14h42l8 8-8 8H8z"/><path fill="#005640" d="M20 20h24v4H20z"/></svg>`,
    cabin: `<svg class="trail-icon goal-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#8b5a32" d="M11 28h42v28H11z"/><path fill="#c97a3d" stroke="#5c3925" stroke-width="3" d="M6 30L32 8l26 22z"/><path fill="#f5d889" d="M27 39h11v17H27z"/><path fill="#b9e5f2" stroke="#fff" stroke-width="2" d="M15 35h9v9h-9zm26 0h9v9h-9z"/></svg>`,
    badge: `<svg class="trail-icon goal-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="28" r="22" fill="#d5f267" stroke="#005640" stroke-width="4"/><path fill="#00a94f" d="M32 12l5 10 11 2-8 8 2 12-10-6-10 6 2-12-8-8 11-2z"/><path fill="#005640" d="M20 47l-3 14 15-8 15 8-3-14z"/></svg>`,
    lookout: `<svg class="trail-icon goal-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#7b5232" d="M14 25h36v23H14z"/><path fill="#315d3b" d="M8 27L32 8l24 19z"/><path fill="#b9e5f2" stroke="#fff" stroke-width="2" d="M20 31h10v9H20zm15 0h10v9H35z"/><path fill="#6a442c" d="M27 45h10v14H27z"/></svg>`,
    troopBadge: `<svg class="trail-icon goal-icon" viewBox="0 0 64 64" aria-hidden="true"><path fill="#f0b84f" stroke="#005640" stroke-width="4" d="M32 5l24 14-5 28-19 12-19-12-5-28z"/><path fill="#005640" d="M18 35c0-10 5-16 14-18 9 2 14 8 14 18-6-4-9-3-14 5-5-8-8-9-14-5z"/><circle cx="32" cy="21" r="4" fill="#d5f267"/></svg>`,
  };
  const directions = {
    up: { x: 0, y: -1, label: "MOVE UP" },
    down: { x: 0, y: 1, label: "MOVE DOWN" },
    left: { x: -1, y: 0, label: "MOVE LEFT" },
    right: { x: 1, y: 0, label: "MOVE RIGHT" },
  };
  const keyDirections = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  const completionKey = "girlsWhoCode.middleCodeTheCharacter.complete";

  function samePosition(first, second) {
    return first.x === second.x && first.y === second.y;
  }

  function routeHasObstacle(route, position) {
    return route.obstacles.some((obstacle) => samePosition(obstacle, position));
  }

  function attemptRouteMove(route, position, directionName) {
    const direction = directions[directionName];
    const nextPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };

    if (
      nextPosition.x < 1 ||
      nextPosition.x > WIDTH ||
      nextPosition.y < 1 ||
      nextPosition.y > HEIGHT
    ) {
      return { ok: false, position, attemptedPosition: nextPosition, reason: "boundary" };
    }

    if (routeHasObstacle(route, nextPosition)) {
      return { ok: false, position, attemptedPosition: nextPosition, reason: "obstacle" };
    }

    return {
      ok: true,
      position: nextPosition,
      reachedGoal: samePosition(nextPosition, route.goal),
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      WIDTH,
      HEIGHT,
      ROUTES,
      directions,
      attemptRouteMove,
      routeHasObstacle,
    };
  }

  if (typeof document === "undefined") {
    return;
  }

  const trail = document.getElementById("trail");
  const trailLegend = document.getElementById("trail-legend");
  const coordinates = document.getElementById("coordinates");
  const feedback = document.getElementById("feedback");
  const completionStatus = document.getElementById("completion-status");
  const programList = document.getElementById("program-list");
  const stepCount = document.getElementById("step-count");
  const routeTheme = document.getElementById("route-theme");
  const routeCategory = document.getElementById("route-category");
  const routeDescription = document.getElementById("route-description");
  const runButton = document.getElementById("run");
  const resetButton = document.getElementById("reset");
  const undoButton = document.getElementById("undo");
  const newForestButton = document.getElementById("new-forest");
  const takeaway = document.getElementById("takeaway");
  const resultDialog = document.getElementById("result-dialog");
  const resultSymbol = document.getElementById("result-symbol");
  const resultEyebrow = document.getElementById("result-eyebrow");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultPrimary = document.getElementById("result-primary");
  const resultSecondary = document.getElementById("result-secondary");
  const commandButtons = document.querySelectorAll("[data-direction]");
  let routeIndex = 0;
  let player = { ...ROUTES[0].start };
  let program = [];
  let finished = false;
  let running = false;
  let runToken = 0;

  function currentRoute() {
    return ROUTES[routeIndex];
  }

  function obstacleDetails(route, position) {
    const index = route.obstacles.findIndex((obstacle) => samePosition(obstacle, position));
    if (index === -1) {
      return null;
    }
    const typeIndex = index % route.obstacleIcons.length;
    return {
      icon: route.obstacleIcons[typeIndex],
      name: route.obstacleNames[typeIndex],
    };
  }

  function legendItem(icon, label) {
    return `<span class="legend-item">${ICONS[icon]}<span>${label}</span></span>`;
  }

  function wasCompleted() {
    try {
      return window.localStorage.getItem(completionKey) === "true";
    } catch (error) {
      return false;
    }
  }

  function markComplete() {
    try {
      window.localStorage.setItem(completionKey, "true");
    } catch (error) {
      // The visible status still updates if browser storage is unavailable.
    }
    completionStatus.textContent = "Complete";
    completionStatus.classList.add("complete");
  }

  function setFeedback(message, kind) {
    feedback.textContent = message;
    feedback.classList.remove("good", "warning");
    if (kind) {
      feedback.classList.add(kind);
    }
  }

  function closeResult() {
    if (resultDialog.open) {
      resultDialog.close();
    }
  }

  function showResult(kind, message) {
    const success = kind === "success";
    const route = currentRoute();
    resultDialog.dataset.result = kind;
    resultSymbol.innerHTML = success ? ICONS[route.goalIcon] : ICONS.scout;
    resultEyebrow.textContent = success ? "Mission complete" : "Trail check";
    resultTitle.textContent = success ? "Badge earned!" : "A Girl Scout tries again!";
    resultMessage.textContent = success
      ? `${message} You showed courage, confidence, and character by planning, testing, and debugging.`
      : `${message} A prepared coder checks the command, changes the plan, and tests again.`;
    resultPrimary.textContent = success ? "Try a New Forest" : "Try Again";
    resultPrimary.dataset.action = success ? "new-forest" : "try-again";
    resultSecondary.textContent = success ? "Review My Code" : "Clear Program";
    resultSecondary.dataset.action = success ? "review" : "clear";
    resultDialog.showModal();
    resultPrimary.focus();
  }

  function renderTrail() {
    const route = currentRoute();
    trail.replaceChildren();
    for (let y = 1; y <= HEIGHT; y += 1) {
      for (let x = 1; x <= WIDTH; x += 1) {
        const cell = document.createElement("div");
        const position = { x, y };
        const isGoal = samePosition(position, route.goal);
        const obstacle = obstacleDetails(route, position);
        cell.className = "trail-cell";
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `x ${x}, y ${y}, open trail`);

        if (obstacle) {
          cell.classList.add("obstacle");
          cell.innerHTML = `${ICONS[obstacle.icon]}<span class="cell-label">${obstacle.name}</span>`;
          cell.setAttribute("aria-label", `x ${x}, y ${y}, ${obstacle.name}`);
        } else if (isGoal) {
          cell.classList.add("goal");
          cell.innerHTML = `${ICONS[route.goalIcon]}<span class="cell-label">${route.goalLabel}</span>`;
          cell.setAttribute("aria-label", `x ${x}, y ${y}, ${route.goalLabel} goal`);
        }

        if (samePosition(position, player)) {
          cell.classList.add("player");
          cell.innerHTML = `${ICONS.scout}<span class="cell-label">Scout character</span>`;
          cell.setAttribute("aria-label", `x ${x}, y ${y}, Scout's location`);
        }
        trail.appendChild(cell);
      }
    }

    coordinates.textContent = `Location: x ${player.x}, y ${player.y}`;
    document.body.dataset.forest = route.theme;
    trail.setAttribute("aria-label", `${route.name} forest trail`);
    routeTheme.textContent = route.name;
    routeCategory.textContent = route.category;
    routeDescription.textContent = route.description;
    trailLegend.innerHTML = [
      legendItem("scout", "Scout"),
      legendItem(route.obstacleIcons[0], route.obstacleNames[0].replace(/^a /, "")),
      legendItem(route.obstacleIcons[1], route.obstacleNames[1].replace(/^a /, "")),
      legendItem(route.goalIcon, route.goalLabel),
    ].join("");
  }

  function renderProgram(activeIndex = -1) {
    programList.replaceChildren();
    stepCount.textContent = `${program.length} ${program.length === 1 ? "command" : "commands"}`;
    undoButton.disabled = running || program.length === 0;
    runButton.disabled = running || program.length === 0;
    commandButtons.forEach((button) => {
      button.disabled = running;
    });

    if (program.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty-program";
      empty.textContent = "Add a direction to start your program.";
      programList.appendChild(empty);
      return;
    }

    program.forEach((directionName, index) => {
      const command = document.createElement("li");
      command.textContent = directions[directionName].label;
      if (index === activeIndex) {
        command.classList.add("current-command");
      }
      programList.appendChild(command);
    });
  }

  function addCommand(directionName) {
    if (running) {
      return;
    }
    if (finished) {
      player = { ...currentRoute().start };
      finished = false;
      renderTrail();
    }
    program.push(directionName);
    renderProgram();
    setFeedback(`Added ${directions[directionName].label}. Keep planning your route.`);
  }

  function attemptMove(directionName) {
    const result = attemptRouteMove(currentRoute(), player, directionName);

    if (!result.ok && result.reason === "boundary") {
      return { ok: false, message: "This command leaves the trail. Debug the boundary condition." };
    }

    if (!result.ok) {
      const obstacle = obstacleDetails(currentRoute(), result.attemptedPosition);
      return {
        ok: false,
        message: `This command runs into ${obstacle.name}. Debug the obstacle condition and change the route.`,
      };
    }

    player = result.position;
    renderTrail();
    return { ok: true, reachedGoal: result.reachedGoal };
  }

  function pause(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function runProgram() {
    if (running || program.length === 0) {
      return;
    }

    running = true;
    const activeRun = ++runToken;
    finished = false;
    player = { ...currentRoute().start };
    renderTrail();
    renderProgram();
    setFeedback("Running your program one command at a time...", "good");

    for (let index = 0; index < program.length; index += 1) {
      renderProgram(index);
      await pause(300);
      if (activeRun !== runToken) {
        return;
      }
      const result = attemptMove(program[index]);

      if (!result.ok) {
        running = false;
        renderProgram(index);
        const failureMessage = `Bug on command ${index + 1}: ${result.message}`;
        setFeedback(failureMessage, "warning");
        takeaway.hidden = false;
        showResult("failure", failureMessage);
        return;
      }

      if (result.reachedGoal) {
        running = false;
        finished = true;
        markComplete();
        renderProgram(index);
        const successMessage = `You reached the ${currentRoute().goalLabel} on command ${index + 1}! Your program works.`;
        setFeedback(successMessage, "good");
        takeaway.hidden = false;
        showResult("success", successMessage);
        return;
      }
    }

    running = false;
    renderProgram();
    const unfinishedMessage = `Your program ran safely, but Scout needs more commands to reach the ${currentRoute().goalLabel}.`;
    setFeedback(unfinishedMessage, "warning");
    takeaway.hidden = false;
    showResult("failure", unfinishedMessage);
  }

  function clearProgram() {
    closeResult();
    runToken += 1;
    running = false;
    finished = false;
    program = [];
    player = { ...currentRoute().start };
    renderTrail();
    renderProgram();
    setFeedback("Program cleared. Plan a new route from the trailhead.");
    takeaway.hidden = true;
  }

  function loadNewForest() {
    closeResult();
    runToken += 1;
    running = false;
    routeIndex = (routeIndex + 1) % ROUTES.length;
    program = [];
    player = { ...currentRoute().start };
    finished = false;
    renderTrail();
    renderProgram();
    setFeedback(`New forest loaded: ${currentRoute().name}. Plan a fresh route.`);
    takeaway.hidden = true;
  }

  function deleteLastCommand() {
    if (running || program.length === 0) {
      return;
    }
    program.pop();
    renderProgram();
    setFeedback("Deleted the last command. Check your sequence and try again.");
  }

  document.addEventListener("keydown", (event) => {
    const directionName = keyDirections[event.key];
    if (!directionName) {
      return;
    }
    event.preventDefault();
    addCommand(directionName);
  });

  commandButtons.forEach((button) => {
    button.addEventListener("click", () => addCommand(button.dataset.direction));
  });

  runButton.addEventListener("click", runProgram);
  resetButton.addEventListener("click", clearProgram);
  undoButton.addEventListener("click", deleteLastCommand);
  newForestButton.addEventListener("click", loadNewForest);
  resultPrimary.addEventListener("click", () => {
    if (resultPrimary.dataset.action === "new-forest") {
      loadNewForest();
      return;
    }
    closeResult();
    undoButton.focus();
  });
  resultSecondary.addEventListener("click", () => {
    if (resultSecondary.dataset.action === "clear") {
      clearProgram();
      return;
    }
    closeResult();
    undoButton.focus();
  });

  if (wasCompleted()) {
    completionStatus.textContent = "Complete";
    completionStatus.classList.add("complete");
  }
  renderTrail();
  renderProgram();
})();
