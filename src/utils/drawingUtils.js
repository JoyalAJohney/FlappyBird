
export const drawGame = (ctx, gameState, images, canvasWidth, canvasHeight) => {
    drawBackground(ctx, images.bg, canvasWidth, canvasHeight);
    drawPipes(ctx, gameState.pipes, images.pipe, canvasHeight);
    drawBird(ctx, gameState.bird, images.bird);
    drawScore(ctx, gameState.score);
};


const drawBird = (ctx, bird, birdImage) => {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
};


const drawPipes = (ctx, pipes, pipeImage, canvasHeight) => {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.top);
        ctx.drawImage(pipeImage, pipe.x, canvasHeight - pipe.bottom, pipe.width, pipe.bottom);
    });
};


const drawBackground = (ctx, bgImage, canvasWidth, canvasHeight) => {
    ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
};


const drawScore = (ctx, score) => {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
};