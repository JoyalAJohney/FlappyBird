import birdImg from '../assets/bird.png';
import pipeImg from '../assets/pipes.png';
import bgImg from '../assets/bg.webp';

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

export const loadImages = async () => {
    const [bird, pipe, bg] = await Promise.all([
        loadImage(birdImg),
        loadImage(pipeImg),
        loadImage(bgImg)
    ]);
    return ({ bird, pipe, bg });
};