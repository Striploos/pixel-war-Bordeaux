const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fs = require('fs'); // NOUVEAU : Permet de lire et écrire des fichiers

const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json({ limit: '10kb' })); 
app.use(express.static('client')); 

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 150, 
    message: { msg: "Trop de requêtes détectées." }
});
app.use(limiter);

// --- 1. CONFIGURATION ET CHARGEMENT DE LA GRILLE ---
const ROWS = 40;
const COLS = 40;
const BACKUP_FILE = './backup.json';
let grille;

// Le serveur vérifie si le fichier de sauvegarde existe déjà
if (fs.existsSync(BACKUP_FILE)) {
    try {
        const data = fs.readFileSync(BACKUP_FILE, 'utf8');
        grille = JSON.parse(data);
        console.log("✅ Sauvegarde chargée avec succès ! La guerre des pixels reprend.");
    } catch (err) {
        console.error("❌ Erreur de lecture de la sauvegarde, création d'une nouvelle grille.");
        grille = Array(ROWS).fill().map(() => Array(COLS).fill('#111111'));
    }
} else {
    console.log("🌱 Aucune sauvegarde trouvée. Création d'une grille vierge.");
    grille = Array(ROWS).fill().map(() => Array(COLS).fill('#111111'));
}

// --- 2. SYSTÈME DE SAUVEGARDE AUTOMATIQUE ---
const sauvegarderGrille = () => {
    fs.writeFile(BACKUP_FILE, JSON.stringify(grille), (err) => {
        if (err) console.error("❌ Erreur lors de la sauvegarde :", err);
        else console.log("💾 Grille sauvegardée automatiquement !");
    });
};

// Sauvegarde automatique toutes les 24 heures (24h * 60m * 60s * 1000ms)
setInterval(sauvegarderGrille, 24 * 60 * 60 * 1000);
// Optionnel : Tu peux le mettre toutes les heures (60 * 60 * 1000) pour être sûr de ne rien perdre en cas de crash.

// Sauvegarde d'urgence quand tu coupes le serveur (Ctrl + C)
process.on('SIGINT', () => {
    console.log("\n⚠️ Extinction du serveur demandée. Sauvegarde en cours...");
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(grille));
    console.log("💾 Sauvegarde finale réussie. Bye !");
    process.exit();
});


// --- 3. GESTION DU JEU (Routes API) ---
const cooldowns = {};
const COOLDOWN_TIME = 5000;

app.get('/tableau', (req, res) => {
    res.json(grille);
});

app.get('/temps-attente', (req, res) => {
    const ip = req.ip;
    const lastTime = cooldowns[ip] || 0;
    const now = Date.now();
    let timeLeft = Math.max(0, COOLDOWN_TIME - (now - lastTime));
    res.json({ tempsAttente: timeLeft });
});

app.put('/modifier-case', (req, res) => {
    const { row, col, color } = req.body;
    const ip = req.ip;
    const now = Date.now();

    const lastTime = cooldowns[ip] || 0;
    if (now - lastTime < COOLDOWN_TIME) {
        return res.status(429).json({ msg: "Temps d'attente non écoulé." });
    }

    if (typeof row !== 'number' || typeof col !== 'number' || row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return res.status(400).json({ msg: "Coordonnées invalides." });
    }
    
    let cleanColor = String(color).trim();
    cleanColor = cleanColor.replace(/[^#0-9a-fA-F]/g, '');

    if (!cleanColor.startsWith('#') || cleanColor.length < 4 || cleanColor.length > 9) {
        return res.status(400).json({ msg: "Couleur invalide." });
    }
    if (cleanColor.length === 8) cleanColor = cleanColor.substring(0, 7);

    grille[row][col] = cleanColor;
    cooldowns[ip] = now;

    res.status(200).json({ msg: "Enregistré !" });
});

// --- Lancement du serveur ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur Pixel War Minimaliste actif sur http://localhost:${PORT}`);
});