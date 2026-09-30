
/* ── BORING CALCULATOR LOGIC ───────────────────── */
let inputStr = "";
let display = document.getElementById("display");

function pressBtn(ch) {
  if (ch === "C") { inputStr = ""; display.value = ""; return; }
  inputStr += ch;
  display.value = inputStr;
}

function calculate() {
  try {
    let result = eval(inputStr);
    display.value = result;
    inputStr = "";
  } catch(e) {
    display.value = "error";
    inputStr = "";
  }
}

// Sæt event listener på tastaturtryk:
display.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    // ── CHECK FOR THE EASTER EGG BEFORE CALCULATING ──
    if (inputStr === "123456") {
      triggerAstronaut();
      display.value = "SPACEMAN!";
      inputStr = "";
      return;
    }
    calculate();
  }
  // Åbn for at lytte til tastaturtryk direkte:
  if (/[0-9+\-*/]/.test(e.key)) {   // Regex
    inputStr += e.key;
    display.value = inputStr;
  } else if (e.key === "Escape") {
    pressBtn('C');
  }
});

/* ── EASTER EGG: En rummand går hen over skærmen! ── */
let astronautActive = false;
let astroX = -60;
let astroStep = 0;

function triggerAstronaut() {
  astronautActive = true;
  astroX = -60;
  astroStep = 0;
}

function setup() {
  createCanvas(windowWidth, windowHeight - 320);
  background(10, 10, 30);
}

function draw() {
  // ── Draw the astronaut if the egg is active ──
  if (astronautActive) {
    background(10, 10, 30, 40);  // ghost-effekt efter ham

    // tegn stjerner:
    for (let i = 0; i < 40; i++) {
      let sx = noise(i * 0.3) * width;
      let sy = noise(i * 0.3 + 100) * height;
      let bright = 150 + noise(i, frameCount * 0.01) * 105;
      fill(bright, bright, bright, 180);
      noStroke();
      circle(sx, sy, 2);
    }

    document.querySelector('canvas').style.display = "block";
    astroX += 2.5;
    astroStep++;

    drawAstronaut(astroX, height / 2);

    // Leave a tiny trail of stars behind
    if (astroStep % 3 === 0) {
      fill(255, 255, 200, 120);
      noStroke();
      circle(astroX - 30, height / 2 + random(-10, 10), 3);
    }

    // Når atronauten kommer over i højre side, så er easteregg'et slut:
    if (astroX > width + 60) {
      astronautActive = false;
      pressBtn('C');
    }
  }
}

// En lille astronaut lavet af cirkler og firkanter:
function drawAstronaut(x, y) {
  push();
  translate(x, y);

  let bob = sin(frameCount * 0.15) * 4;   // svæver op og ned
  translate(0, bob);

  // Backpack
  fill(180, 180, 200);
  noStroke();
  rect(-18, -10, 10, 24, 3);

  // Body
  fill(230, 230, 240);
  rect(-12, -12, 24, 28, 5);

  // Helmet (big circle)
  fill(200, 220, 255);
  stroke(255, 255, 255);
  strokeWeight(2);
  circle(0, -18, 28);

  // Visor
  noFill();
  stroke(100, 140, 200);
  strokeWeight(3);
  arc(0, -18, 20, 20, 0, PI);

  // Eyes (two little dots)
  noStroke();
  fill(30, 30, 50);
  circle(-4, -19, 4);
  circle(4, -19, 4);

  // Legs (wiggly)
  stroke(230, 230, 240);
  strokeWeight(4);
  noFill();
  let legSwing = sin(frameCount * 0.2) * 5;
  line(-6, 16, -8 + legSwing, 28);
  line(6, 16, 8 - legSwing, 28);

  pop();
}