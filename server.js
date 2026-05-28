// server.js — Servidor principal del Snake Game
// Este archivo levanta el servidor con Express, muestra el juego y maneja el ranking.

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3005;

// Necesario para poder usar __dirname con ES Modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas principales del proyecto.
const viewsPath = path.join(__dirname, "views");
const publicPath = path.join(__dirname, "public");
const dataPath = path.join(__dirname, "data");
const rankingPath = path.join(dataPath, "ranking.json");

// Middleware para recibir JSON desde el frontend.
app.use(express.json());

// Middleware para servir archivos públicos: CSS, JS, imágenes y sonidos.
app.use(express.static(publicPath));

// Si no existe la carpeta data, se crea automáticamente.
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

// Si no existe ranking.json, se crea vacío.
if (!fs.existsSync(rankingPath)) {
    fs.writeFileSync(rankingPath, "[]", "utf-8");
}

// Ruta principal del juego.
app.get("/", (req, res) => {
    res.sendFile(path.join(viewsPath, "index.html"));
});

// Obtener ranking.
app.get("/api/ranking", (req, res) => {
    try {
        const data = fs.readFileSync(rankingPath, "utf-8");
        const ranking = JSON.parse(data);

        res.json(ranking);
    } catch (error) {
        res.status(500).json({
            message: "Error al leer el ranking.",
        });
    }
});

// Guardar nuevo puntaje.
app.post("/api/ranking", (req, res) => {
    try {
        const { player, score, level } = req.body;

        if (!player || typeof score !== "number" || typeof level !== "number") {
            return res.status(400).json({
                message: "Datos inválidos para guardar el puntaje.",
            });
        }

        const data = fs.readFileSync(rankingPath, "utf-8");
        const ranking = JSON.parse(data);

        const newScore = {
            player: String(player).trim().slice(0, 20),
            score,
            level,
            date: new Date().toLocaleDateString("es-AR"),
        };

        ranking.push(newScore);

        // Ordena de mayor a menor y deja solo los 10 mejores.
        ranking.sort((a, b) => b.score - a.score);

        const topTen = ranking.slice(0, 10);

        fs.writeFileSync(rankingPath, JSON.stringify(topTen, null, 2), "utf-8");

        res.status(201).json({
            message: "Puntaje guardado correctamente.",
            ranking: topTen,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al guardar el puntaje.",
        });
    }
});

// Limpiar ranking.
app.delete("/api/ranking", (req, res) => {
    try {
        fs.writeFileSync(rankingPath, "[]", "utf-8");

        res.json({
            message: "Ranking limpiado correctamente.",
            ranking: [],
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al limpiar el ranking.",
        });
    }
});

// Ruta para páginas no encontradas.
app.use((req, res) => {
    res.status(404).send("Ruta no encontrada");
});

// Inicia el servidor.
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});