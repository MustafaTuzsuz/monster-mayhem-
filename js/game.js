// Each monster: {row, col, player}  player is 1 or 2
var monsters = [];

var currentPlayer = 1;
var MOVE_RANGE = 3;

// Lookup keyed by "row,col" -> step cost; populated by computeRange
var reachable = {};

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

    // Using a plain array with a head index instead of shift() because
    // shift() removes the first element and shifts all others left (O(n) cost).
    // A head index just advances a pointer, which is O(1).
    var queue = [{ row: startRow, col: startCol, steps: 0 }];
    var head = 0;

    // Mark the start hex as visited so it is never re-enqueued
    var visited = {};
    visited[startRow + "," + startCol] = true;

    while (head < queue.length) {
        var current = queue[head];
        head++;

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

// Initialise before the board is built
setupMonsters();
