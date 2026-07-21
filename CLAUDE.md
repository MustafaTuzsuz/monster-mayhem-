# Monster Mayhem - CCT College Dublin Assessment

## Your role
You write the code AND manage the process.
- One roadmap step at a time. Never jump ahead.
- Wait for the user to give you the prompt for each step. Do not start on your own.
- Before writing code, state in one line what you are about to do and why.
- After writing, explain the key logic in 3-5 lines so I can defend it on video.
- If I ask "explain this", give a plain explanation I can repeat in my own words.
- You write the commit message. I run git myself.
- Keep responses short. Ask instead of guessing.
- Chat in Turkish. All code and docs in English. No em-dashes.

## Constraints
Vanilla JS. No server-side code, no build step, no npm dependencies.
Classic <script> tags, no ES modules (must work over file://).
SVG <polygon> rendering. Pointy-top hexagons, odd-r offset layout.
Axial (q,r) coordinates for logic, row/col for display.

Files:
  index.html
  css/style.css
  js/hex.js    = hexagon geometry (corner points, pixel conversion)
  js/board.js  = grid build, rendering, hexStateClass()
  js/game.js   = state, turns, selection, BFS
Script load order in index.html: hex.js -> board.js -> game.js

## Assessment requirements
- 10x10 grid of connected regular hexagons, no gaps
- Hovered hexagon highlighted distinctly
- Selected hexagon highlighted distinctly, different from hover
- User can deselect
- Challenge: character movement with prospective path highlighting
- All code must be explainable by the student in a 7 minute video.
  No clever one-liners, no unnecessary abstraction.

## Game rules
2 players, 3 monsters each. P1 bottom rows, P2 top rows.
Click own monster -> selected, 3-step move range highlighted.
Hover an in-range hex -> BFS path drawn in a separate colour.
Click -> monster moves, turn passes to opponent.
BFS walks empty hexes only. An enemy hex IS enqueued as a valid target,
but its neighbours are NOT expanded (cannot pass through it).
Own monsters block completely.
Deselect: click the selected monster, or click any out-of-range hex.
In-range empty hex click = move. Out-of-range click = deselect.
Win: capture all 3 enemy monsters.

## Visual state priority
Single function hexStateClass(row, col) in board.js returns ONE string:
selected > path > hover > in-range > default.
The class attribute is overwritten on each draw. Never use classList.add.

## Commit discipline (major marks here)
Every AI-generated iteration = its own commit, with the prompt in the body.
Every manual modification = a separate commit.
Document troubleshooting even when it does not resolve the issue.

Commit body template:
  Prompt used (my request): "..."
  Technical breakdown: "..." (max 4 lines)
  Problem:
  Diagnosis:
  Fix:
  Result:

## Roadmap
1. Project scaffold and development rules
2. Single hexagon geometry
3. 10x10 grid, no gaps
4. Hover highlight
5. Select and deselect
6. Axial coordinates and neighbours
7. Monster placement
8. Move range via BFS
9. Path preview
10. Polish, Harvard references, video preparation
