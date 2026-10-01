
/* ── SIMPET DEL: fake vejrslåop ─────────── */
let knownCities = {
  "london":   { temp: 12, icon: "🌧", desc: "Light rain" },
  "paris":    { temp: 15, icon: "☀️", desc: "Sunny" },
  "tokyo":    { temp: 22, icon: "⛅", desc: "Partly cloudy" },
  "new york": { temp: 8,  icon: "❄️", desc: "Snow flurries" },
  "cairo":    { temp: 34, icon: "☀️", desc: "Hot and clear" },
  "allerød":    { temp: 26, icon: "☀️", desc: "Hot and clear" },
};

function checkWeather() {
  let city = document.getElementById("city").value.trim().toLowerCase();  // normalisér indtastning: trim + småbogstaver
  let resultEl = document.getElementById("result");

  // ── TJEK FOR HEMMELIGE BYER FØRST ──
  if (city === "dragon")   { resultEl.textContent = "🐉 100% chance of fire. Avoid."; triggerCreature("dragon");   return; }
  if (city === "penguins" || city === "penguin") { resultEl.textContent = "🐧 2°C. Very slippery.";        triggerCreature("penguins"); return; }
  if (city === "cloud")    { resultEl.textContent = "☁️ 1000% clouds. Hydrate.";     triggerCreature("cloud");    return; }

  // Normalt slåop
  if (knownCities[city]) {  // slå op i den hardkodede tabel
    let w = knownCities[city];
    resultEl.textContent = w.icon + " " + city + ": " + w.temp + "°C, " + w.desc;
  } else {
    resultEl.textContent = "❓ Unknown city. (Try… something unusual?)";
  }
}

/* ── EASTER EGG: VÆSEN-ANIMATIONER ──────────── */
let activeCreature = null;   // "dragon" | "penguins" | "cloud"
let creatureX = -100;
let creatureTimer = 0;

function triggerCreature(type) {
  activeCreature = type;
  creatureX = -100;
  creatureTimer = 0;
  showCanvas();   // afslør canvas så væsnet er synligt
}

function setup() {
  createCanvas(windowWidth, 300);
}

function windowResized() {
  resizeCanvas(windowWidth, 300);
}

// Hjælp: få canvas DOM-element pålideligt tværs p5-versioner
function hideCanvas()   { document.querySelector('canvas').style.display = 'none'; }
function showCanvas()   { document.querySelector('canvas').style.display = 'block'; }

function draw() {
  // Himmelsbaggrund
  let skyTop = color(135, 190, 240);
  let skyBot = color(200, 225, 250);
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(skyTop, skyBot, y / height));  // lodret gradient i himlen
    line(0, y, width, y);
  }
  noStroke();

  // Jordstribe
  fill(140, 190, 100);
  rect(0, height - 40, width, 40);

  if (!activeCreature) return;

  creatureTimer++;

  if (activeCreature === "dragon") {
    creatureX += 3;
    drawDragon(creatureX, height / 2 + sin(creatureTimer * 0.06) * 30);  // sinus-bane op og ned
    // Ildåndedræts-partikler
    if (creatureTimer % 4 === 0) {
      fill(255, random(100, 180), 0, 150);
      circle(creatureX - 30, height / 2 + sin(creatureTimer * 0.06) * 30 + random(-8, 8), random(4, 10));  // ildpartikler bag dragen
    }
  }

  if (activeCreature === "penguins" || activeCreature === "penguin") {
    creatureX += 1.5;
    // Tre pingviner der vugger
    for (let i = 0; i < 3; i++) {
      let px = creatureX - i * 35;
      let waddle = sin(creatureTimer * 0.12 + i * 1.5) * 3;  // hver pinguin vugger med forskellig fase
      drawPenguin(px, height - 55, waddle);
    }
  }

  if (activeCreature === "cloud") {
    creatureX += 1.2;
    let puff = sin(creatureTimer * 0.04) * 5;  // blid op/ned bevægelse
    drawBigCloud(creatureX, 80 + puff);
    // Små regndrøber
    if (creatureTimer % 6 === 0) {
      fill(150, 190, 240, 120);
      circle(creatureX + random(-40, 40), 120 + random(0, 40), 3);
    }
  }

  // Egg'et slutter når væsnet forlader højre side
  if (creatureX > width + 150) {
    activeCreature = null;
    hideCanvas();   // skjul canvas igen indtil næste easter egg
  }
}

/* ── LILLE TEGNE-HJÆLPERE ───────────────────── */

function drawDragon(x, y) {
//    debugger;
  push();
  translate(x, y);
  let wingFlap = sin(creatureTimer * 0.15) * 20;  // vingeflommen

  // Vinger
  fill(180, 60, 60);
  noStroke();
  triangle(-10, 0, -50, -30 + wingFlap, -20, 5);
  triangle(-10, 0, -50, 10 - wingFlap, -20, 5);

  // Krop
  fill(220, 80, 50);
  ellipse(0, 0, 60, 30);

  // Hoved
  fill(230, 100, 60);
  ellipse(35, -5, 28, 24);

  // Øje
  fill(255, 255, 100);
  circle(42, -8, 6);
  fill(30);
  circle(42, -8, 2);

  // Hale
  stroke(220, 80, 50);
  strokeWeight(5);
  noFill();
  beginShape();
  vertex(-30, 0);
  bezier(-50, 10, -60, -15, -70, 5);
  endShape();

  // Piler på ryggen
  noStroke();
  fill(200, 50, 40);
  for (let i = 0; i < 4; i++) {
    let sx = -15 + i * 10;
    triangle(sx, -12, sx + 4, -22, sx + 8, -12);
  }

  pop();
}

function drawPenguin(x, y, waddle) {
  push();
  translate(x, y);
  rotate(radians(waddle));  // let skævhed til vugge-effekten

  // Krop
  fill(40, 40, 50);
  ellipse(0, 0, 24, 36);
  // Mave
  fill(240, 240, 245);
  ellipse(2, 4, 16, 26);
  // Hoved
  fill(40, 40, 50);
  circle(0, -20, 20);
  // Ansigt
  fill(240, 240, 245);
  ellipse(3, -20, 12, 14);
  // Nak
  fill(240, 180, 50);
  triangle(10, -20, 16, -18, 10, -16);
  // Øje
  fill(255);
  circle(4, -22, 5);
  fill(30);
  circle(4, -22, 2);
  // Fødder
  fill(240, 180, 50);
  ellipse(-4, 18, 10, 5);
  ellipse(6, 18, 10, 5);

  pop();
}

function drawBigCloud(x, y) {
  fill(255, 255, 255, 230);
  noStroke();
  ellipse(x, y, 100, 50);
  ellipse(x - 40, y + 5, 60, 40);
  ellipse(x + 40, y + 5, 70, 45);
  ellipse(x + 10, y - 15, 60, 40);
}