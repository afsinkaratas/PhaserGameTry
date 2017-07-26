var canvas = { width: 640, height: 480};
var game = new Phaser.Game(canvas.width, canvas.height, Phaser.AUTO, '',
  { preload: preload, create: create, update: update });

var backgroundGrass, grasses, hero;

function preload() {

  game.load.image('background', 'assets/images/backgroundGrass.png');
  game.load.image('grass', 'assets/images/grass.png');
  game.load.image('hero', 'assets/images/hero.png');
  game.load.image('monster', 'assets/images/monster.gif');

}

function create() {

  //background
  backgroundGrass = game.add.sprite(0, 0, 'background');
  backgroundGrass.width = canvas.width;
  backgroundGrass.height = canvas.height;

  //background grasses
  grasses = game.add.group();
  for (var i = 0; i < 100; i++) {
    var grass = grasses.create(Math.random()*canvas.width, Math.random()*canvas.height, 'grass');
    grass.anchor.setTo(0.5, 0.5);
    grass.width = canvas.width*0.1;
    grass.height = canvas.height*0.1;
  }

  //hero
  hero = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
  hero.anchor.setTo(0.5, 0.5);
  hero.width = canvas.width*0.12;
  hero.height = canvas.height*0.12;

}

function update() {



}