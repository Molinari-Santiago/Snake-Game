// game.js — Snake Romano (Resolución interna fija, safe start logic)
const COLS = 36, ROWS = 28;
const CELL = 20;

const game = {
    canvas: null, ctx: null,
    state: 'MENU',
    currentPlayer: 1, 
    level: 0,
    lastTime: 0, accumulator: 0,
    snake1: null, snake2: null,
    food1: null,  food2: null,
    flashTimer: 0, flashMsg: '',
    hasStartedMoving: false, // <-- Safe start flag

    get activeSnake() { return this.currentPlayer === 1 ? this.snake1 : this.snake2; },
    get activeFood()  { return this.currentPlayer === 1 ? this.food1 : this.food2; },

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx    = this.canvas.getContext('2d');
        // Resolucion interna FIJA. El CSS escala el lienzo visualmente.
        this.canvas.width  = COLS * CELL; // 720
        this.canvas.height = ROWS * CELL; // 560

        this.snake1 = new Snake(1, 8, Math.floor(ROWS/2), DIR.RIGHT, '#3a9e3a','#1a5e1a','#2ecc71','Italia','🇮🇹');
        this.snake2 = new Snake(2, COLS-9, Math.floor(ROWS/2), DIR.LEFT, '#5ba8f5','#1a4aaa','#3498db','Argentina','🇦🇷');
        this.food1  = new Food('🍕','#e74c3c');
        this.food2  = new Food('🧉','#2ecc71');
        
        initInput(this);
        this.setState('MENU');
        requestAnimationFrame(ts => this.loop(ts));
    },

    setState(s) {
        this.state = s;
        document.getElementById('menuOverlay').classList.toggle('hidden', s !== 'MENU');
        document.getElementById('pauseOverlay').classList.toggle('hidden', s !== 'PAUSED' && s !== 'TURN_OVER');
        document.getElementById('gameOverOverlay').classList.toggle('hidden', s !== 'GAME_OVER');
    },

    startGame() {
        this.snake1.score = 0; this.snake2.score = 0;
        this.startTurn(1);
    },

    startTurn(playerNum) {
        this.currentPlayer = playerNum;
        this.level = 0;
        this.hasStartedMoving = false; // <-- El jugador debe presionar una tecla para empezar
        this.activeSnake.reset();
        
        // Empezar en el centro del mapa
        this.activeSnake.body = [
            { x: Math.floor(COLS/2),   y: Math.floor(ROWS/2) },
            { x: Math.floor(COLS/2)-1, y: Math.floor(ROWS/2) },
            { x: Math.floor(COLS/2)-2, y: Math.floor(ROWS/2) }
        ];
        this.activeSnake.previousBody = this.activeSnake.body.map(s => ({...s}));
        this.activeSnake.direction = DIR.RIGHT;
        this.activeSnake.nextDir   = DIR.RIGHT;
        
        this.activeFood.spawn(COLS, ROWS, this.activeSnake, this.activeSnake);
        this.accumulator = 0; 
        this.lastTime = 0;
        this.setState('PLAYING');
        this.updateHUD();
        this.flash(`¡Turno de ${this.activeSnake.flag} ${this.activeSnake.name}!`);
        
        // Actualizar visual de paneles
        document.getElementById('panel1').classList.toggle('active', playerNum === 1);
        document.getElementById('panel2').classList.toggle('active', playerNum === 2);
    },

    resetGame() { this.startGame(); },

    get stepMs() { return SNAKE_LEVELS[this.level].speed; },

    loop(timestamp) {
        requestAnimationFrame(ts => this.loop(ts));

        if (this.state === 'PLAYING') {
            const delta = this.lastTime ? Math.min(timestamp - this.lastTime, 200) : 0;
            this.lastTime = timestamp;
            this.accumulator += delta;
            while (this.accumulator >= this.stepMs) {
                this.tick();
                this.accumulator -= this.stepMs;
            }
        } else {
            this.lastTime = timestamp;
        }
        this.render();
    },

    tick() {
        if (!this.hasStartedMoving) return; // No mover hasta que presione una tecla

        const snake = this.activeSnake;
        // Guardamos la posicion anterior para la animacion fluida
        snake.previousBody = snake.body.map(s => ({...s}));
        snake.move();

        if (checkWallCollision(snake, COLS, ROWS) || checkSelfCollision(snake)) {
            this.killActiveSnake();
            return;
        }

        const food = this.activeFood;
        if (checkFoodCollision(snake, food)) {
            snake.score += getPointsForLevel(this.level+1);
            snake.grow();
            food.spawn(COLS, ROWS, snake, snake);
            this.flash(`${food.emoji} +${getPointsForLevel(this.level+1)}`);
        }

        snake.trimTail();
        food.update();

        const target = SNAKE_LEVELS[this.level].minLength + (this.level+1)*3;
        if (snake.body.length >= target && this.level < SNAKE_LEVELS.length - 1) {
            this.level++;
            this.flash(`⚔️ ¡Nivel ${this.level+1}: ${SNAKE_LEVELS[this.level].label}!`);
        }
        this.updateHUD();
    },

    killActiveSnake() {
        const snake = this.activeSnake;
        snake.alive = false;
        saveScore(snake.name+' '+snake.flag, snake.score, this.level+1);
        
        if (this.currentPlayer === 1) {
            this.setState('TURN_OVER');
            document.getElementById('pauseTitle').textContent = '💀 ¡ITALIA ELIMINADA!';
            document.getElementById('pauseSubtitle').textContent = `Puntos: ${snake.score}. ¡Prepárate Argentina!`;
            const btn = document.getElementById('pauseBtn');
            btn.textContent = '▶ TURNO DE ARGENTINA';
            btn.onclick = () => this.startTurn(2);
            document.getElementById('pauseRestartBtn').style.display = 'none';
        } else {
            this.triggerGameOver();
        }
    },

    triggerGameOver() {
        this.setState('GAME_OVER');
        const s1 = this.snake1.score, s2 = this.snake2.score;
        const winner = s1 > s2 ? `🏆 ${this.snake1.flag} Italia gana!`
                     : s2 > s1 ? `🏆 ${this.snake2.flag} Argentina gana!`
                     : '🤝 ¡Empate!';
        document.getElementById('goWinner').textContent  = winner;
        document.getElementById('goP1Score').textContent = `${this.snake1.flag} Italia: ${s1} pts`;
        document.getElementById('goP2Score').textContent = `${this.snake2.flag} Argentina: ${s2} pts`;
    },

    flash(msg) { this.flashMsg = msg; this.flashTimer = 90; },

    updateHUD() {
        document.getElementById('p1Score').textContent = this.snake1.score;
        document.getElementById('p2Score').textContent = this.snake2.score;
        document.getElementById('levelBar').textContent = `Nivel ${this.level+1} — ${SNAKE_LEVELS[this.level].label}`;
    },

    render() {
        const ctx = this.ctx;
        if (this.state === 'MENU') return;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        drawBackground(ctx, COLS, ROWS, CELL);
        drawBorder(ctx, COLS, ROWS, CELL);
        
        // Calcular progreso para interpolar animación (0.0 a 1.0)
        let progress = this.accumulator / this.stepMs;
        if (progress > 1) progress = 1;
        if (!this.hasStartedMoving || this.state !== 'PLAYING') progress = 1; // Si esta en pausa, no animar intermedio
        
        if (this.currentPlayer === 1) {
            drawFood(ctx, this.food1, CELL);
            if (this.snake1.alive) drawSnake(ctx, this.snake1, CELL, progress);
            else drawDead(ctx, this.snake1, CELL);
        } else {
            drawFood(ctx, this.food2, CELL);
            if (this.snake2.alive) drawSnake(ctx, this.snake2, CELL, progress);
            else drawDead(ctx, this.snake2, CELL);
        }

        // Indicador visual de que debe presionar para moverse
        if (!this.hasStartedMoving && this.state === 'PLAYING') {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.font = `bold 24px Cinzel, serif`;
            ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("PRESIONA UNA DIRECCIÓN PARA MOVERTE", this.canvas.width/2, this.canvas.height/2 + CELL*2);
            ctx.restore();
        }

        if (this.flashTimer > 0) {
            this.flashTimer--;
            ctx.save();
            ctx.globalAlpha = Math.min(1, this.flashTimer / 30);
            ctx.font = `bold 22px Cinzel, serif`;
            ctx.fillStyle = '#FFD700';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.flashMsg, this.canvas.width/2, CELL*2);
            ctx.restore();
        }
    }
};

window.game = game; // Export global
window.addEventListener('load', () => game.init());
