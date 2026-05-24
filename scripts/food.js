// food.js — Clase Food (pizza para P1, mate para P2)
class Food {
    constructor(emoji, color) {
        this.emoji = emoji;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.pulse = 0; // animación de pulso
    }

    spawn(cols, rows, snake1, snake2) {
        let tries = 0;
        do {
            this.x = Math.floor(Math.random() * (cols - 2)) + 1;
            this.y = Math.floor(Math.random() * (rows - 2)) + 1;
            tries++;
        } while (
            tries < 200 &&
            (snake1.occupies(this.x, this.y) || snake2.occupies(this.x, this.y))
        );
    }

    update() {
        this.pulse += 0.1;
    }

    isAt(x, y) {
        return this.x === x && this.y === y;
    }
}
