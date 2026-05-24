// snake.js — Clase Snake
class Snake {
    constructor(id, startX, startY, dir, color1, color2, colorHead, name, flag) {
        this.id        = id;
        this.name      = name;
        this.flag      = flag;          // emoji bandera
        this.color1    = color1;        // color cuerpo principal
        this.color2    = color2;        // color acento (borde)
        this.colorHead = colorHead;     // color cabeza

        this.startX  = startX;
        this.startY  = startY;
        this.startDir = dir;

        this.reset();
    }

    reset() {
        this.direction = this.startDir;
        this.nextDir   = this.startDir;
        this.alive     = true;
        this.score     = 0;
        this.body = [
            { x: this.startX,     y: this.startY },
            { x: this.startX - 1, y: this.startY },
            { x: this.startX - 2, y: this.startY },
        ];
        if (this.startDir === DIR.LEFT) {
            this.body = [
                { x: this.startX,     y: this.startY },
                { x: this.startX + 1, y: this.startY },
                { x: this.startX + 2, y: this.startY },
            ];
        }
    }

    move() {
        if (!this.alive) return;
        this.direction = this.nextDir;

        const head = this.body[0];
        let nx = head.x, ny = head.y;
        if (this.direction === DIR.UP)    ny--;
        if (this.direction === DIR.DOWN)  ny++;
        if (this.direction === DIR.LEFT)  nx--;
        if (this.direction === DIR.RIGHT) nx++;

        this.body.unshift({ x: nx, y: ny });
        // tail se elimina en game.js salvo cuando come
    }

    grow() {
        // No eliminar tail en este tick → se llama desde game.js
        this._grew = true;
    }

    trimTail() {
        if (this._grew) {
            this._grew = false;
        } else {
            this.body.pop();
        }
    }

    get head() { return this.body[0]; }

    occupies(x, y) {
        return this.body.some(s => s.x === x && s.y === y);
    }
}
