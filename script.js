let timeValite = true;

const tab = async () => {
    try {
        const response = await fetch("/tableau"); // Utilise l'URL relative
        let resultat = await response.json();
        
        const grille = document.getElementById("grille");
        const colone = resultat[0].length;
        const ligne = resultat.length;

        grille.style.display = "grid";
        // La grille s'adapte automatiquement (1fr = 1 fraction de l'espace)
        grille.style.gridTemplateColumns = `repeat(${colone}, 1fr)`;

        resultat.forEach((ligneTab, indexLigne) => {
            ligneTab.forEach((couleur, indexCouleur) => {
                const idPixel = `pixel-${indexLigne}-${indexCouleur}`;
                let pixel = document.getElementById(idPixel);
        
                if (!pixel) {
                    pixel = document.createElement("div");
                    pixel.id = idPixel;
                    // Les pixels prennent 100% de la case allouée par la grille
                    pixel.style.width = "100%";
                    pixel.style.height = "100%";
                    pixel.style.cursor = "crosshair";
                    
                    pixel.addEventListener('click', () => {
                        if(timeValite) {
                            const couleurChoisie = document.getElementById("colorPicker").value;
                            colorierPixel(couleurChoisie, indexCouleur, indexLigne, pixel);
                        }
                    });
                    grille.appendChild(pixel);
                }
                pixel.style.background = couleur;
            });
        });
    } catch(erreur) {
        document.getElementById("serverMsg").innerHTML = "Serveur hors ligne.";
    }
}

const colorierPixel = async (color, indexColonne, indexLigne, pixel) => {
    const msgServ = document.getElementById("serverMsg");
    
    const formData = { color: color, col: indexColonne, row: indexLigne };
    
    try {
        const response = await fetch("/modifier-case", {
            method : 'PUT', 
            headers : { 'Content-Type': 'application/json'},
            body : JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if(response.ok){
            pixel.style.backgroundColor = color;
            msgServ.style.color = "#ffffff";
            msgServ.innerHTML = data.msg;
            tmp(); // Relance immédiatement le timer localement
        } else {
            msgServ.style.color = "#757575";
            msgServ.innerHTML = data.msg;
        }
    } catch (e) {
        msgServ.innerHTML = "Échec de l'envoi.";
    }
}

const tmp = async () => {
    const msgTime = document.getElementById("waitMsg");
    const dot = document.getElementById("status-dot");
    
    try {
        const response = await fetch("/temps-attente");
        const data = await response.json();
        const time = Math.ceil(data.tempsAttente / 1000);
        
        if(time > 0) {
            msgTime.innerHTML = `Rechargement... ${time}s`;
            msgTime.style.color = "#757575";
            dot.className = "dot dot-wait";
            timeValite = false;
        } else {
            msgTime.innerHTML = "Prêt à dessiner";
            msgTime.style.color = "#ffffff";
            dot.className = "dot dot-ready";
            timeValite = true;
        }
    } catch(erreur) {
        msgTime.innerHTML = "Connexion perdue";
    }
}

// Initialisation
tab();
setInterval(tab, 5000); // Rafraichissement de la grille (5s)
setInterval(tmp, 1000);  // Rafraichissement du timer (1s)
