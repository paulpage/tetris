var frame = 0;
var downPressed = false;
var downLock = false;
var downScore = 0;
var game;

var nextCanvas;
var canvas;
var context;
var scoreDom;
var levelDom;
var linesDom;

var keyConfig = Object.freeze({
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
    rotateClockwise: 'c',
    rotateCounterclockwise: 'x'
});

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


    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.getCanvas().addEventListener('mousedown', handleClick);

    game = new Game(0);
    updateScore(game.score);
    updateLevel(game.level);
    updateLines(game.linesCleared);

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
        game = new Game(0);
        gameState = GameState.playing;
    }
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
            drawPiece(context, game.board, game.piece);
            drawNext(nextCanvas, nextCanvas.getContext(), game.nextPiece);

            if (downPressed) {
                if (downScore < 20) {
                    game.score++;
                    downScore++;
                }
                updateScore(game.score);
                frame = (frame + 1) % 2;
            } else {
                frame = (frame + 1) % game.gravities[Math.min(game.level, 29)];
            }

            if (frame === 0) {
                var linesCleared = 0;
                var state = game.piece.update(game.board);
                switch (state) {
                    case PieceResult.free:
                        break;
                    case PieceResult.placed:
                        game.piece = game.nextPiece;
                        game.nextPiece = game.randomPiece();
                        downPressed = false;
                        downScore = 0;
                        break;
                    case PieceResult.overflowed:
                        gameState = GameState.menu;
                        break;
                }

                for (var y = 0; y < game.board.height; y++) {
                    var row = game.board.getRow(y);
                    var clear = true;
                    for (var x = 0; x < game.board.width; x++) {
                        if (row[x] === 0) {
                            clear = false;
                        }
                    }
                    if (clear) {
                        game.board.clear(y);
                        linesCleared++;
                        game.linesCleared++;
                        updateLines(game.linesCleared);
                        if (game.linesCleared % 10 === 0) {
                            game.level++;
                            updateLevel(game.level);
                        }
                    }
                }

                if (linesCleared > 0) {
                    var scoreMultipliers = [40, 100, 300, 1200];
                    game.score += scoreMultipliers[linesCleared - 1] * (game.level + 1);
                    updateScore(game.score);
                }
            }
            break;
    }
    window.requestAnimationFrame(update);
}

function drawPiece(ctx, board, piece) {
    var cellSize = canvas.width / board.width;
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
        case keyConfig.left:
            game.piece.move(game.board, -1);
            break;
        case keyConfig.right:
            game.piece.move(game.board, 1);
            break;
        case keyConfig.up:
            break;
        case keyConfig.down:
            if (!downLock) {
                downPressed = true;
                downLock = true;
            }
            break;
        case keyConfig.rotateClockwise:
            game.piece.rotate(game.board, 1);
            break;
        case keyConfig.rotateCounterclockwise:
            game.piece.rotate(game.board, -1);
            break;
    }
}

function handleKeyUp(e) {
    switch (keyboard.getChar(e)) {
        case keyConfig.down:
            downPressed = false;
            downLock = false;
    }
}

function drawGrid(ctx) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var ps = canvas.width / game.board.width;

    for (var i = 1; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        for (var y = 0; y < game.board.height - 20; y++) {
            for (var x = 0; x < game.board.width; x++) {
                if (game.board.get(x, y + 20) === i) {
                    ctx.fillRect(x * ps, y * ps, ps - 1, ps - 1);
                }
            }
        }
    }
}
