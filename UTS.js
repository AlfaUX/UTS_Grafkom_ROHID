let timeOfDay = 0; // 0: day, 1: sunset, 2: night
let birds = [];
let transitioning = false;
let transitionProgress = 0;

function setup() {
  createCanvas(800, 600);
  // posisi burung
  for (let i = 0; i < 5; i++) {
    birds.push({
      x: random(width),
      y: random(100, 200),
      speed: random(1, 3)
    });
  }
}

function draw() {
  // Perubahan waktu
  if (frameCount % 300 === 0 && !transitioning) {
    transitioning = true;
    transitionProgress = 0;
  }
  
  if (transitioning) {
    transitionProgress += 0.01;
    if (transitionProgress >= 1) {
      transitioning = false;
      timeOfDay = (timeOfDay + 1) % 3;
    }
  }
  
  // warna langit
  let skyColor;
  if (!transitioning) {
    if (timeOfDay === 0) { // Day
      skyColor = color(135, 206, 235);
    } else if (timeOfDay === 1) { // Sunset
      skyColor = color(255, 159, 102);
    } else { // Night
      skyColor = color(25, 25, 112);
    }
  } else {
    let startColor, endColor;
    if (timeOfDay === 0) { // Day to sunset
      startColor = color(135, 206, 235);
      endColor = color(255, 159, 102);
    } else if (timeOfDay === 1) { // Sunset to night
      startColor = color(255, 159, 102);
      endColor = color(25, 25, 112);
    } else { // Night to day
      startColor = color(25, 25, 112);
      endColor = color(135, 206, 235);
    }
    skyColor = lerpColor(startColor, endColor, transitionProgress);
  }
  background(skyColor);
  
  // bintang tapi hanya pas malam saja
  if (timeOfDay === 2 || (transitioning && (timeOfDay === 1 || timeOfDay === 2))) {
    let starAlpha = timeOfDay === 2 ? 255 : map(transitionProgress, 0, 1, 0, 255);
    drawStars(starAlpha);
  }

  // warna bulan dan matahari
  let celestialColor;
  if (!transitioning) {
    if (timeOfDay === 0) {
      celestialColor = color(255, 255, 0); // Sun
    } else if (timeOfDay === 1) {
      celestialColor = color(255, 165, 0); // Setting sun
    } else {
      celestialColor = color(255); // Moon
    }
  } else {
    let startColor, endColor;
    if (timeOfDay === 0) {
      startColor = color(255, 255, 0);
      endColor = color(255, 165, 0);
    } else if (timeOfDay === 1) {
      startColor = color(255, 165, 0);
      endColor = color(255);
    } else {
      startColor = color(255);
      endColor = color(255, 255, 0);
    }
    celestialColor = lerpColor(startColor, endColor, transitionProgress);
  }

  // bulan dan matahari
  fill(celestialColor);
  noStroke();
  circle(400, 150, 80); // Posisi tetap di tengah atas
  
  // gunung
  fill(121, 134, 69);
  triangle(0, 400, 200, 200, 400, 400);
  fill(165, 182, 141);
  triangle(300, 400, 500, 150, 700, 400);
  fill(98, 111, 71);
  triangle(600, 400, 800, 250, 900, 400);
  
  // jalan
  fill(69, 69, 69);
  quad(350, 400, 450, 400, 600, 600, 200, 600);
  

  // manuks
  stroke(0);
  strokeWeight(2);
  for (let bird of birds) {
    drawBird(bird.x, bird.y);
    bird.x += bird.speed;
    if (bird.x > width + 20) {
      bird.x = -20;
      bird.y = random(100, 200);
    }
  }
}

function drawBird(x, y) {
  beginShape();
  noFill();
  curve(x - 10, y - 10, x - 10, y, x, y, x + 10, y - 10);
  curve(x + 10, y - 10, x + 10, y, x, y, x - 10, y - 10);
  endShape();
}

function drawStars(alpha) {
  fill(255, alpha);
  noStroke();
  for (let i = 0; i < 50; i++) {
    let x = (noise(i * 10) * width);
    let y = (noise(i * 20) * height/2);
    circle(x, y, 2);
  }
}

function mousePressed() {
  if (!transitioning) {
    transitioning = true;
    transitionProgress = 0;
  }
}
