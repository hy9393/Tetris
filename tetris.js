class Tetris {
    constructor(imageX, imageY, template) {
        this.imageY = imageY;
        this.imageX = imageX;
        this.template = template;
        this.x = squareCountX / 2;
        this.y = 0;
    }

    checkBottom() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realY + 1 >= squareCountY) {
                    return false;
                }
                if (gameMap[realY + 1][realX].imageX != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    getTruncedPosition() {
        return {x: Math.trunc(this.x), y: Math.trunc(this.y)}
    }

    checkLeft() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX - 1 < 0) {
                    return false;
                }

                if (gameMap[realY][realX - 1].imageX != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    checkRight() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX + 1 >= squareCountX) {
                    return false;
                }

                if (gameMap[realY][realX - 1].imageX != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    moveRight() {
        if (this.checkRight()) {
            this.x += 1;
        }
    }

    moveLeft() {
        if (this.checkLeft()) {
            this.x -= 1;
        }
    }

    moveBottom() {
        if (this.checkBottom()) {
            this.y += 1;
        }
    }

    moveBottomDirectly() {
        if (this.checkBottom()) {
            let yToMove = 100;
            for (let i = 0; i < this.template.length; i++) {
                for (let j = 0; j < this.template.length; j++) {
                    if (this.template[i][j] == 0) continue;
                    let realX = i + this.getTruncedPosition().x;
                    let realY = j + this.getTruncedPosition().y;
                    let tempYToMove = 100;

                    for (let k = 1; k < squareCountY - realY; k++) {
                        if (gameMap[realY + k][realX].imageX != -1) {
                            tempYToMove = k;
                            break;
                        }
                    }
                    if (tempYToMove == 100) {
                        tempYToMove = squareCountY - realY;
                    }
                    yToMove = Math.min(yToMove, tempYToMove);
                }
            }

            this.y += yToMove - 1;

            for (let k = 0; k < currentShape.template.length; k++) {
                for (let l = 0; l < currentShape.template.length; l++) {
                    if (currentShape.template[k][l] == 0) continue;
                    gameMap[currentShape.getTruncedPosition().y + l][currentShape.getTruncedPosition().x + k] = 
                        {imageX: currentShape.imageX, imageY: currentShape.imageY};
                }
            }
    
            deleteCompleteRows();
            currentShape = nextShape;
            nextShape = getRandomshape();
            if (!currentShape.checkBottom()) {
                gameOver = true;
            }
        }
    }

    changeRotation() {
        let tempTemplate = [];
        let n = this.template.length;
        for (let i = 0; i < n; i++)
            tempTemplate[i] = this.template[i].slice()
        for (let layer = 0; layer < n/2; layer++) {
            let first = layer;
            let last = n - 1 - layer;
            for (let i = first; i < last; i++) {
                let offset = i - first;
                let top = this.template[first][i];
                this.template[first][i] = this.template[i][last];
                this.template[i][last] = this.template[last][last-offset];
                this.template[last][last-offset] = this.template[last-offset][first];
                this.template[last-offset][first] = top;
            }
        }
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (rrealX < 0 || realX >= squareCountX || realY < 0 || realY >= squareCountY) {
                    this.template = tempTemplate;
                    return false;
                }
            }
        }
    }
}

const imageSquareSize = 24;
const size = 40;
const gameSpeed = 5;
const framePerSecond = 24;
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const levelCanvas = document.getElementById("levelCanvas");
const image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
const lctx = levelCanvas.getContext("2d");
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

const shapes = [
    new Tetris(0, 120, [
        [0,1,0],
        [0,1,0],
        [1,1,0],
    ]),
    new Tetris(0, 96, [
        [0,0,0],
        [1,1,1],
        [0,1,0],
    ]),
    new Tetris(0, 72, [
        [0,1,0],
        [0,1,0],
        [0,1,1],
    ]),
    new Tetris(0, 48, [
        [0,0,0],
        [0,1,1],
        [1,1,0],
    ]),
    new Tetris(0, 24, [
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
    ]),
    new Tetris(0, 0, [
        [1,1],
        [1,1],
    ]),
    new Tetris(0, 48, [
        [0,0,0],
        [1,1,0],
        [0,1,1],
    ]),
];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let ScoreForLevelup = 5;
let level;
let initial2DArr;
let whiteLineThickness = 4;

let gameLoop = () => {
    setInterval(update, 1000/gameSpeed)
    setInterval(draw, 1000/framePerSecond)
}

let deleteCompleteRows = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        let isComplete = true;
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) isComplete = false;
        }
        if (isComplete) {
            console.log("complete row");
            for (let k = i; k > 0; k--) {
                gameMap[k] = gameMap[k-1];
            }
            let temp = [];
            for (let j = 0; j < squareCountX; j++) {
                temp.push({imageX: -1, imageY: -1});
            }
            gameMap[0] = temp;
            score += 1;
        }
        if (score >= ScoreForLevelup) {
            initial2DArr = []
            for (let i = 0; i < squareCountY; i++) {
                let temp = [];
                for (let j = 0; j < squareCountX; j++) {
                    temp.push({imageX: -1, imageY: -1 });
                }
                initial2DArr.push(temp);
            }
            gameMap = initial2DArr;
            score = 0;
            level += 1;
            ScoreForLevelup += 1;
        }  
    }
}

let update = () => {
    if (gameOver) return;
    if (currentShape.checkBottom()) {
        currentShape.y += 1;
    } else {
        for (let k = 0; k < currentShape.template.length; k++) {
            for (let l = 0; l < currentShape.template.length; l++) {
                if (currentShape.template[k][l] == 0) continue;
                gameMap[currentShape.getTruncedPosition().y + l][currentShape.getTruncedPosition().x + k] = 
                    {imageX: currentShape.imageX, imageY: currentShape.imageY};
            }
        }

        deleteCompleteRows();
        currentShape = nextShape;
        nextShape = getRandomshape();
        if (!currentShape.checkBottom()) {
            gameOver = true;
        }
    }
};

let drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

let drawBackground = () => {
    drawRect(0,0, canvas.width, canvas.height, "#bca0dc");
    for (let i = 0; i < squareCountX + 1; i++) {
        drawRect(size * i - whiteLineThickness, 0, 
            whiteLineThickness, canvas.height, "white");
    }

    for (let i = 0; i < squareCountY + 1; i++) {
        drawRect(0, size * i - whiteLineThickness, 
            canvas.width, whiteLineThickness, "white");
    }
}

let drawCurrentTetris = () => {
    for (let i = 0; i < currentShape.template.length; i++) {
        for (let j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] == 0) continue;
            ctx.drawImage(image, currentShape.imageX, currentShape.imageY, 
                imageSquareSize, imageSquareSize,
                Math.trunc(currentShape.x) * size + size * i,
                Math.trunc(currentShape.y) * size + size * j,
                size, size);
        }
    }
}

let drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) continue;
            ctx.drawImage(image, t[j].imageX, t[j].imageY, 
                imageSquareSize, imageSquareSize,
                j * size, i * size,
                size, size);
        }
    }
}

let drawNextShape = () => {
    nctx.fillStyle = "#bca0dc";
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (let i = 0; i < nextShape.template.length; i++) {
        for (let j = 0; j < nextShape.template.length; j++) {
            if (nextShape.template[i][j] == 0) continue;
            nctx.drawImage(image, nextShape.imageX, nextShape.imageY,
                imageSquareSize, imageSquareSize, 
                size * i, size * j + size, 
                size, size)
        }
    }
}

let drawScore = () => {
    sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    sctx.font = "20px Poppings";
    sctx.fillStyle = "black";
    sctx.fillText("Rows for levelup: " + (ScoreForLevelup - score), 10, 50);
}

let drawLevel = () => {
    lctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    lctx.font = "20px Poppings";
    lctx.fillStyle = "black";
    lctx.fillText("Level: " + level, 10, 50);
}

let drawGameOver = () => {
    ctx.font = "64px Poppings";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over!", 10, canvas.height/2);
}

let draw = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawBackground();
    drawSquares();
    drawCurrentTetris();
    drawNextShape();
    drawScore();
    drawLevel();
    if (gameOver) {
        drawGameOver();
    }
};


let getRandomshape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)])
}
let resetVars = () => {
    initial2DArr = []
    for (let i = 0; i < squareCountY; i++) {
        let temp = [];
        for (let j = 0; j < squareCountX; j++) {
            temp.push({imageX: -1, imageY: -1 });
        }
        initial2DArr.push(temp);
    }
    score = 0;
    level = 1;
    gameOver = false;
    currentShape = getRandomshape();
    nextShape = getRandomshape();
    gameMap = initial2DArr;
};

window.addEventListener("keydown", (event) => {
    if (event.keyCode == 37) currentShape.moveLeft();
    else if (event.keyCode == 38) currentShape.changeRotation()
    else if (event.keyCode == 39) currentShape.moveRight();
    else if (event.keyCode == 40) currentShape.moveBottom();
    else if (event.keyCode == 32) currentShape.moveBottomDirectly();
})

resetVars();
gameLoop();