var canvas;
var context;
var grid;
var piece;
var lost = false;
var frame = 0;
var score = 0;
var level = 0;
var gravity = 48;
var downPressed = false;
var downLock = false;
var downScore = 0;
var totalLinesCleared = 0;
var nextPiece;
var nextCanvas;

var scoreDom;
var levelDom;
var linesDom;

var colors = [
    '#000000', // black
    '#00cbc9', // cyan
    '#f9cd00', // yellow
    '#0052e9', // blue
    '#f98100', // orange
    '#00b80d', // green
    '#9a00f2', // purple
    '#ec2e08'  // red
]

var GameState = Object.freeze({
    menu: 0,
    playing: 1
});

var gameState = GameState.menu;

var gravities = [
    48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 
    5,  5,  5,  4,  4,  4,  3,  3,  3, 2,
    2,  2,  2,  2,  2,  2,  2,  2,  2, 1
]


function updateScore(value) {
    scoreDom.innerHTML = value;
}

function updateLevel(value) {
    levelDom.innerHTML = value;
}

function updateLines(value) {
    linesDom.innerHTML = value;
}

window.onload = function() {

    scoreDom = document.getElementById('score');
    levelDom = document.getElementById('level');
    linesDom = document.getElementById('lines');

    canvas = new Canvas('canvas', 200, 400);
    context = canvas.getContext();

    nextCanvas = new Canvas('next', 120, 80);

    context.fillStyle = colors[0];
    context.fillRect(0, 0, canvas.width, canvas.height);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.getCanvas().addEventListener('mousedown', handleClick);

    newGame();
    updateScore(score);
    updateLevel(level);
    updateLines(totalLinesCleared);

    window.requestAnimationFrame(update)
}

function drawNext(c, ctx, p) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = p.color;
    var cellSize = 20;
    for (var y = 0; y < p.height; y++) {
        for (var x = 0; x < p.width; x++) {
            if (p.shape[p.rotation][y][x] !== 0) {
                ctx.fillRect((x + 1) * cellSize, (y) * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
    c.draw();
} 

function handleClick() {
    if (gameState === GameState.menu) {
        newGame();
        gameState = GameState.playing;
    }
}

function newGame() {
    score = 0;
    level = 0;
    totalLinesCleared = 0;
    grid = new Board(10, 40);
    piece = randomPiece();
    nextPiece = randomPiece();
}

function randomPiece() {
    var i = Math.floor(Math.random() * 7);
    return new Piece(5, 18, shapes[i], colors[i + 1]);
}

function drawMenu(c, ctx) {
    ctx.fillStyle = 'blue';
    ctx.font = '20px sans';
    ctx.fillText('Click anywhere', 30, 30);
    ctx.fillText('to start', 30, 60);
}

function update() {

    canvas.draw();
    switch (gameState) {
        case GameState.menu:
            drawMenu(canvas, context);
            break;
        case GameState.playing:

            drawGrid(context);
            drawPiece(context, grid, piece);
            drawNext(nextCanvas, nextCanvas.getContext(), nextPiece);

            if (downPressed) {
                if (downScore < 20) {
                    score++;
                    downScore++;
                }
                updateScore(score);
                frame = (frame + 1) % 2;
            } else {
                frame = (frame + 1) % gravities[Math.min(level, 29)];
            }

            if (frame === 0) {
                var linesCleared = 0;
                var state = piece.update(grid);
                switch (state) {
                    case PieceResult.free:
                        break;
                    case PieceResult.placed:
                        piece = nextPiece;
                        nextPiece = randomPiece();
                        downPressed = false;
                        downScore = 0;
                        break;
                    case PieceResult.overflowed:
                        gameState = GameState.menu;
                        break;
                }
                for (var y = 0; y < grid.height; y++) {
                    var row = grid.getRow(y);
                    var clear = true;
                    for (var x = 0; x < grid.width; x++) {
                        if (row[x] === 0) {
                            clear = false;
                        }
                    }
                    if (clear) {
                        grid.clear(y);
                        linesCleared++;
                        totalLinesCleared++;
                        updateLines(totalLinesCleared);
                        if (totalLinesCleared % 10 === 0) {
                            level++;
                            updateLevel(level);
                        }
                    }
                }
                if (linesCleared > 0) {
                    switch (linesCleared) {
                        case 1:
                            score += 40 * (level + 1);
                            break;
                        case 2:
                            score += 100 * (level + 1);
                            break;
                        case 3:
                            score += 300 * (level + 1);
                            break;
                        case 4:
                            score += 1200 * (level + 1);
                            break;
                    }
                    updateScore(score);
                }
            }
            break;
    }
    window.requestAnimationFrame(update);
}

function drawPiece(ctx, board, piece) {
    var cellSize = canvas.width / grid.width;
    ctx.fillStyle = piece.color;
    for (var y = 0; y < piece.height; y++) {
        for (var x = 0; x < piece.width; x++) {
            if (piece.shape[piece.rotation][y][x] !== 0) {
                ctx.fillRect((piece.x + x) * cellSize, (piece.y - 20 + y) * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
}

function handleKeyDown(e) {
    switch (keyboard.getChar(e)) {
        case 'left':
            piece.move(grid, -1);
            break;
        case 'right':
            piece.move(grid, 1);
            break;
        case 'up':
            break;
        case 'down':
            if (!downLock) {
                downPressed = true;
                downLock = true;
            }
            break;
        case 'x':
            piece.rotate(grid, 1);
            break;
        case 'z':
            piece.rotate(grid, -1);
            break;
    }
}

function handleKeyUp(e) {
    switch (keyboard.getChar(e)) {
        case 'down':
            downPressed = false;
            downLock = false;
    }
}

function drawGrid(ctx) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var ps = canvas.width / grid.width;

    for (var i = 1; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        for (var y = 0; y < grid.height - 20; y++) {
            for (var x = 0; x < grid.width; x++) {
                if (grid.get(x, y + 20) === i) {
                    ctx.fillRect(x * ps, y * ps, ps - 1, ps - 1);
                }
            }
        }
    }
}
