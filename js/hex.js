// Circumradius: centre to any corner, in pixels
var HEX_SIZE = 40;

// Returns an SVG points string for a pointy-top hexagon centred at (cx, cy).
function hexCorners(cx, cy) {
    var points = "";
    for (var i = 0; i < 6; i++) {
        // -30 rotates the first corner to the top, giving a pointy-top shape
        var angle_deg = 60 * i - 30;
        var angle_rad = Math.PI / 180 * angle_deg;
        // HEX_SIZE is the circumradius, so each corner is exactly HEX_SIZE away
        var x = cx + HEX_SIZE * Math.cos(angle_rad);
        var y = cy + HEX_SIZE * Math.sin(angle_rad);
        points += x + "," + y + " ";
    }
    return points.trim();
}

// Converts odd-r offset (row, col) to axial coordinates {q, r}.
function offsetToAxial(row, col) {
    // The standard odd-r formula: shift col left by half the row number (rounded down)
    var q = col - (row - (row & 1)) / 2;
    var r = row;
    return { q: q, r: r };
}

// Converts axial coordinates {q, r} back to odd-r offset {row, col}.
function axialToOffset(q, r) {
    // Inverse of offsetToAxial: shift col right by half the row number
    var col = q + (r - (r & 1)) / 2;
    var row = r;
    return { row: row, col: col };
}

// Returns an array of {row, col} for the six neighbours of the given hex.
function neighbours(row, col) {
    // Six axial direction vectors for a pointy-top hex grid
    var directions = [
        { dq: +1, dr:  0 },
        { dq: +1, dr: -1 },
        { dq:  0, dr: -1 },
        { dq: -1, dr:  0 },
        { dq: -1, dr: +1 },
        { dq:  0, dr: +1 }
    ];

    var axial = offsetToAxial(row, col);
    var result = [];

    for (var i = 0; i < directions.length; i++) {
        var nq = axial.q + directions[i].dq;
        var nr = axial.r + directions[i].dr;
        var offset = axialToOffset(nq, nr);
        // Only keep hexes that fall inside the 10x10 grid
        if (offset.row >= 0 && offset.row <= 9 && offset.col >= 0 && offset.col <= 9) {
            result.push(offset);
        }
    }

    return result;
}

// Converts odd-r offset (row, col) to the pixel centre of that hexagon.
function hexToPixel(row, col) {
    // Horizontal distance between adjacent column centres
    var horizSpacing = Math.sqrt(3) * HEX_SIZE;
    // Odd rows are shifted right by half a column width
    var offsetX = (row % 2 !== 0) ? horizSpacing / 2 : 0;
    var cx = col * horizSpacing + offsetX + HEX_SIZE;
    // Rows overlap: two flat sides share 1/4 of height each, so net step is 3/4 * fullHeight
    // fullHeight = 2 * HEX_SIZE, so step = 3/2 * HEX_SIZE
    var cy = row * (3 / 2 * HEX_SIZE) + HEX_SIZE;
    return { x: cx, y: cy };
}
