// storage.js — Manejo de puntajes en LocalStorage y ranking visible
const STORAGE_KEY = 'snakeRomano_scores';

function saveScore(playerName, score, level) {
    const scores = getScores();

    // Se guarda una partida con jugador, puntos, nivel alcanzado y fecha.
    scores.push({
        player: playerName,
        score,
        level,
        date: new Date().toLocaleDateString('es-AR'),
    });

    // Ordena de mayor a menor y conserva solo los 10 mejores resultados.
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 10)));
}

function getScores() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function clearScores() {
    localStorage.removeItem(STORAGE_KEY);
    renderRanking();
}

function renderRanking() {
    const rankingLists = document.querySelectorAll('[data-ranking-list]');
    const scores = getScores();

    rankingLists.forEach((list) => {
        list.innerHTML = '';

        if (scores.length === 0) {
            list.innerHTML = '<li class="ranking-empty">Todavía no hay puntajes guardados.</li>';
            return;
        }

        scores.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'ranking-item';
            li.innerHTML = `
                <span class="ranking-position">#${index + 1}</span>
                <span class="ranking-player">${item.player}</span>
                <span class="ranking-score">${item.score} pts</span>
                <span class="ranking-level">Nivel ${item.level}</span>
                <span class="ranking-date">${item.date}</span>
            `;
            list.appendChild(li);
        });
    });
}