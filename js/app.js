"use strict";

// Object classes
  // Enemies our player must avoid
function Enemy() {
    const orientation = ['left', 'right'];
    const startX = [0, 101, 202, 303, 404, 505];

    // Randomly chooses if the foe will move towards right or left
    this.dir = orientation[Math.round(Math.random())];
    // Randomly chooses between starting preset starting points on the X axis
    this.x = startX[Math.floor(Math.random(5) * startX.length)];
    // Steps down starting points on Y axis as enemies are added
    this.y = 50 + allEnemies.length * 85;
    // Randomly sets a speed factor for each enemy, with a floor increasing per difficulty level
    this.speed = Math.random() * 300 + 50 * ui.level;

    // Sets the correct sprite image according to enemy direction
    if (this.dir == 'left') {
      this.sprite = 'images/enemy-bug-left.png';
    } else {
      this.sprite = 'images/enemy-bug.png';
    }
}
  // Player sprite
function Player() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 550;
}
  // On-screen text and information
function UserInterface() {
  this.lives = 5;
  this.heartSprite = 'images/Heart.png';
  this.level = 1;
  this.text1 = ``;
  this.text2 = ``;
  this.text3 = ``;
  this.levelText = ``;
}

// Draw the objects on the canvas --- .render prototype functions
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

UserInterface.prototype.render = function () {
    ctx.font = '36pt Arial Black';
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;

    ctx.strokeText(this.text1, 90, 200);
    ctx.fillText(this.text1, 90, 200);
    ctx.strokeText(this.text2, 30, 300);
    ctx.fillText(this.text2, 30, 300);
    ctx.strokeText(this.text3, 80, 350);
    ctx.fillText(this.text3, 80, 350);
    ctx.strokeText(this.levelText, 5, 736);
    ctx.fillText(this.levelText, 5, 736);

    // Draws 1 heart per life left, scaled down from original with a sligth offset so they stack a little
    for (let i = 0; i < this.lives; i++) {
      ctx.drawImage(Resources.get(this.heartSprite), 450 - i * 30, 676, 50, 85);
    }
};


// Update the object values --- .update prototype functions dt = time delta between ticks
Player.prototype.update = function(dt) {
  };

Enemy.prototype.update = function(dt) {
    // If headed left
    if (this.dir == 'left') {
        // Changes X axis according to speed and dt
        this.x -= (this.speed * dt);
        // If enemy falls out of canvas, send it to the other side so it falls back in
        if (this.x < (0 - Resources.get(this.sprite).width)) {
            this.x = 505;
        }
    } else {
        // Changes X axis according to speed and dt
        this.x += (this.speed * dt);
        // If enemy falls out of canvas, send it to the other side so it falls back in
        if (this.x > 505) {
            this.x = -Resources.get(this.sprite).width;
        }
    }
    // Verifies if on the same general Y axis as player sprite
    if ((this.y - 50 <= player.y) && (this.y + 50 >= player.y)) {
      // Verifies if on the same general Y axis as player sprite
      if ((this.x >= player.x - 45) && (this.x <= player.x + 45)) {
        //if both true, lose 1 life and reset player position
        ui.lives--;
        player.x = 200;
        player.y = 550;
        // If no lives left remove enemies and update game message
        if (this.lives == 0) {
          allEnemies = [];
          this.text1 = `GAME OVER`;
          this.text2 = `Press SPACEBAR`;
          this.text3 = `to play again!`;
        }
      }
    }
  };

UserInterface.prototype.update = function(dt) {
    this.levelText = `Level ${this.level}`;
};

// Handle keyboard input from user
Player.prototype.handleInput = function(key) {
    const self = this;
    //If game over screen is present, press spacebar to reset game and text
    if (ui.lives === 0) {
        if (key === 'spacebar') {
        ui.lives = 5;
        ui.text1 = ``;
        ui.text2 = ``;
        ui.text3 = ``;
        allEnemies.push(new Enemy());
        ui.level = 1;
      }
    //Otherwise let the player move if it won't take him out of the canvas
    } else {
        if ((key === 'left') && (this.x > 50)) {
            this.x -= 100;
        } else if ((key == 'right') && (this.x < 400)) {
            this.x +=100;
        } else if ((key == 'up') && (this.y > 0)) {
            this.y -= 85;
            //If the player sprite makes it to the last row
            if (this.y < 25) {
              // Timeout so the user can "see" actually hitting the last line
              setTimeout(function() {
                // Send player back to start
                self.x = 200;
                self.y = 550;

                // Clear enemies and raises level if all rows are taken
                if (allEnemies.length == 5) {
                  allEnemies = [];
                  ui.level++;
                }
                // Generates new enemy
                allEnemies.push(new Enemy());
              }, 500);
            }
        } else if ((key == 'down') && (this.y < 550)) {
            this.y += 85;
        }
    }
};

// Listens for key presses and sends the keys to Player.handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Generates the player sprite and the interface info
let player = new Player();
let ui = new UserInterface();

// Creates array for enemies and adds the first one
let allEnemies = [];
allEnemies.push(new Enemy());
