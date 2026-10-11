# 🌌 Minimalist 3D Pixel War

A sleek, Mobile-First, 3D-styled collaborative canvas (r/place clone) built with a focus on aesthetics and smooth interactions. 

> 🧠 **Disclaimer: This project was entirely VIBE CODED.** 
> What does that mean? It was built through conversational AI iteration, focusing purely on the "vibe", aesthetics, and immediate functionality rather than rigorous traditional software engineering. It’s a product of creative flow, spontaneous refactoring, and CSS magic. 

## ✨ Features
*   **Aesthetic UI:** Monochromatic theme, glassmorphism UI panels, and a giant slowly rotating 3D wireframe cube in the background.
*   **Mobile-First & Responsive:** 
    *   On mobile: The grid is flat and perfectly sized for touch interactions.
    *   On desktop: The canvas floats in 3D space and tilts towards you when you hover over it.
*   **Robust Backend:** Built with Node.js and Express.
*   **Anti-Spam & Security:** IP-based cooldowns (5 seconds per pixel), payload limits, and Rate Limiting to prevent DDoS and bot attacks.
*   **Auto-Save:** The canvas state is automatically backed up to a `backup.json` file every 24 hours and safely saved whenever the server is gracefully shut down.

## 📂 Project Structure
Ensure your files are organized like this:
```text
/pixel-war-serveur
├── client/                 # Frontend files
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js               # Node.js backend
├── package.json            # Dependencies
└── backup.json             # Auto-generated canvas save file
```

## 🚀 How to Run It Locally

### Prerequisites
You need to have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies
Clone the repository, open your terminal in the project folder, and install the required security and server packages:
```bash
npm install express cors express-rate-limit helmet
```

### 2. Start the Server
Run the following command to boot up the backend:
```bash
node server.js
```
You should see a message confirming the server is running and whether it loaded an existing canvas or created a new one.

### 3. Play!
Open your web browser and go to:
👉 **`http://localhost:3000`**

## 🌍 How to Share It with the World (Multiplayer)
Since the server runs on your local machine, your friends can't access `localhost`. To let anyone in the world place a pixel, you can easily expose your local server using a secure tunnel.

While your server is running, open a **second terminal window** and run Cloudflare's free tunnel service:
```bash
npx cloudflared tunnel --url http://localhost:3000
```
*Cloudflare will generate a secure public link (e.g., `https://random-words.trycloudflare.com`). Share this link with your friends, and they will be able to draw on your canvas in real-time!*

## 🛠️ Tech Stack
*   **Frontend:** Vanilla HTML, CSS (3D Transforms, CSS Grid, Glassmorphism), Vanilla JavaScript.
*   **Backend:** Node.js, Express.js.
*   **Security:** `helmet` (HTTP headers), `express-rate-limit` (Anti-DDoS), strict input sanitization.

---
*Vibe coded with ❤️ and AI.*
