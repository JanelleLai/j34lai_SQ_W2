function preload() {
  bgimg = loadImage("assets/images/AdobeStock_296211293.jpeg"); // Load background image
  character = loadImage("assets/images/AdobeStock_491984896.png"); // Load character image
}

let player = {
  x: 200, // horizontal position (center of character)
  y: 100, // vertical position (center of character)
  vx: 0, // horizontal velocity
  vy: 0, // vertical velocity
  r: 24, // radius of the character
  speed: 0.5, // horizontal acceleration per frame
  maxSpeed: 4, // maximum horizontal speed
  jumpForce: -12, // upward velocity applied when jumping
  friction: 0.8, // horizontal slowdown when no key is pressed
  onGround: false, // tracks whether the player is standing on something
};

const GRAVITY = 0.6; // downward force added to vy every frame
let floorY;

function setup() {
  createCanvas(800, 450);
  floorY = height - 40; // ground sits 40px from the bottom
  player.y = floorY - player.r; // start the player sitting on the floor
}

function draw() {
  background(bgimg); // Use your background image

  drawFloor();
  handleInput();
  applyPhysics();
  drawPlayer();
  drawHUD();
}

function handleInput() {
  // --- Horizontal movement ---
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    // LEFT or A
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    // RIGHT or D
    player.vx += player.speed;
  }

  // --- Clamp horizontal speed ---
  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  // --- Apply friction when no horizontal key is pressed ---
  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  // --- Jump ---
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) {
    // UP or W
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

function applyPhysics() {
  // 1. Apply gravity
  player.vy += GRAVITY;

  // 2. Move player by its current velocity
  player.x += player.vx;
  player.y += player.vy;

  // 3. Floor collision
  if (player.y + player.r >= floorY) {
    player.y = floorY - player.r; // snap to floor
    player.vy = 0; // stop falling
    player.onGround = true; // allow jumping again
  } else {
    player.onGround = false;
  }

  // 4. Wall collision — keep player inside canvas
  player.x = constrain(player.x, player.r, width - player.r);
}

function drawPlayer() {
  // Draw the player using the character image
  image(
    character,
    player.x - player.r, // Center the image horizontally
    player.y - player.r, // Center the image vertically
    player.r * 2, // Width of the character image
    player.r * 2 // Height of the character image
  );
}

function drawFloor() {
  fill(40, 120, 110); // dark teal
  noStroke();
  rect(0, floorY, width, height - floorY);
}

function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}
