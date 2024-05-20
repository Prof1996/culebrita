const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let level = 1;
let gameSpeed = 100;
let game;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const messagesElement = document.getElementById("messages");

document.addEventListener("keydown", changeDirection);
document.getElementById("restart").addEventListener("click", restartGame);

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
        if (deltaX > 0 && direction !== "LEFT") {
            direction = "RIGHT";
        } else if (deltaX < 0 && direction !== "RIGHT") {
            direction = "LEFT";
        }
    } else {
        if (deltaY > 0 && direction !== "UP") {
            direction = "DOWN";
        } else if (deltaY < 0 && direction !== "DOWN") {
            direction = "UP";
        }
    }
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key == 37 && direction != "RIGHT") direction = "LEFT";
    else if (key == 38 && direction != "DOWN") direction = "UP";
    else if (key == 39 && direction != "LEFT") direction = "RIGHT";
    else if (key == 40 && direction != "UP") direction = "DOWN";
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerText = score;
        food = generateFood();
        showMessage("¡Comida!");
        if (score % 5 === 0) {
            level++;
            gameSpeed -= 10;
            clearInterval(game);
            game = setInterval(draw, gameSpeed);
            levelElement.innerText = level;
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        showMessage("¡Perdiste! Presiona Reiniciar para jugar de nuevo.");
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    food = generateFood();
    score = 0;
    level = 1;
    gameSpeed = 100;
    scoreElement.innerText = score;
    levelElement.innerText = level;
    clearInterval(game);
    game = setInterval(draw, gameSpeed);
    showMessage("¡Empieza el juego! Usa las flechas o desliza para mover la culebra.");
}

function showMessage(message) {
    messagesElement.innerText = message;
    setTimeout(() => {
        messagesElement.innerText = "";
    }, 2000);
}

restartGame();
