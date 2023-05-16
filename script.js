const gameArea = document.querySelector('#game-area');
const gameAreaStyles = getComputedStyle(gameArea);
const gameAreaWidth = Number(gameAreaStyles.width.split('px')[0]);
const gameAreaHeight = Number(gameAreaStyles.height.split('px')[0]);

const food = document.querySelector('#food');
const foodStyles = getComputedStyle(food);

let snake = document.querySelector('#snake');
const currentStyles = getComputedStyle(snake);

const exitGame = document.querySelector('#game-over');
const gameOverAudio = document.querySelector('#game-over-audio');
const eatenFoodAudio = document.querySelector('#eaten-food');

const moveDisplay = document.querySelector('#moves');
const scoreDisplay = document.querySelector('#score');

let currentInterval;
let moves = 0;
let score = 0;
const scorePerMove = 5;

const gameAreaBounds = {
    top: Number(gameAreaStyles.top.split('px')[0]),
    left: Number(gameAreaStyles.left.split('px')[0]),
    right: Number(gameAreaStyles.right.split('px')[0]),
    bottom: Number(gameAreaStyles.bottom.split('px')[0]),
};

function getRandomPosition() {
    const foodWidth = Number(foodStyles.width.split('px')[0]);
    const foodHeight = Number(foodStyles.height.split('px')[0]);
  
    const maxX = gameAreaWidth - foodWidth;
    const maxY = gameAreaHeight - foodHeight;
  
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
  
    return { x: randomX, y: randomY };
  }

function positionFood(){
    const { x, y } = getRandomPosition();
    food.style.left = x + 'px';
    food.style.top = y + 'px';
}

positionFood();

document.addEventListener('keyup', (event) => {
    const {key} = event;
    const speed = 100;

    function stopGame() {
        return clearInterval(currentInterval);
    }
    
    function moveSnake(direction) {
        return () => {
            const width = Number(currentStyles.width.split('px')[0]);
            const height = Number(currentStyles.height.split('px')[0]);
            const distance = 7.5;

            function moveVertically() {
                if (width > height) {
                    snake.style.height = width + 'px';
                    snake.style.width = height + 'px';
                }
            }

            function movehorizontally() {  
                if (height > width) {
                    snake.style.width = height + 'px';
                    snake.style.height = width + 'px';
                }
            }

            const left = Number(currentStyles.left.split('px')[0]);
            const top = Number(currentStyles.top.split('px')[0]);
            const right = Number(currentStyles.right.split('px')[0]);
            const bottom = Number(currentStyles.bottom.split('px')[0]);

            const gameOver = (gameAreaBounds.top >= top) || (gameAreaBounds.left >= left) || 
                             (gameAreaBounds.bottom >= bottom) || (gameAreaBounds.right >= right);

            if (gameOver) {
                stopGame();
                gameOverAudio.play();
                exitGame.style.display = 'inline-block';
                exitGame.style['animation-name'] = 'gameOver';
                exitGame.style['animation-duration'] = '4s';

                return;
            }

            function growSnake() {
                if (direction === 'left' || direction === 'right') {
                    snake.style.width = (width + scorePerMove) + 'px';
                } else{
                    snake.style.height = (height + scorePerMove) + 'px';
                }
            }

            const foodDimension = food.getBoundingClientRect(); 
            const snakeDimension = snake.getBoundingClientRect();
            const foodHorizontal = Math.floor(foodDimension.x);
            const foodVertical = Math.floor(foodDimension.y);
            const snakeHorizontal = Math.floor(snakeDimension.x);
            const snakeVertical = Math.floor(snakeDimension.y);
            const horizontalDifference = Math.abs(snakeHorizontal - foodHorizontal);
            const verticalDifference = Math.abs(snakeVertical - foodVertical);
            const eatenFood = horizontalDifference <= (distance) && 
                              verticalDifference <= (distance);

            if (eatenFood) {
                eatenFoodAudio.play();
                positionFood();
                moves = moves + 1;
                score = score + scorePerMove;
                moveDisplay.textContent = moves;
                scoreDisplay.textContent = score;
                growSnake();
            }

            if (direction === 'right'){
                snake.style.left = (left + distance) + 'px';
                movehorizontally();
            } else if (direction === 'left') {
                snake.style.left = (left - distance) + 'px';
                movehorizontally();
            } else if (direction === 'up') {
                snake.style.top = (top - distance) + 'px';
                moveVertically();
            } else {
                snake.style.top = (top + distance) + 'px';
                moveVertically();
            }
        }
    }

    if (currentInterval) stopGame();
    if (key === 'ArrowUp') currentInterval = setInterval(moveSnake('up'), speed);
    if (key === 'ArrowDown')currentInterval = setInterval(moveSnake('down'), speed);
    if (key === 'ArrowLeft') currentInterval = setInterval(moveSnake('left'), speed);
    if (key === 'ArrowRight') currentInterval = setInterval(moveSnake('right'), speed);
});