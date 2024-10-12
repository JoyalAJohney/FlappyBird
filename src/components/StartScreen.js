import React from 'react';

const StartScreen = ({ onStart }) => {
    return (
        <div className="start-screen">
            <h1>Flappy Bird</h1>
            <button onClick={onStart}>Start Game</button>
        </div>
    );
};

export default StartScreen;