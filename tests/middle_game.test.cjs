const assert = require("node:assert/strict");
const test = require("node:test");

const {
  WIDTH,
  HEIGHT,
  START,
  GOAL,
  ROUTES,
  directions,
  attemptRouteMove,
} = require("../static/middle-game/game.js");

function key(position) {
  return `${position.x},${position.y}`;
}

function findPath(route) {
  const queue = [{ position: START, commands: [] }];
  const visited = new Set([key(START)]);

  while (queue.length) {
    const current = queue.shift();
    if (current.position.x === GOAL.x && current.position.y === GOAL.y) {
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

  for (const route of ROUTES) {
    assert.ok(route.description.length > 20);
    assert.equal(route.obstacleIcons.length, 2);
    assert.equal(route.obstacleNames.length, 2);
    assert.ok(route.goalIcon);
    assert.ok(route.goalLabel);
    const path = findPath(route);
    assert.ok(path, `${route.name} should have a path to the campsite`);

    let position = START;
    for (const command of path) {
      const result = attemptRouteMove(route, position, command);
      assert.equal(result.ok, true);
      position = result.position;
    }
    assert.deepEqual(position, GOAL);
  }
});

test("movement reports boundaries and obstacles without moving Scout", () => {
  const boundary = attemptRouteMove(ROUTES[0], START, "down");
  assert.equal(boundary.reason, "boundary");
  assert.deepEqual(boundary.position, START);

  const obstacle = attemptRouteMove(ROUTES[0], START, "right");
  assert.equal(obstacle.reason, "obstacle");
  assert.deepEqual(obstacle.position, START);
});

test("course coordinates stay inside the board and avoid start and goal", () => {
  for (const route of ROUTES) {
    for (const obstacle of route.obstacles) {
      assert.ok(obstacle.x >= 1 && obstacle.x <= WIDTH);
      assert.ok(obstacle.y >= 1 && obstacle.y <= HEIGHT);
      assert.notDeepEqual(obstacle, START);
      assert.notDeepEqual(obstacle, GOAL);
    }
  }
});
