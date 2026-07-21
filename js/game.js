// Each monster: {row, col, player}  player is 1 or 2
var monsters = [];

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

// Initialise before the board is built
setupMonsters();
