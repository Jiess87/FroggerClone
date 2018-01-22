let allLives = [];

let allEnemies = [];
let player = new Player();
let levelText = new Level();
let gameOver = new GameOver();

allEnemies.push(new Enemy());
allLives.push(new Life());
allLives.push(new Life());
allLives.push(new Life());
// Enemies our player must avoid
function Enemy() {
    let orientation = ['left', 'right'];
    let startX = [0, 101, 202, 303, 404, 504];

    this.dir = orientation[Math.round(Math.random())];
    this.x = startX[Math.floor(Math.random(5) * startX.length)];
    this.y = 50 + allEnemies.length * 85;
    this.speed = (Math.random() * 300 * player.level) + 85;

    if (this.dir == 'left') {
      this.sprite = 'images/enemy-bug-left.png';
    } else {
      this.sprite = 'images/enemy-bug.png';
    }
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.dir == 'left') {
        this.x -= (this.speed * dt);
        if (this.x < (0 - Resources.get(this.sprite).width)) {
            // Start the enemy off the left edge of the canvas so it comes on in motion
            this.x = 505;
        }
    } else {
        this.x += (this.speed * dt);
        if (this.x > 505) {
            // Start the enemy off the left edge of the canvas so it comes on in motion
            this.x = -Resources.get(this.sprite).width;
        }
    }
    if ((this.y - 50 <= player.y) && (this.y + 50 >= player.y)) {
      if ((this.x >= player.x - 45) && (this.x <= player.x + 45)) {
        player.x = 200;
        player.y = 550;
        allLives.pop();
      }
    }
  }

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function Player() {

  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 550;
  this.level = 1;

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

Player.prototype.update = function(dt) {
    if (this.y < 25) {
      setTimeout( function() {
        player.x = 200;
        player.y = 550;
        if (allEnemies.length == 5) {
          player.level++;
          allEnemies = [];
        }
        allEnemies.push(new Enemy());
      }, dt);
    }
};

// Draw the Player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if ((allLives.length == 0) && (key === 'spacebar')) {
      allLives.push(new Life());
      allLives.push(new Life());
      allLives.push(new Life());
      allEnemies.push(new Enemy());
      player.level = 1;
      return
    } else if ((key === 'left') && (this.x > 50) && (allLives.length != 0)) {
        this.x -= 100;
    } else if ((key == 'right') && (this.x < 400) && (allLives.length != 0)) {
        this.x +=100;
    } else if ((key == 'up') && (this.y > 0)  && (allLives.length != 0)) {
        this.y -= 85;
    } else if ((key == 'down') && (this.y < 550)) {
        this.y += 85;
    }
}

function Life() {
    this.sprite = 'images/Heart.png';
    this.x = 450 - allLives.length * 50;
    this.y = 675;
}

Life.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 85);
}

Life.prototype.update = function () {
    if (allLives.length == 0) {

    }
}

function Level() {
    this.x = 5 ;
    this.y = 736;
}

Level.prototype.render = function () {
    ctx.font = '36pt Arial Black';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.strokeText(`Level ${player.level}`, this.x, this.y,);
    ctx.fillText(`Level ${player.level}`, this.x, this.y,)
}

function GameOver() {
    this.x = 90;
    this.y = 200;
}

GameOver.prototype.render = function () {
    ctx.font = '36pt Arial Black';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;

    if (allLives.length == 0) {
      ctx.strokeText(`GAME OVER`, this.x, this.y,);
      ctx.fillText(`GAME OVER`, this.x, this.y,);
      ctx.strokeText(`Press SPACEBAR`, this.x - 55, this.y + 100);
      ctx.fillText(`Press SPACEBAR`, this.x - 55, this.y + 100);
      ctx.strokeText(`to play again!`, this.x - 10, this.y + 150);
      ctx.fillText(`to play again!`, this.x - 10, this.y + 150);
      allEnemies = [];
      player.x = 200;
      player.y = 550;
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
