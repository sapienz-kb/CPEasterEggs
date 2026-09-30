
/* ── BORING TO-DO LOGIC ────────────────────────── */
let tasks = [
  { text: "Feed the cat", done: false },
  { text: "Do homework",  done: false },
  { text: "Water plants", done: false },
];

function renderTasks() {
  let area = document.getElementById("todo-area");
  area.innerHTML = "";
  tasks.forEach(function(t, i) {
    let span = document.createElement("span");
    span.className = "todo-item" + (t.done ? " done" : "");
    span.textContent = (t.done ? "✓ " : "○ ") + t.text;
    span.onclick = function() { toggleTask(i); };
    area.appendChild(span);
  });
  checkAllDone();   // ← this is where the egg can fire
}

function addTask() {
  let val = document.getElementById("new-item").value.trim();
  if (val) {
    tasks.push({ text: val, done: false });
    document.getElementById("new-item").value = "";
    renderTasks();
  }
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  renderTasks();
}

function checkAllDone() {
  let allDone = tasks.every(function(t) { return t.done; });
  if (allDone && tasks.length > 0 && !celebrating) {
    triggerConfetti();
  }
}

/* ── EASTER EGG: CONFETTI + ROBOT VICTORY LAP ──── */
let celebrating = false;
let confettiParts = [];
let robotAngle = 0;
let robotTimer = 0;

function triggerConfetti() {
  celebrating = true;
  robotTimer = 0;
  confettiParts = [];
  for (let i = 0; i < 120; i++) {
    confettiParts.push({
      x: width / 2,
      y: height / 2,
      vx: random(-8, 8),
      vy: random(-12, -2),
      hue: random(360),
      size: random(4, 10),
      spin: random(-0.2, 0.2),
      rot: random(360),
      life: 180 + random(60)
    });
  }
}

function setup() {
  createCanvas(windowWidth, 350);
//  canvas.position(0, 0).style("margin-top", "100px");
  background(240, 244, 248);
}

function draw() {
  background(240, 244, 248, 30);

  if (!celebrating) return;

  robotTimer++;

  // ── Confetti particles ──
  for (let p of confettiParts) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;       // gravity
    p.rot += p.spin * 60;
    p.life--;

    if (p.life > 0) {
      push();
      translate(p.x, p.y);
      rotate(radians(p.rot));
      colorMode(HSB, 360, 100, 100);
      fill(p.hue, 80, 100, map(p.life, 0, 240, 0, 220));
      noStroke();
      rectMode(CENTER);
      rect(0, 0, p.size, p.size * 0.6);
      colorMode(RGB);
      pop();
    }
  }

  // ── Robot victory lap (goes around the canvas border) ──
  if (robotTimer < 300) {
    robotAngle += 0.02;
    let rx = width  / 2 + cos(robotAngle) * (width  / 2 - 40);
    let ry = height / 2 + sin(robotAngle) * (height / 2 - 30);
    drawRobot(rx, ry, robotAngle + HALF_PI);
  }

  // ── "ALL DONE!" text ──
  if (robotTimer < 300) {
    fill(74, 144, 217);
    textAlign(CENTER);
    textSize(36);
    textStyle(BOLD);
    let alpha = map(robotTimer, 0, 300, 255, 0);
    fill(74, 144, 217, alpha);
    text("★ ALL DONE! ★", width / 2, height / 2);
  } else {
    celebrating = false;   // egg is over, app returns to normal
  }
}

// A small blocky robot
function drawRobot(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);

  // Body
  fill(100, 160, 230);
  noStroke();
  rect(-10, -8, 20, 18, 3);
  // Head
  fill(160, 200, 240);
  rect(-8, -20, 16, 12, 2);
  // Eyes
  fill(255);
  circle(-3, -14, 4);
  circle(3, -14, 4);
  // Antenna
  stroke(100, 160, 230);
  strokeWeight(2);
  line(0, -20, 0, -26);
  fill(255, 100, 100);
  noStroke();
  circle(0, -27, 4);
  // Wheels
  fill(60);
  circle(-7, 12, 6);
  circle(7, 12, 6);

  pop();
}

// Initial render
renderTasks();