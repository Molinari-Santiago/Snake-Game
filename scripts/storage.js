// storage.js — Manejo de puntajes en LocalStorage
const STORAGE_KEY = 'snakeRomano_scores';

function saveScore(playerName, score, level) {
    const scores = getScores();
    scores.push({ player: playerName, score, level, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 10)));
}

function getScores() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
}

function clearScores() {
    localStorage.removeItem(STORAGE_KEY);
}
