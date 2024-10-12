
const GRAVITY = 0.6;
const PIPE_WIDTH = 50;
const PIPE_GAP = 200;
const PIPE_FREQUENCY = 150;

export const updateGameState = (prevState, canvasWidth, canvasHeight) => {
    
    const newBird = { 
        ...prevState.bird, 
        velocity: prevState.bird.velocity + GRAVITY, 
        y: prevState.bird.y + prevState.bird.velocity
    };

    
    let newPipes = prevState.pipes.map(pipe => ({ 
        ...pipe, 
        x: pipe.x - 3.5
    }));

    
    if (prevState.frameCount % PIPE_FREQUENCY === 0) {
        const pipeHeight = Math.random() * (canvasHeight - PIPE_GAP);
        newPipes.push({
            x: canvasWidth,
            top: pipeHeight,
            bottom: canvasHeight - pipeHeight - PIPE_GAP,
            width: PIPE_WIDTH,
            scored: false,
        });
    }

    newPipes = newPipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

    let newScore = prevState.score;
    let gameOver = false;


    for (const pipe of newPipes) {

        if (!pipe.scored && newBird.x > pipe.x + PIPE_WIDTH) {
            newScore++;
            pipe.scored = true;
        }

        if (
            newBird.x < pipe.x + PIPE_WIDTH &&
            newBird.x + newBird.width > pipe.x &&
            (newBird.y < pipe.top || newBird.y + newBird.height > canvasHeight - pipe.bottom)
        ) {
            gameOver = true;
            break;
        }
    }

    if (newBird.y + newBird.height > canvasHeight || newBird.y < 0) {
        gameOver = true;
    }

    return {
        ...prevState,
        bird: newBird,
        pipes: newPipes,
        score: newScore,
        gameRunning: !gameOver,
        gameOver: gameOver,
        frameCount: prevState.frameCount + 1,
    };
};