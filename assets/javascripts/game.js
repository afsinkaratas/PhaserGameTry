var canvas = { width: 640, height: 480};
var game = new Phaser.Game(canvas.width, canvas.height, Phaser.AUTO, '',
  { preload: preload, create: create, update: update });

var backgroundGrass, grasses, hero, monsters, weapon, scoreText;
var startMenu = {};
var movementKeys, characterSelectKeys;
var charOffset = 0, start = false, lastDirection = 4, score = 0;

function preload() {

  game.load.image('background', 'assets/images/backgroundGrass.png');
  game.load.image('grass', 'assets/images/grass.png');
  game.load.image('monster', 'assets/images/monster.gif', 32, 32);
  game.load.image('bullet', 'assets/images/projectile.png', 20, 20);

  game.load.spritesheet('hero', 'assets/images/People1.png', 32, 32);
}

function create() {

  //Enable physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //World
  game.world.setBounds(0, 0, 2000, 2000);

  //Background
  for (var i=0; i < game.world.width; i+=canvas.width){
    for(var j=0; j < game.world.height; j+=canvas.height){
      backgroundGrass = game.add.sprite(i, j, 'background');
      backgroundGrass.width = canvas.width;
      backgroundGrass.height = canvas.height;
    }
  }

  //Start menu
  startMenu.text = game.add.text(canvas.width*0.5, canvas.height*0.4,
    "Movement: WASD Fire: LMB\nSelect a character to start the game");
  startMenu.text.anchor.set(0.5);
  startMenu.text.align = "center";

  //Hero icons and numbers
  startMenu.heros = [];
  startMenu.heroNumbers = [];
  for(var i=0; i < 8; i++){
    startMenu.heros[i] = game.add.sprite(canvas.width*0.125*i+32, canvas.height*0.6+16, 'hero');
    startMenu.heros[i].anchor.set(0.5);
    startMenu.heros[i].scale.setTo(1.3,1.3);
    startMenu.heros[i].frame = 1 + i*3 + Math.floor(i/4)*36;

    startMenu.heroNumbers[i] = game.add.text(canvas.width*0.125*i+32, canvas.height*0.7+16, i+1);
    startMenu.heroNumbers[i].anchor.set(0.5);
  }

  //Background grasses
  grasses = game.add.group();
  generateGrasses();
  grasses.visible = false;

  //Hero
  hero = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
  game.physics.arcade.enable(hero);
  hero.anchor.set(0.5);
  hero.scale.setTo(1.3,1.3);
  hero.speed = 100;
  hero.visible = false;
  hero.body.setCircle(16,1.3,1.3);
  game.camera.target = hero;

  //Monsters
  monsters = game.add.group();

  //Weapon
  weapon = game.add.weapon(30, 'bullet');
  weapon.bullets.forEach(
    function(bullet) {
      bullet.width = 24;
      bullet.height = 24;
      bullet.body.setCircle(12);
    }, this);
  weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
  weapon.bulletSpeed = 250;
  weapon.fireRate = 700

  //Score
  scoreText = game.add.text(0, 0, "");

  //Keys
  movementKeys = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S,
    'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );

  characterSelectKeys = game.input.keyboard.addKeys( { 'one': Phaser.KeyCode.ONE, 'two': Phaser.KeyCode.TWO,
    'three': Phaser.KeyCode.THREE, 'four': Phaser.KeyCode.FOUR, 'five': Phaser.KeyCode.FIVE,
    'six': Phaser.KeyCode.SIX, 'seven': Phaser.KeyCode.SEVEN, 'eight': Phaser.KeyCode.EIGHT } );

  escKey = game.input.keyboard.addKey(Phaser.KeyCode.ESC);
  escKey.onDown.add(restartGame);

  game.input.mouse.capture = true;

}

function update() {

  if(start){
    scoreText.x = game.camera.x + 10;
    scoreText.y = game.camera.y + 10;
    scoreText.text = "Score: " + Math.round(score);

    //Score
    score += 0.04;


    //Hero movement
    hero.body.velocity.setTo(0,0);

    if (movementKeys.up.isDown){
      if(movementKeys.left.isDown){
        hero.body.velocity.y = -hero.speed*Math.SQRT2/2
        hero.body.velocity.x = -hero.speed*Math.SQRT2/2
        hero.animations.play('upleft');
        lastDirection = 7;
      }
      else if(movementKeys.right.isDown){
        hero.body.velocity.y = -hero.speed*Math.SQRT2/2
        hero.body.velocity.x = hero.speed*Math.SQRT2/2
        hero.animations.play('upright');
        lastDirection = 1;
      }
      else{
        hero.body.velocity.y = -hero.speed;
        hero.animations.play('up');
        lastDirection = 0;
      }
    }
    else if (movementKeys.down.isDown)
    {
      if(movementKeys.left.isDown){
        hero.body.velocity.y = hero.speed*Math.SQRT2/2
        hero.body.velocity.x = -hero.speed*Math.SQRT2/2
        hero.animations.play('downleft');
        lastDirection = 5;
      }
      else if(movementKeys.right.isDown){
        hero.body.velocity.y = hero.speed*Math.SQRT2/2
        hero.body.velocity.x = hero.speed*Math.SQRT2/2
        hero.animations.play('downright');
        lastDirection = 3;
      }
      else{
        hero.body.velocity.y = hero.speed;
        hero.animations.play('down');
        lastDirection = 4;
      }
    }
    else if (movementKeys.left.isDown)
    {
        hero.body.velocity.x = -hero.speed;
        hero.animations.play('left');
        lastDirection = 6;
    }
    else if (movementKeys.right.isDown)
    {
        hero.body.velocity.x = hero.speed;
        hero.animations.play('right');
        lastDirection = 2;
    }
    else
    {
        hero.animations.stop();
        if(game.input.keyboard.lastKey!=null){
          if (game.input.keyboard.lastKey.keyCode == Phaser.KeyCode.W)
            hero.frame = 37 + charOffset;
          else if (game.input.keyboard.lastKey.keyCode == Phaser.KeyCode.A)
            hero.frame = 13 + charOffset;
          else if (game.input.keyboard.lastKey.keyCode == Phaser.KeyCode.D)
            hero.frame = 25 + charOffset;
          else if (game.input.keyboard.lastKey.keyCode == Phaser.KeyCode.S)
            hero.frame = 1 + charOffset;
        }
    }

    //Monster movement
    monsters.forEach(
      function(monster) {
        var xdif = hero.x-monster.x;
        var ydif = hero.y-monster.y;
        monster.body.velocity.x = (monster.speed/(Math.abs(xdif)+Math.abs(ydif))*xdif);
        monster.body.velocity.y = (monster.speed/(Math.abs(xdif)+Math.abs(ydif))*ydif);
      }, this);



    //Weapon fire
    if(game.input.activePointer.leftButton.isDown){
      weapon.fireFrom.setTo(hero.x, hero.y);
      weapon.fireAngle = game.physics.arcade.angleToPointer(hero) * 60;
      weapon.fire();
    }

    //Collision
    game.physics.arcade.overlap(weapon.bullets, monsters, dieMonster, null, this);
    game.physics.arcade.overlap(hero, monsters, youDied, null, this);

  }
  else{
    //Select character
    for(var i = 0; i < Object.keys(characterSelectKeys).length; i++ ){
      var curKey = characterSelectKeys[Object.keys(characterSelectKeys)[i]];
      if(curKey.isDown){
        var k = curKey.keyCode - 49;
        updateHeroAnimation( charOffset=(k*3 + Math.floor(k/4)*36) );
      }
    }

  }

}

function updateHeroAnimation(offset){

  // Hero animations
  hero.animations.add('up', [36+offset, 38+offset], 5, true);
  hero.animations.add('upleft', [36+offset, 12+offset, 38+offset, 14+offset], 5, true);
  hero.animations.add('upright', [36+offset, 24+offset, 38+offset, 26+offset], 5, true);
  hero.animations.add('right', [24+offset, 26+offset], 5, true);
  hero.animations.add('left', [12+offset, 14+offset], 5, true);
  hero.animations.add('down', [0+offset, 2+offset], 5, true);
  hero.animations.add('downleft', [0+offset, 12+offset, 2+offset, 14+offset], 5, true);
  hero.animations.add('downright', [0+offset, 24+offset, 2+offset, 26+offset], 5, true);
  hero.frame = 1 + offset
  startGame();
}

function startGame(){

  startMenu.text.visible = false;
  for(var i=0; i < 8; i++){
    startMenu.heros[i].visible = false;
    startMenu.heroNumbers[i].visible = false;
  }
  grasses.visible = true;
  hero.visible = true;
  start = true;
  //monster timer
  monsterSpawnTimer = game.time.create(false);
  monsterSpawnTimer.loop(2000 + Math.random() * 2000, generateMonsters);
  monsterSpawnTimer.start();
}

function restartGame(){

  startMenu.text.visible = true;
  for(var i=0; i < 8; i++){
    startMenu.heros[i].visible = true;
    startMenu.heroNumbers[i].visible = true;
  }
  grasses.removeAll(true);
  generateGrasses();
  grasses.visible = false;
  resetHero();
  hero.visible = false;
  monsters.removeAll(true);
  monsterSpawnTimer.destroy();
  start = false;
  score = 0;

  game.camera.x = 0;
  game.camera.y = 0;
}

function generateGrasses(){

  for (var i = 0; i < 1000; i++) {
    var grass = grasses.create(Math.random()*game.world.width, Math.random()*game.world.height, 'grass');
    grass.anchor.set(0.5);
    grass.width = canvas.width*0.1;
    grass.height = canvas.height*0.1;
  }
}

function resetHero(){

  hero.x = game.world.centerX;
  hero.y = game.world.centerY;
}

function generateMonsters(){

  var loc = monsterLocation();
  var monster = monsters.create(loc.x + hero.x, loc.y + hero.y, 'monster');
  game.physics.arcade.enable(monster);
  monster.width = canvas.width*0.12;
  monster.height = canvas.height*0.12;
  monster.speed = 90;
  monster.body.setCircle(monster.width*0.35, monster.width*0.78, monster.height*0.78);
}

function monsterLocation(){

  var radius = 400, pt_x = 0, pt_y = 0;
  while(Math.sqrt(pt_x*pt_x+pt_y*pt_y)<200){
    var pt_angle = Math.random() * 2 * Math.PI;
    var pt_radius_sq = Math.random() * radius * radius;
    pt_x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
    pt_y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
  }
  return {x: pt_x, y: pt_y};
}

function dieMonster(bullet, monster){
  bullet.kill();
  monster.kill();
  score += 100;
}

function youDied(hero, monster){
  monster.kill();
  restartGame();
}

