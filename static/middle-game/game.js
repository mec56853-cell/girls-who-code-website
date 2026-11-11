(() => {
  const WIDTH = 8;
  const HEIGHT = 6;
  const START = { x: 1, y: 6 };
  const ROUTES = [
    {
      category: "Camping",
      name: "Pinecone Camp",
      description: "Plan a path around the trees to reach the campfire campsite.",
      obstacles: [
        { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 },
        { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 6, y: 2 }, { x: 7, y: 2 },
      ],
    },
    {
      category: "Hiking",
      name: "Ridge Hike",
      description: "Cross the ridge trail and find the campsite beyond the hillside.",
      obstacles: [
        { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 },
        { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 7, y: 3 },
      ],
    },
    {
      category: "Wildlife",
      name: "Wildlife Watch",
      description: "Give the wildlife plenty of space as you travel to the ranger campsite.",
      obstacles: [
        { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 4 },
        { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 7, y: 2 },
      ],
    },
    {
      category: "Troop adventure",
      name: "Troop Trail",
      description: "Lead your troop around the markers and meet at the final campsite.",
      obstacles: [
        { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 3, y: 4 }, { x: 4, y: 4 },
        { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 5, y: 1 },
      ],
    },
  ];
  const GOAL = { x: 8, y: 1 };
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
      return { ok: false, position, reason: "boundary" };
    }

    if (routeHasObstacle(route, nextPosition)) {
      return { ok: false, position, reason: "obstacle" };
    }

    return {
      ok: true,
      position: nextPosition,
      reachedGoal: samePosition(nextPosition, GOAL),
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      WIDTH,
      HEIGHT,
      START,
      GOAL,
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
  const commandButtons = document.querySelectorAll("[data-direction]");
  let routeIndex = 0;
  let player = { ...START };
  let program = [];
  let finished = false;
  let running = false;
  let runToken = 0;

  function currentRoute() {
    return ROUTES[routeIndex];
  }

  function isObstacle(position) {
    return routeHasObstacle(currentRoute(), position);
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

  function renderTrail() {
    trail.replaceChildren();
    for (let y = 1; y <= HEIGHT; y += 1) {
      for (let x = 1; x <= WIDTH; x += 1) {
        const cell = document.createElement("div");
        const position = { x, y };
        const isGoal = samePosition(position, GOAL);
        const obstacle = isObstacle(position);
        cell.className = "trail-cell";
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `x ${x}, y ${y}, open trail`);

        if (obstacle) {
          cell.classList.add("obstacle");
          cell.innerHTML = '<span aria-hidden="true">T</span><span class="cell-label">Obstacle</span>';
          cell.setAttribute("aria-label", `x ${x}, y ${y}, obstacle`);
        } else if (isGoal) {
          cell.classList.add("goal");
          cell.innerHTML = '<span aria-hidden="true">C</span><span class="cell-label">Campsite goal</span>';
          cell.setAttribute("aria-label", `x ${x}, y ${y}, campsite goal`);
        }

        if (samePosition(position, player)) {
          cell.classList.add("player");
          cell.innerHTML = '<span aria-hidden="true">S</span><span class="cell-label">Character</span>';
          cell.setAttribute("aria-label", `x ${x}, y ${y}, Scout's location`);
        }
        trail.appendChild(cell);
      }
    }

    coordinates.textContent = `Location: x ${player.x}, y ${player.y}`;
    routeTheme.textContent = currentRoute().name;
    routeCategory.textContent = currentRoute().category;
    routeDescription.textContent = currentRoute().description;
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
      player = { ...START };
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
      return { ok: false, message: "This command hits a tree. Debug the obstacle condition and change the route." };
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
    player = { ...START };
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
        setFeedback(`Bug on command ${index + 1}: ${result.message}`, "warning");
        takeaway.hidden = false;
        return;
      }

      if (result.reachedGoal) {
        running = false;
        finished = true;
        markComplete();
        renderProgram(index);
        setFeedback(`You reached the campsite on command ${index + 1}! Your program works.`, "good");
        takeaway.hidden = false;
        return;
      }
    }

    running = false;
    renderProgram();
    setFeedback("Your program ran without hitting an obstacle, but Scout needs more commands to reach the campsite.", "warning");
    takeaway.hidden = false;
  }

  function clearProgram() {
    runToken += 1;
    running = false;
    finished = false;
    program = [];
    player = { ...START };
    renderTrail();
    renderProgram();
    setFeedback("Program cleared. Plan a new route from the trailhead.");
    takeaway.hidden = true;
  }

  function loadNewForest() {
    runToken += 1;
    running = false;
    routeIndex = (routeIndex + 1) % ROUTES.length;
    program = [];
    player = { ...START };
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

  if (wasCompleted()) {
    completionStatus.textContent = "Complete";
    completionStatus.classList.add("complete");
  }
  renderTrail();
  renderProgram();
})();
