const assert = require("node:assert/strict");
const test = require("node:test");

const {
  WIDTH,
  HEIGHT,
  ROUTES,
  directions,
  attemptRouteMove,
} = require("../static/middle-game/game.js");

function key(position) {
  return `${position.x},${position.y}`;
}

function findPath(route) {
  const queue = [{ position: route.start, commands: [] }];
  const visited = new Set([key(route.start)]);

  while (queue.length) {
    const current = queue.shift();
    if (current.position.x === route.goal.x && current.position.y === route.goal.y) {
      return current.commands;
    }

    for (const directionName of Object.keys(directions)) {
      const result = attemptRouteMove(route, current.position, directionName);
      if (!result.ok || visited.has(key(result.position))) continue;
      visited.add(key(result.position));
      queue.push({
        position: result.position,
        commands: [...current.commands, directionName],
      });
    }
  }
  return null;
}

test("all four themed forests are distinct and playable", () => {
  assert.deepEqual(
    ROUTES.map((route) => route.category),
    ["Camping", "Hiking", "Wildlife", "Troop adventure"],
  );
  assert.equal(new Set(ROUTES.map((route) => JSON.stringify(route.obstacles))).size, 4);
  assert.equal(new Set(ROUTES.map((route) => route.theme)).size, 4);
  assert.equal(new Set(ROUTES.map((route) => key(route.start))).size, 4);
  assert.equal(new Set(ROUTES.map((route) => key(route.goal))).size, 4);
  const solutionSignatures = [];

  for (const route of ROUTES) {
    assert.ok(route.description.length > 20);
    assert.equal(route.obstacleIcons.length, 2);
    assert.equal(route.obstacleNames.length, 2);
    assert.ok(route.goalIcon);
    assert.ok(route.goalLabel);
    const path = findPath(route);
    assert.ok(path, `${route.name} should have a path to its goal`);
    solutionSignatures.push(path.join(","));

    let position = route.start;
    for (const command of path) {
      const result = attemptRouteMove(route, position, command);
      assert.equal(result.ok, true);
      position = result.position;
    }
    assert.deepEqual(position, route.goal);
  }

  assert.equal(new Set(solutionSignatures).size, ROUTES.length);
});

test("movement reports boundaries and obstacles without moving Scout", () => {
  const boundary = attemptRouteMove(ROUTES[0], ROUTES[0].start, "down");
  assert.equal(boundary.reason, "boundary");
  assert.deepEqual(boundary.position, ROUTES[0].start);

  const obstacle = attemptRouteMove(ROUTES[0], ROUTES[0].start, "right");
  assert.equal(obstacle.reason, "obstacle");
  assert.deepEqual(obstacle.position, ROUTES[0].start);
});

test("the old five-up seven-right shortcut fails in every forest", () => {
  const oldShortcut = [...Array(5).fill("up"), ...Array(7).fill("right")];

  for (const route of ROUTES) {
    let position = route.start;
    let reachedGoal = false;
    for (const command of oldShortcut) {
      const result = attemptRouteMove(route, position, command);
      if (!result.ok) break;
      position = result.position;
      reachedGoal = result.reachedGoal;
      if (reachedGoal) break;
    }
    assert.equal(reachedGoal, false, `${route.name} should require a different plan`);
  }
});

test("course coordinates stay inside the board and avoid start and goal", () => {
  for (const route of ROUTES) {
    for (const obstacle of route.obstacles) {
      assert.ok(obstacle.x >= 1 && obstacle.x <= WIDTH);
      assert.ok(obstacle.y >= 1 && obstacle.y <= HEIGHT);
      assert.notDeepEqual(obstacle, route.start);
      assert.notDeepEqual(obstacle, route.goal);
    }
  }
});
