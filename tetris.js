class Game {
    constructor(level) {
        this.score = 0;
        this.level = level;
        this.board = new Board(10, 40);
        this.nextPiece = this.randomPiece();
        this.piece = this.randomPiece();
        this.linesCleared = 0;
        
        this.gravities = [
            48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 
            5,  5,  5,  4,  4,  4,  3,  3,  3, 2,
            2,  2,  2,  2,  2,  2,  2,  2,  2, 1
        ];
    }
    
    randomPiece() {
        var i = Math.floor(Math.random() * 7);
        return new Piece(5, 19, shapes[i], colors[i + 1]);
    }
} 

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

    blocked(board, x, y) {
        return (
            (board.get(this.x + x, this.y + y) !== 0
                || !board.bounded(this.x + x, this.y + y))
            && this.shape[this.rotation][y][x] !== 0
        );
    }

    update(board) {
        if (this.stuck) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    if (this.blocked(board, x, y)) {
                        return PieceResult.overflowed;
                    }
                    board.set(this.x + x, this.y + y, 
                        this.shape[this.rotation][y][x] | board.get(this.x + x, this.y + y));
                }
            }
            return PieceResult.placed;
        } else {
            this.y++;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    if (this.blocked(board, x, y)) {
                        this.y--;
                        this.stuck = true;
                        return PieceResult.free;
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
                if (this.blocked(board, x, y)) {
                    this.rotation = (this.rotation - direction + 4) % 4;
                    return false;
                }
            }
        }
        return true;
    }

    // Move horizontally, 1 for right, -1 for left
    move(board, direction) {
        if (this.stuck) {
            return false;
        }
        // check if the piece is blocked by other pieces
        this.x += direction;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.blocked(board, x, y)) {
                    this.x -= direction;
                    return false;
                }
            }
        }
        return true;
    }
}

