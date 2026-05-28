// renderer.js — Dibujo del juego en el canvas
// Este archivo dibuja el mapa, la serpiente, la comida y los sprites.
// También mejora el cuerpo de la serpiente y achica la cabeza.

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Sprites de comida
        this.foodImages = {
            pizza: new Image(),
            mate: new Image(),
        };

        this.foodImages.pizza.src = 'assets/sprites/pizza.png';
        this.foodImages.mate.src = 'assets/sprites/mate.png';

        // Sprites de cabeza de cada jugador
        this.snakeHeads = {
            1: new Image(),
            2: new Image(),
        };

        this.snakeHeads[1].src = 'assets/sprites/snake-italia-head.png';
        this.snakeHeads[2].src = 'assets/sprites/snake-argentina-head.png';

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const wrapper = this.canvas.parentElement;
        const rect = wrapper.getBoundingClientRect();

        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getThemeValue(variableName) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
    }

    drawBoard(cols, rows) {
        const cellWidth = this.canvas.width / cols;
        const cellHeight = this.canvas.height / rows;

        // Fondo de arena
        this.ctx.fillStyle = this.getThemeValue('--canvas-bg') || '#c8a96e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grilla suave del coliseo
        this.ctx.strokeStyle = 'rgba(90, 50, 20, 0.18)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * cellWidth, 0);
            this.ctx.lineTo(x * cellWidth, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * cellHeight);
            this.ctx.lineTo(this.canvas.width, y * cellHeight);
            this.ctx.stroke();
        }

        // Borde externo del coliseo
        this.ctx.strokeStyle = '#6b3a1f';
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(4, 4, this.canvas.width - 8, this.canvas.height - 8);

        // Borde interno más fino
        this.ctx.strokeStyle = '#8b5e2a';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(12, 12, this.canvas.width - 24, this.canvas.height - 24);
    }

    getSnakeId(snake) {
        // Compatible con snake.playerNumber o snake.id.
        return snake.playerNumber || snake.id || 1;
    }

    getSnakeColors(snake) {
        const id = this.getSnakeId(snake);

        if (id === 1) {
            return {
                main: snake.color || '#009246',
                border: '#006b35',
                detail: '#f5f0e8',
                shadow: 'rgba(0, 80, 30, 0.28)',
            };
        }

        return {
            main: snake.color || '#74acdf',
            border: '#2b6ca3',
            detail: '#f5f0e8',
            shadow: 'rgba(0, 70, 120, 0.28)',
        };
    }

    roundedPath(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    drawBodySegment(snake, x, y, cellWidth, cellHeight, index) {
        const colors = this.getSnakeColors(snake);

        const sizeW = cellWidth * 0.82;
        const sizeH = cellHeight * 0.82;

        const innerX = x + (cellWidth - sizeW) / 2;
        const innerY = y + (cellHeight - sizeH) / 2;

        const radius = Math.min(sizeW, sizeH) * 0.28;

        // Sombra inferior del cuerpo
        this.ctx.save();
        this.ctx.fillStyle = colors.shadow;
        this.ctx.beginPath();
        this.ctx.ellipse(
            x + cellWidth / 2,
            y + cellHeight * 0.72,
            sizeW * 0.38,
            sizeH * 0.16,
            0,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.restore();

        // Base redondeada del cuerpo
        this.ctx.save();
        this.roundedPath(innerX, innerY, sizeW, sizeH, radius);
        this.ctx.fillStyle = colors.main;
        this.ctx.fill();

        // Borde del segmento
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = colors.border;
        this.ctx.stroke();

        // Brillo superior
        this.roundedPath(
            innerX + sizeW * 0.10,
            innerY + sizeH * 0.08,
            sizeW * 0.80,
            sizeH * 0.28,
            radius * 0.7
        );
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        this.ctx.fill();

        // Franja clara central
        this.roundedPath(
            innerX + sizeW * 0.18,
            innerY + sizeH * 0.34,
            sizeW * 0.64,
            sizeH * 0.24,
            radius * 0.5
        );
        this.ctx.fillStyle = colors.detail;
        this.ctx.globalAlpha = 0.72;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        // Marcas alternadas para que el cuerpo no sea plano
        if (index % 2 === 0) {
            this.roundedPath(
                innerX + sizeW * 0.12,
                innerY + sizeH * 0.15,
                sizeW * 0.16,
                sizeH * 0.55,
                radius * 0.35
            );
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
            this.ctx.fill();

            this.roundedPath(
                innerX + sizeW * 0.72,
                innerY + sizeH * 0.15,
                sizeW * 0.16,
                sizeH * 0.55,
                radius * 0.35
            );
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawHeadSprite(snake, x, y, cellWidth, cellHeight) {
        const id = this.getSnakeId(snake);
        const image = this.snakeHeads[id];

        if (!image || !image.complete) {
            return false;
        }

        // Antes estaba muy grande. Ahora la cabeza queda más chica.
        const size = Math.min(cellWidth, cellHeight) * 1.35;

        const centerX = x + cellWidth / 2;
        const centerY = y + cellHeight / 2;

        let offsetX = 0;
        let offsetY = 0;

        // Pequeño desplazamiento para que parezca que la cabeza mira hacia adelante.
        if (snake.direction === 'UP') offsetY = -cellHeight * 0.08;
        if (snake.direction === 'DOWN') offsetY = cellHeight * 0.08;
        if (snake.direction === 'LEFT') offsetX = -cellWidth * 0.08;
        if (snake.direction === 'RIGHT') offsetX = cellWidth * 0.08;

        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetY = 2;

        this.ctx.drawImage(
            image,
            centerX - size / 2 + offsetX,
            centerY - size / 2 + offsetY,
            size,
            size
        );

        this.ctx.restore();

        return true;
    }

    drawFallbackHead(snake, x, y, cellWidth, cellHeight) {
        const colors = this.getSnakeColors(snake);

        const sizeW = cellWidth * 0.88;
        const sizeH = cellHeight * 0.88;

        const innerX = x + (cellWidth - sizeW) / 2;
        const innerY = y + (cellHeight - sizeH) / 2;

        const radius = Math.min(sizeW, sizeH) * 0.35;

        // Cabeza de respaldo si no carga el PNG
        this.ctx.save();

        this.roundedPath(innerX, innerY, sizeW, sizeH, radius);
        this.ctx.fillStyle = colors.main;
        this.ctx.fill();
        this.ctx.lineWidth = 1.8;
        this.ctx.strokeStyle = colors.border;
        this.ctx.stroke();

        // Ojos
        const eyeSize = Math.max(2, Math.min(cellWidth, cellHeight) * 0.10);

        let eyeY = y + cellHeight * 0.40;
        let eyeX1 = x + cellWidth * 0.35;
        let eyeX2 = x + cellWidth * 0.65;

        if (snake.direction === 'UP') {
            eyeY = y + cellHeight * 0.30;
        }

        if (snake.direction === 'DOWN') {
            eyeY = y + cellHeight * 0.58;
        }

        if (snake.direction === 'LEFT') {
            eyeX1 = x + cellWidth * 0.30;
            eyeX2 = x + cellWidth * 0.30;
            eyeY = y + cellHeight * 0.35;
        }

        if (snake.direction === 'RIGHT') {
            eyeX1 = x + cellWidth * 0.70;
            eyeX2 = x + cellWidth * 0.70;
            eyeY = y + cellHeight * 0.35;
        }

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(eyeX1, eyeY, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(eyeX2, eyeY + cellHeight * 0.18, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#111111';
        this.ctx.beginPath();
        this.ctx.arc(eyeX1, eyeY, eyeSize * 0.45, 0, Math.PI * 2);
        this.ctx.arc(eyeX2, eyeY + cellHeight * 0.18, eyeSize * 0.45, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawSnake(snake, cols, rows) {
        const cellWidth = this.canvas.width / cols;
        const cellHeight = this.canvas.height / rows;

        snake.body.forEach((part, index) => {
            const x = part.x * cellWidth;
            const y = part.y * cellHeight;

            const isHead = index === 0;

            if (!isHead) {
                // Cuerpo mejorado con segmentos redondeados.
                this.drawBodySegment(snake, x, y, cellWidth, cellHeight, index);
            } else {
                // También se dibuja una base debajo de la cabeza para que conecte con el cuerpo.
                this.drawBodySegment(snake, x, y, cellWidth, cellHeight, index);

                const spriteLoaded = this.drawHeadSprite(
                    snake,
                    x,
                    y,
                    cellWidth,
                    cellHeight
                );

                if (!spriteLoaded) {
                    this.drawFallbackHead(snake, x, y, cellWidth, cellHeight);
                }
            }
        });
    }

    drawFood(food, cols, rows) {
        const cellWidth = this.canvas.width / cols;
        const cellHeight = this.canvas.height / rows;

        const type = food.type || 'pizza';
        const image = this.foodImages[type];

        const x = food.x * cellWidth;
        const y = food.y * cellHeight;

        // Halo visual alrededor de la comida
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.22)';
        this.ctx.beginPath();
        this.ctx.arc(
            x + cellWidth / 2,
            y + cellHeight / 2,
            Math.min(cellWidth, cellHeight) * 0.48,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.restore();

        if (image && image.complete) {
            const size = Math.min(cellWidth, cellHeight) * 0.90;

            this.ctx.drawImage(
                image,
                x + (cellWidth - size) / 2,
                y + (cellHeight - size) / 2,
                size,
                size
            );
        } else {
            // Respaldo con emoji si no carga el asset.
            this.ctx.font = `${Math.floor(Math.min(cellWidth, cellHeight) * 0.8)}px serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.ctx.fillText(
                type === 'pizza' ? '🍕' : '🧉',
                x + cellWidth / 2,
                y + cellHeight / 2
            );
        }
    }

    drawGame(snake, food, cols, rows) {
        this.clear();
        this.drawBoard(cols, rows);
        this.drawFood(food, cols, rows);
        this.drawSnake(snake, cols, rows);
    }
}