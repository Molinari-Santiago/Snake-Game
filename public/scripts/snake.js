// snake.js — Clase Snake
// Cada jugador tiene su propia serpiente, puntaje y nivel actual.

class Snake {
    constructor(playerNumber, startX, startY, color) {
        this.playerNumber = playerNumber;
        this.startX = startX;
        this.startY = startY;
        this.color = color;

        this.reset();
    }

    reset() {
        this.body = [
            { x: this.startX, y: this.startY },
            { x: this.startX - 1, y: this.startY },
            { x: this.startX - 2, y: this.startY },
        ];

        this.score = 0;
        this.levelIndex = 0;
        this.alive = true;
    }

    move(direction, shouldGrow) {
        const head = { ...this.body[0] };

        if (direction === 'UP') head.y--;
        if (direction === 'DOWN') head.y++;
        if (direction === 'LEFT') head.x--;
        if (direction === 'RIGHT') head.x++;

        // Agrega la nueva cabeza al principio del array.
        this.body.unshift(head);

        // Si no comió, se elimina la cola para mantener el largo.
        if (!shouldGrow) {
            this.body.pop();
        }
    }

    growAndScore(points) {
        this.score += points;
    }

    getCurrentLevel() {
        return SNAKE_LEVELS[this.levelIndex];
    }

    levelUpIfNeeded() {
        // Cada 50 puntos sube de nivel, hasta llegar al nivel máximo.
        const nextLevelIndex = Math.floor(this.score / 50);

        if (
            nextLevelIndex > this.levelIndex &&
            nextLevelIndex < SNAKE_LEVELS.length
        ) {
            this.levelIndex = nextLevelIndex;
            return true;
        }

        return false;
    }
}