const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spaceship = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 20, speed: 10 };
let obstacles = [];
let score = 0;
let gameOver = false;

// Déplace le vaisseau
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
    } else if (e.key === "ArrowRight" && spaceship.x + spaceship.width < canvas.width) {
        spaceship.x += spaceship.speed;
    }
});

// Génère des obstacles
function createObstacle() {
    const width = Math.random() * 50 + 20;
    obstacles.push({ x: Math.random() * (canvas.width - width), y: 0, width, height: 20 });
}

// Met à jour la position des obstacles
function updateObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.y += 5;
        if (obstacle.y > canvas.height) {
            score++;
        }
    });
    obstacles = obstacles.filter((obstacle) => obstacle.y <= canvas.height);
}

// Détecte les collisions
function detectCollision() {
    obstacles.forEach((obstacle) => {
        if (
            spaceship.x < obstacle.x + obstacle.width &&
            spaceship.x + spaceship.width > obstacle.x &&
            spaceship.y < obstacle.y + obstacle.height &&
            spaceship.y + spaceship.height > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

// Affiche le jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessine le vaisseau
    ctx.fillStyle = "white";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Dessine les obstacles
    ctx.fillStyle = "red";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Affiche le score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Boucle principale
function gameLoop() {
    if (!gameOver) {
        draw();
        updateObstacles();
        detectCollision();
        requestAnimationFrame(gameLoop);
    } else {
        alert(`Game Over! Final Score: ${score}`);
        saveScore(score);
    }
}

// Sauvegarde le score via Django
function saveScore(score) {
    fetch("/save_score/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify({ points: score }),
    }).then((response) => {
        if (response.ok) {
            console.log("Score saved!");
        }
    });
}

// Récupère le token CSRF
function getCSRFToken() {
    return document.cookie.split(";").find((c) => c.trim().startsWith("csrftoken=")).split("=")[1];
}

// Lancement du jeu
setInterval(createObstacle, 1000);
gameLoop();
