// renderer.js — Snake Romano (sin roundRect, compatible con todos los browsers)

function drawBackground(ctx, cols, rows, cell) {
    ctx.fillStyle = '#c8a96e';
    ctx.fillRect(0, 0, cols*cell, rows*cell);
    ctx.strokeStyle = 'rgba(160,110,50,0.3)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= cols; x++) {
        ctx.beginPath(); ctx.moveTo(x*cell, 0); ctx.lineTo(x*cell, rows*cell); ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
        ctx.beginPath(); ctx.moveTo(0, y*cell); ctx.lineTo(cols*cell, y*cell); ctx.stroke();
    }
}

function drawBorder(ctx, cols, rows, cell) {
    const W = cols*cell, H = rows*cell;
    ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, W-6, H-6);
    ctx.strokeStyle = '#8b5e2a'; ctx.lineWidth = 2;
    ctx.strokeRect(9, 9, W-18, H-18);
}

function drawSnake(ctx, snake, cell, progress = 1) {
    if (!snake.alive) return;
    
    const pb = snake.previousBody || snake.body;
    
    snake.body.forEach((seg, i) => {
        const prevSeg = pb[i] || seg;
        
        const cx = seg.x * cell;
        const cy = seg.y * cell;
        const px = prevSeg.x * cell;
        const py = prevSeg.y * cell;
        
        // Interpolacion lineal para animacion fluida
        const x = px + (cx - px) * progress;
        const y = py + (cy - py) * progress;
        
        const isHead = i === 0;
        // sombra
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(x+2, y+2, cell-2, cell-2);
        // cuerpo
        ctx.fillStyle = isHead ? snake.colorHead : snake.color1;
        ctx.fillRect(x+1, y+1, cell-2, cell-2);
        // borde acento
        ctx.strokeStyle = snake.color2; ctx.lineWidth = 1.2;
        ctx.strokeRect(x+1, y+1, cell-2, cell-2);

        if (isHead && cell >= 12) {
            // ojos
            const eyeSize = Math.max(2, cell*0.13);
            const ey = snake.direction===DIR.DOWN ? y+cell*0.28 : y+cell*0.55;
            ctx.fillStyle = '#fff';
            ctx.fillRect(x+cell*0.22, ey, eyeSize, eyeSize);
            ctx.fillRect(x+cell*0.64, ey, eyeSize, eyeSize);
            ctx.fillStyle = '#111';
            ctx.fillRect(x+cell*0.28, ey+1, eyeSize*0.5, eyeSize*0.5);
            ctx.fillRect(x+cell*0.70, ey+1, eyeSize*0.5, eyeSize*0.5);
        }
    });
}

function drawFood(ctx, food, cell) {
    const x = food.x*cell, y = food.y*cell;
    const pulse = Math.sin(food.pulse)*1.5;
    // halo
    ctx.fillStyle = 'rgba(255,210,40,0.22)';
    ctx.beginPath();
    ctx.arc(x+cell/2, y+cell/2, cell/2+pulse+3, 0, Math.PI*2);
    ctx.fill();
    // emoji
    ctx.font = `${cell-3+pulse}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(food.emoji, x+cell/2, y+cell/2+1);
}

function drawDead(ctx, snake, cell) {
    if (snake.alive) return;
    snake.body.forEach(seg => {
        ctx.fillStyle = 'rgba(80,0,0,0.38)';
        ctx.fillRect(seg.x*cell+2, seg.y*cell+2, cell-4, cell-4);
    });
}
