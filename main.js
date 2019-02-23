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
    'black',
    'cyan',
    'yellow',
    'blue',
    'orange',
    'green',
    'purple',
    'red'
]

class Canvas {
    constructor(id, width, height) {
        this.externalCanvas = document.getElementById(id);
        this.externalContext = this.externalCanvas.getContext('2d');
        this.externalCanvas.width = width;
        this.externalCanvas.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');

        this.width = width;
        this.height = height;
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.context;
    }

    draw() {
        this.externalContext.drawImage(this.canvas, 0, 0);
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.externalCanvas.width = width;
        this.externalCanvas.height = height;
    }
}

var GameState = Object.freeze({
    menu: 0,
    playing: 1
});

var gameState = GameState.menu;

var PieceResult = Object.freeze({
    free: 0,
    placed: 1,
    overflowed: 2
});

var gravities = [
    48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 
    5,  5,  5,  4,  4,  4,  3,  3,  3, 2,
    2,  2,  2,  2,  2,  2,  2,  2,  2, 1
]

class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.data = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            this.data[i] = new Array(this.width).fill(0);
        }
    }

    get(x, y) {
        if (this.bounded(x, y)) {
            return this.data[y][x];
        }
        return 0;
    }

    set(x, y, value) {
        if (this.bounded(x, y)) {
            this.data[y][x] = value;
        }
    }

    bounded(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    getRow(y) {
        if (y >= 0 && y < this.height) {
            return this.data[y];
        }
    }

    // Removes the row at the given y index and puts it at the top of the board
    clear(y) {
        this.data.splice(y, 1);
        this.data.unshift(new Array(this.width).fill(0));
    }
}

function updateScore(value) {
    scoreDom.innerHTML = value;
}

function updateLevel(value) {
    levelDom.innerHTML = value;
}

function updateLines(value) {
    linesDom.innerHTML = value;
}

var shapes = [
    [
        [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ], [
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
        ], [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ], [
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
        ]
    ], [
        [
            [0,0,0,0],
            [0,2,2,0],
            [0,2,2,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,2,2,0],
            [0,2,2,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,2,2,0],
            [0,2,2,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,2,2,0],
            [0,2,2,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [3,3,3,0],
            [0,0,3,0],
            [0,0,0,0]
        ], [
            [0,3,0,0],
            [0,3,0,0],
            [3,3,0,0],
            [0,0,0,0]
        ], [
            [3,0,0,0],
            [3,3,3,0],
            [0,0,0,0],
            [0,0,0,0]
        ], [
            [0,3,3,0],
            [0,3,0,0],
            [0,3,0,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [4,4,4,0],
            [4,0,0,0],
            [0,0,0,0]
        ], [
            [4,4,0,0],
            [0,4,0,0],
            [0,4,0,0],
            [0,0,0,0]
        ], [
            [0,0,4,0],
            [4,4,4,0],
            [0,0,0,0],
            [0,0,0,0]
        ], [
            [0,4,0,0],
            [0,4,0,0],
            [0,4,4,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [0,5,5,0],
            [5,5,0,0],
            [0,0,0,0]
        ], [
            [0,5,0,0],
            [0,5,5,0],
            [0,0,5,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,5,5,0],
            [5,5,0,0],
            [0,0,0,0]
        ], [
            [0,5,0,0],
            [0,5,5,0],
            [0,0,5,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [6,6,6,0],
            [0,6,0,0],
            [0,0,0,0]
        ], [
            [0,6,0,0],
            [6,6,0,0],
            [0,6,0,0],
            [0,0,0,0]
        ], [
            [0,6,0,0],
            [6,6,6,0],
            [0,0,0,0],
            [0,0,0,0]
        ], [
            [0,6,0,0],
            [0,6,6,0],
            [0,6,0,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [7,7,0,0],
            [0,7,7,0],
            [0,0,0,0]
        ], [
            [0,0,7,0],
            [0,7,7,0],
            [0,7,0,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [7,7,0,0],
            [0,7,7,0],
            [0,0,0,0]
        ], [
            [0,0,7,0],
            [0,7,7,0],
            [0,7,0,0],
            [0,0,0,0]
        ]
    ]
];

window.onload = function() {

    scoreDom = document.getElementById('score');
    levelDom = document.getElementById('level');
    linesDom = document.getElementById('lines');
    canvas.init();
    canvas.setSize(200, 400);

    nextCanvas = new Canvas('next', 80, 80);

    canvas.ctx.fillStyle = colors[0];
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.c.addEventListener('mousedown', handleClick);

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
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
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

    switch (gameState) {
        case GameState.menu:
            drawMenu(canvas, canvas.ctx);
            break;
        case GameState.playing:
            canvas.draw();

            drawGrid(canvas.ctx);
            drawPiece(canvas.ctx, grid, piece);
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
                        case 3:
                            score += 300 * (level + 1);
                        case 4:
                            score += 1200 * (level + 1);
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
                ctx.fillRect((piece.x + x) * cellSize, (piece.y - 20 + y) * cellSize, cellSize, cellSize);
            }
        }
    }
}

function handleKeyDown(e) {
    switch (keyboard.getChar(e)) {
        case 'left':
            piece.moveLeft(grid);
            break;
        case 'right':
            piece.moveRight(grid);
            break;
        case 'up':
            break;
        case 'down':
            if (!downLock) {
                downPressed = true;
                downLock = true;
            }
            break;
        case 'a':
            piece.rotate(grid, 1);
            break;
        case 's':
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

class Piece {
    constructor(x, y, shape, color) {
        this.x = x;
        this.y = y;
        this.shape = shape;
        this.color = color;

        this.rotation = 0;
        this.stuck = false;
        this.width = shape[this.rotation][0].length;
        this.height = shape[this.rotation].length;
    }

    update(board) {
        if (this.stuck) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    if (board.get(this.x + x, this.y + y) !== 0 || !board.bounded(this.x + x, this.y + y)) {
                        if (this.shape[this.rotation][y][x] !== 0) {
                            return PieceResult.overflowed;
                        }
                    }
                }
            }
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    board.set(this.x + x, this.y + y, 
                        this.shape[this.rotation][y][x] | board.get(this.x + x, this.y + y));
                }
            }
            return PieceResult.placed;
        } else {
            this.y++;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    if (board.get(this.x + x, this.y + y) !== 0 || !grid.bounded(this.x + x, this.y + y)) {
                        if (this.shape[this.rotation][y][x] !== 0) {
                            this.y--;
                            this.stuck = true;
                            return PieceResult.free;
                        }
                    }
                }
            }
        }
        return PieceResult.free;
    }

    rotate(board, direction) {
        if (this.stuck) {
            return false;
        }
        this.rotation = (this.rotation + direction + 4) % 4;

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (board.get(this.x + x, this.y + y) !== 0 || !board.bounded(this.x + x, this.y + y)) {
                    if (this.shape[this.rotation][y][x] !== 0) {
                        this.rotation = (this.rotation - direction + 4) % 4;
                        return false;
                    }
                }
            }
        }
        return true;
    }

    moveLeft(board) {
        if (this.stuck) {
            return false;
        }
        // check if the piece is blocked by other pieces
        this.x--;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (board.get(this.x + x, this.y + y) !== 0 && this.shape[this.rotation][y][x] !== 0) {
                    this.x++;
                    return false;
                }
            }
        }

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (!board.bounded(this.x + x, this.y + y)) {
                    if (this.shape[this.rotation][y][x] !== 0) {
                        this.x++;
                        return false;
                    }
                }
            }
        }
        return true;
    }

    moveRight(board) {
        if (this.stuck) {
            return false;
        }
        this.x++;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (board.get(this.x + x, this.y + y) !== 0 && this.shape[this.rotation][y][x] !== 0) {
                    this.x--;
                    return false;
                }
            }
        }

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (!board.bounded(this.x + x, this.y + y)) {
                    if (this.shape[this.rotation][y][x] !== 0) {
                        this.x--;
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

function drawGrid(ctx) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var ps = canvas.width / grid.width;

    ctx.strokeStyle = 'grey';
    ctx.beginPath();
    for (var x = 0; x < grid.width; x++) {
        ctx.moveTo(x * ps, 0);
        ctx.lineTo(x * ps, canvas.height);
    }
    for (var y = 0; y < grid.height; y++) {
        ctx.moveTo(0, y * ps);
        ctx.lineTo(canvas.width, y * ps);
    }
    ctx.stroke();

    for (var i = 1; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        for (var y = 0; y < grid.height - 20; y++) {
            for (var x = 0; x < grid.width; x++) {
                if (grid.get(x, y + 20) === i) {
                    ctx.fillRect(x * ps, y * ps, ps, ps);
                }
            }
        }
    }
}
