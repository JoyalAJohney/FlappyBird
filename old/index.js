const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to 90% of the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const birdImg = new Image();
birdImg.src = './assets/bird.png';

const bgImg = new Image();
bgImg.src = './assets/bg.webp';

const pipeNorthImg = new Image();
pipeNorthImg.src = './assets/pipes.png';

const pipeSouthImg = new Image();
pipeSouthImg.src = './assets/pipes.png';

// Load sounds
const hitSound = new Audio('./assets/hit.mp3');
const gameOver = new Audio('./assets/gameover.wav');
const flySound = new Audio('./assets/fly.mp3');
const scoreSound = new Audio('./assets/score.mp3');
const bgMusic = new Audio('./assets/music1.mp3');

let gameRunning = true;

const bird = {
    x: 800,
    y: 150,
    width: 50,
    height: 50,
    gravity: 0.6,
    lift: -5,
    velocity: 0
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 200;
const pipeFrequency = 150;
let frameCount = 0;
let score = 0;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        ctx.drawImage(pipeNorthImg, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(pipeSouthImg, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameRunning = false;
        displayGameOver();
    }
}

function updatePipes() {
    if (frameCount % pipeFrequency === 0) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap);
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - pipeGap,
            scored: false,
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 3.5;

        // Check if the bird has passed the pipe
        if (!pipes[i].scored && bird.x > pipes[i].x + pipeWidth) {
            score++;                
            scoreSound.play();      
            pipes[i].scored = true; 
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1); 
            // i--; 
        }

        if (bird.x < pipes[i].x + pipeWidth && bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)) {
            gameRunning = false;
            hitSound.play();
            bgMusic.pause();
            displayGameOver();
        }
    }
}

function resetGame() {
    gameOver.pause();
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frameCount = 0;
    gameRunning = true;
    gameLoop();
}


function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function displayGameOver() {
    gameOver.play();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Define the dimensions for the modal
    const modalWidth = 300;
    const modalHeight = 200;
    const modalX = canvas.width / 2 - modalWidth / 2;
    const modalY = canvas.height / 2 - modalHeight / 2;

    // Draw the modal background
    ctx.fillStyle = "#455a64";
    ctx.fillRect(modalX, modalY, modalWidth, modalHeight);

    // Draw the "Game Over" text
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over 😭", modalX + 50, modalY + 60);

    // Draw the score text
    ctx.font = "25px Arial";
    ctx.fillText("Score: " + score, modalX + 50, modalY + 100);

    // Draw the restart instruction
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Click to Restart", modalX + 50, modalY + 150);
}


function gameLoop() {
    if (gameRunning) {
        bgMusic.play();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();
        drawBird();
        drawPipes();
        drawScore();

        updateBird();
        updatePipes();

        frameCount++;
        requestAnimationFrame(gameLoop);
    }
}

canvas.addEventListener("click", function(event) {
    if (!gameRunning) {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;
        const modalWidth = 300;
        const modalHeight = 200;
        const modalX = canvas.width / 2 - modalWidth / 2;
        const modalY = canvas.height / 2 - modalHeight / 2;

        // Check if the click is within the modal bounds
        if (mouseX > modalX && mouseX < modalX + modalWidth &&
            mouseY > modalY && mouseY < modalY + modalHeight) {
            resetGame();
        }
    } else {
        bird.velocity = bird.lift;
        flySound.play();
    }
});


document.addEventListener("keydown", function(event) {
        bird.velocity = bird.lift;
        flySound.play();
});


gameLoop();
