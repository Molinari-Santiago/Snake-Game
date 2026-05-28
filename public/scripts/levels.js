// levels.js — Configuración de los 7 niveles del Snake Romano
// Cada objeto controla dificultad, tamaño del mapa y etiqueta que se muestra en pantalla.
const SNAKE_LEVELS = [
    { level: 1, speed: 135, cols: 20, rows: 16, label: 'Iniciante' },
    { level: 2, speed: 125, cols: 22, rows: 18, label: 'Aprendiz' },
    { level: 3, speed: 115, cols: 24, rows: 20, label: 'Gladiador' },
    { level: 4, speed: 105, cols: 26, rows: 22, label: 'Centurión' },
    { level: 5, speed: 95,  cols: 28, rows: 24, label: 'Legionario' },
    { level: 6, speed: 85,  cols: 32, rows: 26, label: 'General' },
    { level: 7, speed: 75,  cols: 36, rows: 28, label: 'Emperador' },
];

// Puntos por fruta según nivel.
// Cuanto más alto sea el nivel, más vale cada fruta.
function getPointsForLevel(level) {
    return level * 10;
}