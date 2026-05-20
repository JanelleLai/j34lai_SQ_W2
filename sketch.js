function preload() {
  bgimg = loadImage("assets/images/AdobeStock_296211293.jpeg"); // Load background image
  character = loadImage("assets/images/AdobeStock_491984896.png"); // Load character image
}

// ------------------------------------------------------------
// PLATFORMS ARRAY
// Each platform is an object with x, y, width, height, and velocity.
// ------------------------------------------------------------
let platforms = [
  { x: 0, y: 410, w: 800, h: 40, vx: 0 }, // ground (doesn't move)
  { x: 80, y: 310, w: 120, h: 16, vx: 2 }, // left low platform
  { x: 280, y: 240, w: 140, h: 16, vx: -2 }, // centre platform
  { x: 500, y: 170, w: 120, h: 16, vx: 1.5 }, // right high platform
  { x: 160, y: 150, w: 100, h: 16, vx: -1.5 }, // left high platform
  { x: 360, y: 320, w: 110, h: 16, vx: 2 }, // centre low platform
  { x: 620, y: 290, w: 130, h: 16, vx: -2 }, // far right platform
];

// ------------------------------------------------------------
// PLAYER OBJECT
// ------------------------------------------------------------
let player = {
  x: 100,
  y: 100,
  vx: 0, // horizontal velocity
  vy: 0, // vertical velocity
  r: 20, // visual radius for collision
  speed: 0.55, // horizontal acceleration per frame
  maxSpeed: 4.5, // maximum horizontal speed
  jumpForce: -12, // upward velocity applied when jumping
  friction: 0.78, // horizontal slowdown when no key is pressed
  onGround: false, // tracks whether the player is standing on something
};

// ------------------------------------------------------------
// PHYSICS CONSTANTS
// ------------------------------------------------------------
const GRAVITY = 0.6; // downward force added to vy every frame
const PLATFORM_COLOR = [255, 160, 50]; // warm orange

// ============================================================
// setup()
// Runs once at the very start of the sketch.
// ============================================================
function setup() {
  createCanvas(800, 450);
  player.y = platforms[0].y - player.r; // Place player on top of the ground platform
}

// ============================================================
// draw()
// Runs repeatedly in a loop after setup() finishes.
// ============================================================
function draw() {
  background(bgimg); // Use your background image

  handleInput();
  applyPhysics();
  movePlatforms(); // Move platforms left and right
  resolvePlatformCollisions();

  drawPlatforms();
  drawPlayer();
  drawHUD();
}

// ------------------------------------------------------------
// handleInput()
// Handles player movement and jumping.
// ------------------------------------------------------------
function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    // LEFT or A
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    // RIGHT or D
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

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) {
    // UP or W
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

// ------------------------------------------------------------
// applyPhysics()
// Applies gravity and updates player position.
// ------------------------------------------------------------
function applyPhysics() {
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;

  player.x = constrain(player.x, player.r, width - player.r);

  if (player.y > height + 100) {
    player.x = 100;
    player.y = platforms[0].y - player.r;
    player.vx = 0;
    player.vy = 0;
  }

  player.onGround = false;
}

// ------------------------------------------------------------
// movePlatforms()
// Updates the position of moving platforms.
// ------------------------------------------------------------
function movePlatforms() {
  for (let i = 1; i < platforms.length; i++) {
    // Skip the ground (index 0)
    let p = platforms[i];

    if (p.active && Math.abs(p.moved) < MAX_MOVE_DISTANCE) {
      p.x += p.vx;
      p.moved += p.vx; // Track how far the platform has moved

      // Reverse direction if the platform hits the edge of the canvas
      if (p.x <= 0 || p.x + p.w >= width) {
        p.vx *= -1;
      }
    } else if (Math.abs(p.moved) >= MAX_MOVE_DISTANCE) {
      // Stop the platform after it moves the maximum distance
      p.active = false;
    }
  }
}

// ------------------------------------------------------------
// resolvePlatformCollisions()
// Checks for collisions between the player and platforms.
// ------------------------------------------------------------
function resolvePlatformCollisions() {
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    let playerLeft = player.x - player.r;
    let playerRight = player.x + player.r;
    let playerBottom = player.y + player.r;

    let platLeft = p.x;
    let platRight = p.x + p.w;
    let platTop = p.y;

    let overlapsHorizontally = playerRight > platLeft && playerLeft < platRight;
    let landingOnTop =
      player.vy >= 0 && playerBottom >= platTop && playerBottom <= platTop + 20;

    if (overlapsHorizontally && landingOnTop) {
      player.y = platTop - player.r;
      player.vy = 0;
      player.onGround = true;

      // Move the player along with the platform
      player.x += p.vx;

      // Activate the platform to make it move
      p.active = true;
    } else {
      // Deactivate the platform if the player is not on it
      p.active = false;
    }
  }
}

// ------------------------------------------------------------
// drawPlatforms()
// Draws all platforms.
// ------------------------------------------------------------
function drawPlatforms() {
  fill(PLATFORM_COLOR[0], PLATFORM_COLOR[1], PLATFORM_COLOR[2]);
  noStroke();

  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    rect(p.x, p.y, p.w, p.h, 6); // rounded corners
  }
}

// ------------------------------------------------------------
// drawPlayer()
// Draws the player using the character image.
// ------------------------------------------------------------
function drawPlayer() {
  image(
    character,
    player.x - player.r, // Center the image horizontally
    player.y - player.r, // Center the image vertically
    player.r * 2, // Width of the character image
    player.r * 2 // Height of the character image
  );
}

// ------------------------------------------------------------
// drawHUD()
// Displays instructions for the player.
// ------------------------------------------------------------
function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}
