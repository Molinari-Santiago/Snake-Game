// audio.js — Sonidos del juego
// Se usa una clase simple para centralizar todos los efectos de sonido.
class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = {
            eat: new Audio('assets/sounds/eat.wav'),
            level: new Audio('assets/sounds/level.wav'),
            gameover: new Audio('assets/sounds/gameover.wav'),
            click: new Audio('assets/sounds/click.wav'),
        };
    }

    play(name) {
        if (!this.enabled || !this.sounds[name]) return;

        // Se reinicia el audio para poder repetir sonidos rápidamente.
        const sound = this.sounds[name];
        sound.currentTime = 0;
        sound.play().catch(() => {
            // Algunos navegadores bloquean audio hasta que el usuario toque un botón.
            // No se muestra error porque no afecta el funcionamiento del juego.
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

const soundManager = new SoundManager();