const Naves = document.querySelectorAll(".img-Naves");
Naves.forEach((Nav_selecionada) => {
  Nav_selecionada.addEventListener("click", () => {
    const NavSelecionada = document.querySelector(".selecionado");
    NavSelecionada.classList.remove("selecionado");
    Nav_selecionada.classList.add("selecionado");
  });
});

let canvas = document.querySelector("canvas");
const btnStart = document.getElementById("botao-start");
const selecaoNave = document.querySelector(".selecao-nave");
canvas.width = 600;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

btnStart.addEventListener("click", startGame);

function startGame() {
  btnStart.style.display = "none";
  selecaoNave.style.display = "none";
  
  let mouse = { x: canvas.width / 2, y: canvas.height - 75 };
  
  canvas.addEventListener("mousemove", (event) => {
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    if (mouse.x < 37) mouse.x = 27;
    if (mouse.x + 37 > canvas.width) mouse.x = canvas.width - 27;
  });

  let lasers = [];
  let lasersEnemies = [];
  let enemies = [];
  let score = 0;
  let enemyImg = new Image();
  enemyImg.src = "https://i.ibb.co/6RXDBpLq/nave-espacial.png";
  let meteoroImg = new Image();
  meteoroImg.src = "https://i.ibb.co/Xk3zcrQ/asteroides.png"
  
  const NavSelecionada = document.querySelector(".selecionado");
  let imageNav = new Image();
  imageNav.src = NavSelecionada.src;
  
  imageNav.width = 50;
  imageNav.height = 50;
  function draw() {
    let imageX = canvas.width / 2 - imageNav.width;
    let imageY = canvas.height - imageNav.height;

    imageX = mouse.x - imageNav.width / 2;
    imageY = mouse.y - imageNav.height / 2;

    c.drawImage(imageNav, imageX, imageY, imageNav.width, imageNav.height);
  } 
  let laserWidth = 6;
    let laserHeight = 8;
  function spawnLaserPlayer() {
    const newLaser = {
      x: mouse.x - laserWidth / 2,
      y: mouse.y - imageNav.height / 2,
      width: laserWidth,
      height: laserHeight,
      color: "fire",
       direction: "up"
    };
    lasers.push(newLaser);
    setTimeout(spawnLaserPlayer, 300);
  }
  spawnLaserPlayer();
  function drawLaser(x, y, color,direction) {
    let gradient = c.createLinearGradient(x, y, x, y + (direction === "up" ? -25 : 25));
    if (color === "fire") {
      gradient.addColorStop(0, "#ff4500"); // Laranja forte
      gradient.addColorStop(0.3, "#ffdd44"); // Amarelo brilhante
      gradient.addColorStop(0.6, "#ffffff"); // Branco para efeito de 

    } else if (color === "blue") {
      gradient.addColorStop(0, "#00aaff"); // Azul forte
      gradient.addColorStop(0.3, "#66ccff"); // Azul claro
      gradient.addColorStop(0.6, "#ffffff"); // Branco para brilho
     
    }
    c.fillStyle = gradient;
    c.beginPath();
    c.ellipse(x, y + (direction === "up" ? -15 : 15), laserWidth / 3, 10, 0, 0, Math.PI * 2);
    c.fill();
    
    c.beginPath();
    c.moveTo(x, y + (direction === "up" ? -15 : 15));
    c.lineTo(x - laserWidth / 6, y);
    c.lineTo(x + laserWidth / 6, y);
    c.closePath();
    c.fill();
  }
  let enemyWidth = 50;
  let enemyHeight = 50;
  let enemySpeed = 0.5;
  function spawnEnemy() {
    let enemy = {
      x: Math.random() * (canvas.width - enemyWidth),
      y: -enemyHeight,
      speed: enemySpeed,
      width: enemyWidth,
       height: enemyHeight,
      speed: enemySpeed,
      vida: 3,
      intervalId: null, // Armazena o ID do intervalo para os tiros inimigos
    };
    enemies.push(enemy);
    
    // Inicia os tiros da nave inimiga e guarda o ID do intervalo
    enemy.intervalId = setInterval(() => spawnLaserEnemies(enemy), 1300);
    
    setTimeout(spawnEnemy, 9000);
  }
  spawnEnemy();
  
  function spawnLaserEnemies(enemy) {
    lasersEnemies.push({
      x: enemy.x + enemyWidth / 2,
      y: enemy.y + enemyHeight,
      color: "blue", // Adicionando a cor ao tiro do inimigo
       direction: "down"
    });
  }
  function restartGame() {
    /* alert("Game Over! Pontuação: " + score); */
    location.reload();
  }
  
  
  function checkCollision(laser, enemy) {
    return (
      laser.x + 6 > enemy.x && // O laser atinge a largura da nave
      laser.x < enemy.x + 60 && // O laser não ultrapassa a nave
      laser.y < enemy.y + 60 && // O laser atingiu a altura da nave
      laser.y + 8 > enemy.y // O laser passou pela parte de cima da nave
    );
  }
  function CollisionMeteoro(a,b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }


  let meteoro = [];
  function spawnMeteor() {
    let TamanhoAleatorioMeteoro =  Math.floor(Math.random() * (50 - 20) + 20);
    let meteoroX = Math.random() * (innerWidth/2 - TamanhoAleatorioMeteoro);
    let meteoroY = -TamanhoAleatorioMeteoro;
    let meteoroSpeed = 3;
    let newmeteoro = {
      x: meteoroX,
      y: meteoroY,
      width: TamanhoAleatorioMeteoro,
      height: TamanhoAleatorioMeteoro,
      speed: meteoroSpeed,
      vida: 3
    };
     /* score++; */
    meteoro.push(newmeteoro);
    setTimeout(spawnMeteor, 650);
  }
  spawnMeteor();
  function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = "white";
      c.fillText("Score: " + score, 20, 50);
  
    // Atualiza e desenha lasers do jogador
    for (let i = 0; i < lasers.length; i++) {
      lasers[i].y -= 8;
      drawLaser(lasers[i].x, lasers[i].y, lasers[i].color, lasers[i].direction);

      if (lasers[i].y < 0) {
        lasers.splice(i, 1);
        i--;
      }
    }
    for (let w = 0; w < lasersEnemies.length; w++) {
      lasersEnemies[w].y += 5;
      drawLaser(lasersEnemies[w].x, lasersEnemies[w].y, lasersEnemies[w].color, lasersEnemies[w].direction);


      if (lasersEnemies[w].y > canvas.height) {
        lasersEnemies.splice(w, 1);
        w--;
      }
    }
    // Atualiza e desenha inimigos
    for (let y = 0; y < enemies.length; y++) {
        c.drawImage(
          enemyImg,
          enemies[y].x,
          enemies[y].y,
          enemies[y].width,
          enemies[y].height
        );
        enemies[y].y += enemies[y].speed;
        if (y.y > canvas.height) {
          restartGame();
        }
    }

    // Verifica colisões entre lasers e inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        let hit = false;
      
        for (let j = lasers.length - 1; j >= 0; j--) {
          let l = lasers[j];
      
          if (CollisionMeteoro(l, e)) {
            e.vida--; // Reduz a vida do inimigo
            lasers.splice(j, 1); // Remove o laser que acertou
            hit = true;
      
            if (e.vida <= 0) {
              clearInterval(e.intervalId); // Para os tiros da nave inimiga
              enemies.splice(i, 1); // Remove o inimigo se a vida acabar
              score += 10; // Aumenta a pontuação
            }
            break; // Evita que mais de um laser remova o mesmo inimigo no mesmo frame
          }
        }
      }
      
    // Verifica se o jogador foi atingido
    lasersEnemies.forEach(l => {
      if (checkCollision(l, { x: mouse.x - imageNav.width/2, y: mouse.y - imageNav.height })) {
        restartGame();
      }
    });
    meteoro.forEach(p => {
      if (checkCollision(p, { x: mouse.x - imageNav.width/2, y: mouse.y - imageNav.height })) {
        restartGame();
      }
    });
  
    draw();
  
  for (let k = 0; k < meteoro.length; k++) {
    c.drawImage(
      meteoroImg,
      meteoro[k].x,
      meteoro[k].y,
      meteoro[k].width,
      meteoro[k].height
    );
    meteoro[k].y += meteoro[k].speed;
    if (meteoro[k].y > innerHeight) {
      meteoro.splice(k, 1);
    }
  }
  
  for (let j = meteoro.length - 1; j >= 0; j--) {
    for (let l = lasers.length - 1; l >= 0; l--) {
      if (CollisionMeteoro(meteoro[j], lasers[l])) {
          if (meteoro[j].width < 30) {
            meteoro[j].vida = 1;
          }
        meteoro[j].vida--; // Reduz a vida do meteoro
        lasers.splice(l, 1); // Remove o laser que colidiu
        if (meteoro[j].vida <= 0) {
          meteoro.splice(j, 1); // Remove o meteoro se a vida acabar
          score++;
        }
        break;
      }
    }
  }
 } animate();
}