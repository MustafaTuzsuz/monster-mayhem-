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
