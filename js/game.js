// Each monster: {row, col, player}  player is 1 or 2
var monsters = [];

var currentPlayer = 1;
var MOVE_RANGE = 3;
var gameOver = false;
var moveCount = 0;

// Lookup keyed by "row,col" -> step cost; populated by computeRange
var reachable = {};

// Lookup keyed by "row,col" -> parent key; used to reconstruct the path
var parent = {};

// Returns the monster at (row, col), or null if the hex is empty
function monsterAt(row, col) {
    for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].row === row && monsters[i].col === col) {
            return monsters[i];
        }
    }
    return null;
}

// Places 3 monsters per player, spread across the grid rather than adjacent
function setupMonsters() {
    // Player 1 on the bottom row (row 9), columns 1, 4, 7
    monsters.push({ row: 9, col: 1, player: 1 });
    monsters.push({ row: 9, col: 4, player: 1 });
    monsters.push({ row: 9, col: 7, player: 1 });

    // Player 2 on the top row (row 0), columns 2, 5, 8
    monsters.push({ row: 0, col: 2, player: 2 });
    monsters.push({ row: 0, col: 5, player: 2 });
    monsters.push({ row: 0, col: 8, player: 2 });
}

// BFS from (startRow, startCol) up to MOVE_RANGE steps.
// Returns the reachable lookup and also writes it to the module-level variable.
function computeRange(startRow, startCol) {
    reachable = {};
    parent = {};

    // Using a plain array with a head index instead of shift() because
    // shift() removes the first element and shifts all others left (O(n) cost).
    // A head index just advances a pointer, which is O(1).
    var queue = [{ row: startRow, col: startCol, steps: 0 }];
    var head = 0;

    var startKey = startRow + "," + startCol;

    // Mark the start hex as visited so it is never re-enqueued
    var visited = {};
    visited[startKey] = true;

    while (head < queue.length) {
        var current = queue[head];
        head++;

        var currentKey = current.row + "," + current.col;
        var nbrs = neighbours(current.row, current.col);
        for (var i = 0; i < nbrs.length; i++) {
            var n = nbrs[i];
            var key = n.row + "," + n.col;

            if (visited[key]) { continue; }
            visited[key] = true;

            var occupant = monsterAt(n.row, n.col);

            // Friendly monster: blocked completely, do not enter or expand
            if (occupant !== null && occupant.player === currentPlayer) { continue; }

            // This hex costs one more step than the hex we came from
            var cost = current.steps + 1;
            if (cost > MOVE_RANGE) { continue; }

            // Record which hex we came from so pathTo can walk back later
            parent[key] = currentKey;

            // Enemy monster: valid destination, but do not expand its neighbours
            if (occupant !== null && occupant.player !== currentPlayer) {
                reachable[key] = cost;
                // Do NOT enqueue -- we cannot pass through an enemy
                continue;
            }

            // Empty hex: add as destination and expand further
            reachable[key] = cost;
            queue.push({ row: n.row, col: n.col, steps: cost });
        }
    }

    return reachable;
}

// Walks the parent lookup from target back to start, then reverses for forward order.
// Returns an array of {row, col}, excluding the start hex. Empty if not reachable.
function pathTo(row, col) {
    var key = row + "," + col;
    if (reachable[key] === undefined) { return []; }

    var path = [];
    while (parent[key] !== undefined) {
        var parts = key.split(",");
        path.push({ row: parseInt(parts[0], 10), col: parseInt(parts[1], 10) });
        key = parent[key];
    }
    // path is backwards (target -> start), reverse to get start -> target
    path.reverse();
    return path;
}

// Moves a monster to (row, col). Captures an enemy if present.
// Switches currentPlayer and clears selection state.
function moveMonster(monster, row, col) {
    var target = monsterAt(row, col);

    // Capture: remove the enemy monster from the array
    if (target !== null && target.player !== currentPlayer) {
        for (var i = 0; i < monsters.length; i++) {
            if (monsters[i] === target) {
                monsters.splice(i, 1);
                break;
            }
        }
    }

    // Move the monster to the new hex
    monster.row = row;
    monster.col = col;

    moveCount++;

    // Pass the turn
    currentPlayer = (currentPlayer === 1) ? 2 : 1;

    // Lock the board if the game is now over
    if (checkWin() !== null) { gameOver = true; }

    // Clear selection state
    selectedHex = null;
    reachable = {};
    parent = {};
}

// Returns 1 or 2 if that player has won, or null if the game is still going.
function checkWin() {
    var p1alive = false;
    var p2alive = false;
    for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].player === 1) { p1alive = true; }
        if (monsters[i].player === 2) { p2alive = true; }
    }
    if (!p2alive) { return 1; }
    if (!p1alive) { return 2; }
    return null;
}

// Resets all game state and re-places monsters for a new game.
function resetGame() {
    monsters = [];
    currentPlayer = 1;
    gameOver = false;
    moveCount = 0;
    selectedHex = null;
    reachable = {};
    parent = {};
    setupMonsters();
}

// Initialise before the board is built
setupMonsters();
