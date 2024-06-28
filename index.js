const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake;
let food;
let score;
let highScore = localStorage.getItem('highScore') || 0;
let direction;
let gameLoop;
let changingDirection = false;
let gameSpeed = 150;

highScoreElement.textContent = highScore;

const initGame = () => {
    snake = [
        { x: 160, y: 160 },
        { x: 140, y: 160 },
        { x: 120, y: 160 },
        { x: 100, y: 160 },
        { x: 80, y: 160 }
    ];
    food = getRandomFoodPosition();
    score = 0;
    direction = { x: 0, y: 0 };
    gameSpeed = 150;
    scoreElement.textContent = score;
    clearInterval(gameLoop);
    drawGame();
};

const startGame = () => {
    direction = { x: gridSize, y: 0 };
    gameLoop = setInterval(updateGame, gameSpeed); // Aumentar el intervalo para reducir la velocidad
};

const updateGame = () => {
    if (didGameEnd()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = highScore;
        }
        alert('¡Game Over!');
        initGame();
        return;
    }

    changingDirection = false;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = getRandomFoodPosition();
        increaseSpeed();
    } else {
        snake.pop();
    }

    drawGame();
};

const increaseSpeed = () => {
    if (gameSpeed > 50) {
        gameSpeed -= 5;
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, gameSpeed);
    }
};



const drawGame = () => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = '#A1DD70';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
};

const didGameEnd = () => {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvasSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvasSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
};

const getRandomFoodPosition = () => {
    let foodX, foodY;
    while (true) {
        foodX = getRandomInt(0, canvasSize / gridSize) * gridSize;
        foodY = getRandomInt(0, canvasSize / gridSize) * gridSize;
        if (!snake.some(part => part.x === foodX && part.y === foodY)) {
            return { x: foodX, y: foodY };
        }
    }
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const changeDirection = (event) => {
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.key;
    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    switch (keyPressed) {
        case 'ArrowUp':
            if (!goingDown) {
                direction = { x: 0, y: -gridSize };
            }
            break;
        case 'ArrowDown':
            if (!goingUp) {
                direction = { x: 0, y: gridSize };
            }
            break;
        case 'ArrowLeft':
            if (!goingRight) {
                direction = { x: -gridSize, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (!goingLeft) {
                direction = { x: gridSize, y: 0 };
            }
            break;
    }
};

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', initGame);

// Mobile controls
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            if (direction.x === 0) direction = { x: -gridSize, y: 0 }; // Left swipe
        } else {
            if (direction.x === 0) direction = { x: gridSize, y: 0 }; // Right swipe
        }
    } else {
        if (yDiff > 0) {
            if (direction.y === 0) direction = { x: 0, y: -gridSize }; // Up swipe
        } else {
            if (direction.y === 0) direction = { x: 0, y: gridSize }; // Down swipe
        }
    }
    changingDirection = true;
    xDown = null;
    yDown = null;
}

initGame();


