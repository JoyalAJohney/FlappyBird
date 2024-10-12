import React from 'react';

const GameOver = ({ score, onRestart }) => {
    return (
        <div className="game-over">
            <h2>Game Over 😭</h2>
            <p>Score: {score}</p>
            <button onClick={onRestart}>Restart</button>
        </div>
    );
};

export default GameOver;