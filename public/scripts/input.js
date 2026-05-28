// input.js — Controles de teclado y controles táctiles
// Este archivo se encarga únicamente de leer entradas del usuario.

class InputHandler {
    constructor() {
        this.currentDirection = 'RIGHT';
        this.nextDirection = 'RIGHT';

        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();

            // Controles del Jugador 1: Italia
            if (game.currentPlayer === 1) {
                if (key === 'w') this.setDirection('UP');
                if (key === 's') this.setDirection('DOWN');
                if (key === 'a') this.setDirection('LEFT');
                if (key === 'd') this.setDirection('RIGHT');
            }

            // Controles del Jugador 2: Argentina
            if (game.currentPlayer === 2) {
                if (event.key === 'ArrowUp') this.setDirection('UP');
                if (event.key === 'ArrowDown') this.setDirection('DOWN');
                if (event.key === 'ArrowLeft') this.setDirection('LEFT');
                if (event.key === 'ArrowRight') this.setDirection('RIGHT');
            }

            // Pausa general del juego
            if (key === 'p' || key === 'escape') {
                if (game.state === 'PLAYING') {
                    game.setState('PAUSED');
                } else if (game.state === 'PAUSED') {
                    game.setState('PLAYING');
                }
            }
        });
    }

    setupTouchControls() {
        const buttons = document.querySelectorAll('[data-touch-dir]');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const direction = button.dataset.touchDir;
                this.setDirection(direction);
                soundManager.play('click');
            });
        });
    }

    setDirection(direction) {
        // Evita que la serpiente gire directamente hacia el lado contrario.
        const oppositeDirections = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
        };

        if (oppositeDirections[direction] === this.currentDirection) {
            return;
        }

        this.nextDirection = direction;
    }

    updateDirection() {
        this.currentDirection = this.nextDirection;
    }

    reset() {
        this.currentDirection = 'RIGHT';
        this.nextDirection = 'RIGHT';
    }
}