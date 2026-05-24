// collision.js — Detección de colisiones para Snake
function checkWallCollision(snake, cols, rows) {
    const h = snake.head;
    return h.x < 0 || h.x >= cols || h.y < 0 || h.y >= rows;
}

function checkSelfCollision(snake) {
    const h = snake.head;
    return snake.body.slice(1).some(s => s.x === h.x && s.y === h.y);
}

function checkSnakeVsSnake(s1, s2) {
    // Verifica si la cabeza de s1 choca con el cuerpo de s2 (y viceversa)
    const h1 = s1.head, h2 = s2.head;
    const s1HitsS2Body = s2.body.some(s => s.x === h1.x && s.y === h1.y);
    const s2HitsS1Body = s1.body.some(s => s.x === h2.x && s.y === h2.y);
    const headCollision = h1.x === h2.x && h1.y === h2.y;
    return { s1HitsS2Body, s2HitsS1Body, headCollision };
}

function checkFoodCollision(snake, food) {
    return food.isAt(snake.head.x, snake.head.y);
}
