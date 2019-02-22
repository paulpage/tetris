var grid;
var piece;
var lost = false;
var frame = 0;

var PieceResult = Object.freeze({
    free: 0,
    placed: 1,
    overflowed: 2
});

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
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [1,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [0,1,0,0],
            [1,1,0,0],
            [0,0,0,0]
        ], [
            [1,0,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ], [
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [1,1,1,0],
            [1,0,0,0],
            [0,0,0,0]
        ], [
            [1,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ], [
            [0,0,1,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,1,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [0,1,1,0],
            [1,1,0,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [0,1,1,0],
            [1,1,0,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [1,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ], [
            [0,1,0,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ]
    ], [
        [
            [0,0,0,0],
            [1,1,0,0],
            [0,1,1,0],
            [0,0,0,0]
        ], [
            [0,0,1,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ], [
            [0,0,0,0],
            [1,1,0,0],
            [0,1,1,0],
            [0,0,0,0]
        ], [
            [0,0,1,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ]
    ]
];

window.onload = function() {

    // grid = newGrid(10, 20)
    grid = new Board(10, 20);

    canvas.init();
    canvas.setSize(200, 400);

    canvas.ctx.fillStyle = 'black';
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.addEventListener('keydown', handleKeyboard);

    piece = new Piece(3, 0, shapes[0]);

    window.requestAnimationFrame(update)
}
function update() {
    canvas.draw();

    drawGrid(canvas.ctx);
    drawPiece(canvas.ctx, grid, piece);

    frame = (frame + 1) % 10;
    if (frame === 0) {
        var linesCleared = 0;
        var state = piece.update(grid);
        switch (state) {
            case PieceResult.free:
                break;
            case PieceResult.placed:
                piece = new Piece(0, 0, shapes[Math.floor(Math.random() * 7)]);
                break;
            case PieceResult.overflowed:
                lost = true;
                break;
        }
        var rowsCleared = 0;
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
                rowsCleared++;
            }
        }
    }

    if (!lost) {
        window.requestAnimationFrame(update)
    }
}

function drawPiece(ctx, board, piece) {
    var cellSize = canvas.width / grid.width;
    ctx.fillStyle = 'red';
    for (var y = 0; y < piece.height; y++) {
        for (var x = 0; x < piece.width; x++) {
            if (piece.shape[piece.rotation][y][x] !== 0) {
                ctx.fillRect((piece.x + x) * cellSize, (piece.y + y) * cellSize, cellSize, cellSize);
            }
        }
    }
}

function handleKeyboard(e) {
    switch (keyboard.getChar(e)) {
        case 'left':
            piece.moveLeft(grid);
            break;
        case 'right':
            piece.moveRight(grid);
            break;
        case 'up':
            console.log('up');
            break;
        case 'down':
            console.log('down');
            break;
        case 'a':
            piece.rotate(grid, 1);
            break;
    }
}

class Piece {
    constructor(x, y, shape) {
        this.x = x;
        this.y = y;
        this.shape = shape;

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
        this.rotation = (this.rotation + direction) % 4;

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
    ctx.fillStyle = 'black';
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

    ctx.fillStyle = 'red';
    for (var y = 0; y < grid.height; y++) {
        for (var x = 0; x < grid.width; x++) {
            if (grid.get(x, y) != 0) {
                ctx.fillRect(x * ps, y * ps, ps, ps);
            }
        }
    }
}
