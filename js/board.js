var ROWS = 10;
var COLS = 10;

function buildBoard() {
    var svg = document.getElementById("board");

    // Horizontal spacing between column centres for pointy-top hexagons
    var horizSpacing = Math.sqrt(3) * HEX_SIZE;

    // Total width: COLS columns + 0.5 extra for the odd-row offset + padding on both sides
    var svgWidth  = COLS * horizSpacing + horizSpacing / 2 + HEX_SIZE;
    // Total height: each row steps down 3/2 * HEX_SIZE, last row needs its bottom half too
    var svgHeight = ROWS * (3 / 2 * HEX_SIZE) + HEX_SIZE / 2 + HEX_SIZE;

    svg.setAttribute("width",  svgWidth);
    svg.setAttribute("height", svgHeight);

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            var centre = hexToPixel(row, col);

            var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            polygon.setAttribute("points",   hexCorners(centre.x, centre.y));
            polygon.setAttribute("data-row", row);
            polygon.setAttribute("data-col", col);

            svg.appendChild(polygon);
        }
    }
}

window.addEventListener("load", buildBoard);
