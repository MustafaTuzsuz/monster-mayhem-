var ROWS = 10;
var COLS = 10;

// Tracks which hex the mouse is currently over; null when outside the grid
var hoveredHex = null;

// Tracks which hex the player has clicked to select; null when nothing is selected
var selectedHex = null;

// Array of {row, col} for the path from the selected monster to the hovered hex
var currentPath = [];

// Returns the single CSS class that should be applied to this hex.
// Priority order (highest first): selected > path > hover > in-range > default.
function hexStateClass(row, col) {
    if (selectedHex !== null && selectedHex.row === row && selectedHex.col === col) {
        return "selected";
    }
    // Check if this hex is on the current path preview
    for (var p = 0; p < currentPath.length; p++) {
        if (currentPath[p].row === row && currentPath[p].col === col) {
            return "path";
        }
    }
    if (hoveredHex !== null && hoveredHex.row === row && hoveredHex.col === col) {
        return "hover";
    }
    if (reachable[row + "," + col] !== undefined) {
        return "in-range";
    }
    return "";
}

// Overwrites the class attribute of every polygon using hexStateClass.
// Never uses classList.add -- one source of truth per hex.
function refresh() {
    var polygons = document.getElementById("board").getElementsByTagName("polygon");
    for (var i = 0; i < polygons.length; i++) {
        var poly = polygons[i];
        var r = parseInt(poly.getAttribute("data-row"), 10);
        var c = parseInt(poly.getAttribute("data-col"), 10);
        poly.setAttribute("class", hexStateClass(r, c));
    }
}

// Updates the status text below the board
function updateStatus(winner) {
    var el = document.getElementById("status");
    if (winner !== null) {
        el.textContent = "Player " + winner + " wins!";
    } else {
        el.textContent = "Player " + currentPlayer + "'s turn";
    }
}

// Clears all SVG children and redraws the entire board
function rebuildBoard() {
    var svg = document.getElementById("board");
    // Remove everything so circles reflect the new monster positions
    while (svg.firstChild) { svg.removeChild(svg.firstChild); }
    // Old polygon elements are gone so mouseleave never fires; reset manually
    hoveredHex = null;
    currentPath = [];
    buildBoard();
    updateStatus(checkWin());
}

function buildBoard() {
    var svg = document.getElementById("board");

    // Horizontal spacing between column centres for pointy-top hexagons
    var horizSpacing = Math.sqrt(3) * HEX_SIZE;

    // Total width: COLS columns + 0.5 extra for the odd-row offset + padding on both sides
    var svgWidth = COLS * horizSpacing + horizSpacing / 2 + HEX_SIZE;
    // Total height: each row steps down 3/2 * HEX_SIZE, last row needs its bottom half too
    var svgHeight = ROWS * (3 / 2 * HEX_SIZE) + HEX_SIZE / 2 + HEX_SIZE;

    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            var centre = hexToPixel(row, col);

            var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            polygon.setAttribute("points", hexCorners(centre.x, centre.y));
            polygon.setAttribute("data-row", row);
            polygon.setAttribute("data-col", col);

            // Identity is read from the frozen data attributes on the event target,
            // so the listener never closes over the loop variables at all.
            polygon.addEventListener("mouseenter", function (e) {
                var r = parseInt(e.target.getAttribute("data-row"), 10);
                var c = parseInt(e.target.getAttribute("data-col"), 10);
                hoveredHex = { row: r, col: c };
                // Show path preview only when a monster is selected and this hex is in range
                if (selectedHex !== null && reachable[r + "," + c] !== undefined) {
                    currentPath = pathTo(r, c);
                } else {
                    currentPath = [];
                }
                refresh();
            });

            polygon.addEventListener("mouseleave", function () {
                hoveredHex = null;
                currentPath = [];
                refresh();
            });

            polygon.addEventListener("click", function (e) {
                if (gameOver) { return; }
                var r = parseInt(e.target.getAttribute("data-row"), 10);
                var c = parseInt(e.target.getAttribute("data-col"), 10);

                // Clicking the already-selected hex deselects it
                if (selectedHex !== null && selectedHex.row === r && selectedHex.col === c) {
                    selectedHex = null;
                    reachable = {};
                    currentPath = [];
                    refresh();
                    return;
                }

                // If a monster is selected and this hex is reachable, move there
                if (selectedHex !== null && reachable[r + "," + c] !== undefined) {
                    var moving = monsterAt(selectedHex.row, selectedHex.col);
                    moveMonster(moving, r, c);
                    currentPath = [];
                    var winner = checkWin();
                    rebuildBoard();
                    updateStatus(winner);
                    return;
                }

                // Try to select a friendly monster on this hex
                var clicked = monsterAt(r, c);
                if (clicked !== null && clicked.player === currentPlayer) {
                    selectedHex = { row: r, col: c };
                    currentPath = [];
                    computeRange(r, c);
                    refresh();
                } else {
                    // Out-of-range or empty hex: deselect
                    selectedHex = null;
                    reachable = {};
                    currentPath = [];
                    refresh();
                }
            });

            svg.appendChild(polygon);

            // Draw a circle on top if a monster lives on this hex
            var monster = monsterAt(row, col);
            if (monster !== null) {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", centre.x);
                circle.setAttribute("cy", centre.y);
                circle.setAttribute("r", HEX_SIZE * 0.35);
                circle.setAttribute("class", "p" + monster.player);
                // Circles must not intercept mouse events -- clicks and hover must reach the polygon below
                circle.setAttribute("pointer-events", "none");
                svg.appendChild(circle);
            }
        }
    }
}

window.addEventListener("load", function () {
    buildBoard();
    updateStatus(null);
});
