// levels.js — Configuración de los 6 niveles del Snake
const SNAKE_LEVELS = [
    { level: 1, speed: 200, label: 'Iniciante',   minLength: 3 },
    { level: 2, speed: 170, label: 'Aprendiz',    minLength: 3 },
    { level: 3, speed: 140, label: 'Gladiador',   minLength: 4 },
    { level: 4, speed: 110, label: 'Centurión',   minLength: 4 },
    { level: 5, speed: 85,  label: 'Legionario',  minLength: 5 },
    { level: 6, speed: 60,  label: 'Emperador',   minLength: 5 },
];

// Puntos por fruta según nivel
function getPointsForLevel(level) {
    return level * 10;
}
