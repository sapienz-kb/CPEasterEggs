
/* ── SIMPET DEL: bare en tekstboks ────────────── */
let notesEl = document.getElementById("notes");
let textToRender = "Type your notes here…";

notesEl.addEventListener("input", function() {
  textToRender = notesEl.value || "…";  // spejl textarea-indholdet til canvas
  checkForEgg();
});

/* ── EASTER EGG: CODINGPIRATES-BØLGE ──────────────────── */
let eggActive = false;
let eggTimer = 0;
const EGG_DURATION = 120;   // frames (~2 sekunder ved 60fps)
let sparkles = [];

function checkForEgg() {
  if (notesEl.value.toLowerCase().includes("codingpirates")) {  // uafhængigt af store/små bogstaver: skriv codingpirates
    triggerWave();
    // Fjern udløsningsordet så det ikke udløses ved hvert tastetryk
    notesEl.value = notesEl.value.replace(/codingpirates/gi, "");  // fjern ordet så det ikke udløses igen
    textToRender = notesEl.value;
  }
}

function triggerWave() {
  eggActive = true;
  eggTimer = 0;
  sparkles = [];
  for (let i = 0; i < 30; i++) {
    sparkles.push({
      x: random(width),
      y: random(height),
      size: random(3, 8),
      speed: random(1, 3),
      hue: random(260, 320)   // lilla / magisk spektrum
    });
  }
}

function setup() {
  createCanvas(500, 280);
//  canvas.position(0, 0).style("margin-top", "10px");
}

function draw() {
  background(253, 246, 227);

  // ── Render teksten (med evt. bølge) ──
  let chars = textToRender.split("");
  let x = 30;
  let y = 60;
  textSize(20);
  textStyle(NORMAL);

  for (let i = 0; i < chars.length; i++) {
    let offsetY = 0;
    if (eggActive) {
      // Hvert tegn hopper med faseforskel → bølge
      let phase = i * 0.4;  // faseforskel pr. bogstav → bølge
      let progress = eggTimer / EGG_DURATION;
      let envelope = sin(progress * PI);   // 0→1→0, blid ind/ud
      offsetY = sin(phase + eggTimer * 0.15) * 18 * envelope;  // den faktiske lodrette bevægelse
    }

    // Farve: normalt mørk, eller glødende lilla under egg'et
    if (eggActive) {
      let glow = sin(i * 0.3 + eggTimer * 0.1) * 0.5 + 0.5;  // animeret 0..1 glød pr. bogstav
      fill(120 + glow * 80, 60 + glow * 40, 200 + glow * 55);
    } else {
      fill(60, 50, 40);
    }
    noStroke();
    text(chars[i], x, y + offsetY);
    x += textWidth(chars[i]) + 1;

    // Linjeskift (simpelt)
    if (x > width - 40) { x = 30; y += 30; }
  }

  // ── Gnister under easteregg'et ──
  if (eggActive) {
    eggTimer++;
    for (let s of sparkles) {
      s.y -= s.speed;
      let alpha = map(eggTimer, 0, EGG_DURATION, 200, 0);  // gnisterne forsvinder over tid
      fill(200, 160, 255, alpha);
      noStroke();
      // Tegn en 4-punkts stjerne
      push();
      translate(s.x, s.y);
      rotate(eggTimer * 0.05);
      beginShape();
      vertex(0, -s.size);
      vertex(s.size * 0.3, 0);
      vertex(0, s.size);
      vertex(-s.size * 0.3, 0);
      endShape(CLOSE);
      pop();
    }
    if (eggTimer >= EGG_DURATION) {
      eggActive = false;   // tilbage til normaltilstand
    }
  }
}