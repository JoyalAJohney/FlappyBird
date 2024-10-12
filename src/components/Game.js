import React, { useRef, useEffect, useState, useCallback } from 'react';
import GameOver from './GameOver';
import { drawGame } from '../utils/drawingUtils';
import { loadImages } from '../utils/imageUtils';
import { initSounds, playSound, stopSound } from '../utils/soundUtils';
import { updateGameState } from '../utils/gameLogic';

const Game = () => {
    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null);
    const gameStateRef = useRef(null);
    const [images, setImages] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);


    const initGameState = () => ({
        bird: { x: 200, y: 150, width: 50, height: 50, velocity: 0 },
        pipes: [],
        score: 0,
        gameRunning: true,
        gameOver: false,
        frameCount: 0
    });



    useEffect(() => {
        loadImages().then(loadedImages => {
            setImages(loadedImages);
            initSounds();
        });

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, []);



    const gameLoop = useCallback(() => {
        if (!gameStateRef.current || !gameStateRef.current.gameRunning) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Unable to get 2D context');
            return;
        }

        try {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGame(ctx, gameStateRef.current, images, canvas.width, canvas.height);
            
            const newState = updateGameState(gameStateRef.current, canvas.width, canvas.height);

            if (newState.score > gameStateRef.current.score) {
                playSound('score');
            }

            gameStateRef.current = newState;

            // Update the score state, but don't trigger a re-render
            setScore(s => {
                if (s !== newState.score) {
                    return newState.score;
                }
                return s;
            });

            if (newState.gameOver) {
                setGameOver(true);
                playSound('hit');
                stopSound('bgMusic');
                setTimeout(() => playSound('gameOver'), 500);
                return;
            }

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        } catch (error) {
            console.error('Error in game loop:', error);
            cancelAnimationFrame(gameLoopRef.current);
        }
    }, [images]);



    useEffect(() => {
        if (!images) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        gameStateRef.current = initGameState();
        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => {
            // Clean up methods
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(gameLoopRef.current);
            stopSound('bgMusic')
        };
    }, [images, gameLoop]);



    const handleClick = useCallback(() => {
        if (!gameOver && gameStateRef.current) {
            playSound('bgMusic');
            gameStateRef.current.bird.velocity = -5;
            playSound('fly');
        }
    }, [gameOver]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                handleClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClick]);



    const handleRestart = useCallback(() => {
        gameStateRef.current = initGameState();
        setScore(0);
        setGameOver(false);
        playSound('bgMusic');
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [gameLoop]);


    return (
        <div onClick={handleClick}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
            {gameOver && <GameOver score={score} onRestart={handleRestart} />}
        </div>
    );
};

export default Game;