function preload() {
  bgimg = loadImage("assets/images/AdobeStock_296211293.jpeg");
  character = loadImage("assets/images/AdobeStock_491984896.png");
}

let player = {
  x: 200,
  y: 100,
  vx: 0,
  vy: 0,
  r: 24,
  speed: 0.5,
  maxSpeed: 4,
  friction: 0.8,
  onGround: false,
};

let blocks = [];

function setup() {
  createCanvas(800, 450);
  floorY = height - 40;
  player.y = floorY - player.r;

  // create blocks
  blocks.push({ x: 150, y: height + 20, w: 100, h: 20, vy: 0, active: false });
  blocks.push({ x: 300, y: floorY - 60, w: 100, h: 20, vy: 0, active: false });
}

function draw() {
  background(bgimg);

  drawFloor();
  handleInput(); //handles player movement based on key presses
  applyPhysics(); //applies gravity
  drawPlayer();
  drawBlocks();
  drawHUD(); //displays indtructions for player
}

function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx += player.speed;
  }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }
}

function applyPhysics() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  if (player.y + player.r >= floorY) {
    player.y = floorY - player.r;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  player.x = constrain(player.x, player.r, width - player.r);

  blocks.forEach((block) => {
    if (
      player.x + player.r > block.x &&
      player.x - player.r < block.x + block.w &&
      player.y + player.r >= block.y &&
      player.y + player.r <= block.y + block.h
    ) {
      player.y = block.y - player.r;
      player.vy = block.vy;
      player.onGround = true;

      if (!block.active) {
        block.active = true;
        block.vy = -8; // Block bounces up
      }
    }

    if (block.active) {
      block.vy += GRAVITY;
      block.y += block.vy;

      if (block.y >= floorY - block.h) {
        block.y = floorY - block.h;
        block.vy = 0;
        block.active = false;
      }
    }
  });
}

function drawPlayer() {
  image(
    character,
    player.x - player.r,
    player.y - player.r,
    player.r * 2,
    player.r * 2
  );
}

function drawBlocks() {
  fill(200, 100, 50); // Block color
  blocks.forEach((block) => {
    rect(block.x, block.y, block.w, block.h);
  });
}

function drawFloor() {
  fill(40, 120, 110);
  noStroke();
  rect(0, floorY, width, height - floorY);
}

function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD", 16, 24);
}
