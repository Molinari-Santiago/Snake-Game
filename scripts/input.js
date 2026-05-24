// input.js — Controles de teclado para Snake Romano (Turn-based)
const DIR = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };
const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

function initInput(game) {
    document.addEventListener('keydown', (e) => {
        if (game.state !== 'PLAYING' && game.state !== 'PAUSED' && game.state !== 'MENU') return;

        switch (e.key) {
            // P1 — Italia (WASD) - Solo si es su turno
            case 'w': case 'W': if (game.currentPlayer === 1) { game.hasStartedMoving = true; trySetDir(game.snake1, DIR.UP); }    break;
            case 's': case 'S': if (game.currentPlayer === 1) { game.hasStartedMoving = true; trySetDir(game.snake1, DIR.DOWN); }  break;
            case 'a': case 'A': if (game.currentPlayer === 1) { game.hasStartedMoving = true; trySetDir(game.snake1, DIR.LEFT); }  break;
            case 'd': case 'D': if (game.currentPlayer === 1) { game.hasStartedMoving = true; trySetDir(game.snake1, DIR.RIGHT); } break;
            
            // P2 — Argentina (Flechas) - Solo si es su turno
            case 'ArrowUp':    if (game.currentPlayer === 2) { game.hasStartedMoving = true; trySetDir(game.snake2, DIR.UP); }    e.preventDefault(); break;
            case 'ArrowDown':  if (game.currentPlayer === 2) { game.hasStartedMoving = true; trySetDir(game.snake2, DIR.DOWN); }  e.preventDefault(); break;
            case 'ArrowLeft':  if (game.currentPlayer === 2) { game.hasStartedMoving = true; trySetDir(game.snake2, DIR.LEFT); }  e.preventDefault(); break;
            case 'ArrowRight': if (game.currentPlayer === 2) { game.hasStartedMoving = true; trySetDir(game.snake2, DIR.RIGHT); } e.preventDefault(); break;
            
            // Controles globales
            case 'Escape': case 'p': case 'P':
                if (game.state === 'PLAYING') {
                    game.setState('PAUSED');
                    document.getElementById('pauseTitle').textContent = 'PAUSA';
                    document.getElementById('pauseSubtitle').textContent = 'La batalla está en espera...';
                    const btn = document.getElementById('pauseBtn');
                    btn.textContent = '▶ CONTINUAR';
                    btn.onclick = () => game.setState('PLAYING');
                    document.getElementById('pauseRestartBtn').style.display = 'inline-block';
                }
                else if (game.state === 'PAUSED') {
                    game.setState('PLAYING');
                }
                break;
        }
    });
}

function trySetDir(snake, dir) {
    if (!snake || !snake.alive) return;
    if (dir !== OPPOSITE[snake.direction]) {
        snake.nextDir = dir;
    }
}
