// food.js — Manejo de comida
// La comida cambia según el jugador: pizza para Italia y mate para Argentina.

class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.type = 'pizza';
    }

    randomize(cols, rows, snakeBody) {
        let newPosition;
        let positionIsValid = false;

        while (!positionIsValid) {
            newPosition = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
            };

            positionIsValid = !snakeBody.some((part) => {
                return part.x === newPosition.x && part.y === newPosition.y;
            });
        }

        this.x = newPosition.x;
        this.y = newPosition.y;
    }

    setTypeByPlayer(playerNumber) {
        if (playerNumber === 1) {
            this.type = 'pizza';
        } else {
            this.type = 'mate';
        }
    }
}