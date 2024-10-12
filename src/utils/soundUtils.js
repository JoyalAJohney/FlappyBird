import hitSound from '../assets/hit.mp3';
import gameOverSound from '../assets/gameover.wav';
import flySound from '../assets/fly.mp3';
import scoreSound from '../assets/score.mp3';
import bgMusic from '../assets/music1.mp3';

const sounds = {};

export const initSounds = () => {
    sounds.hit = new Audio(hitSound);
    sounds.gameOver = new Audio(gameOverSound);
    sounds.fly = new Audio(flySound);
    sounds.score = new Audio(scoreSound);
    sounds.bgMusic = new Audio(bgMusic);
};

export const playSound = (soundName) => {
    if (sounds[soundName]) {
        sounds[soundName].play().catch(error => {
            console.log(`Error playing ${soundName} sound:`, error);
        });
    }
};

export const stopSound = (soundName) => {
    if (sounds[soundName]) {
        sounds[soundName].pause();
        sounds[soundName].currentTime = 0;
    }
};