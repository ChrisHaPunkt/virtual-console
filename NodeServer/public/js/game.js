define([
     'phaser'
], function (Phaser) {
     'use strict';

     function Game() {
          console.log('Making the Game');
     }
     //preamble
     var game;
     var cars = [];
     var carColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00];
     var carTurnSpeed = 250;

     var carGroup;
     var obstacleGroup;
     var targetGroup;

     var obstacleSpeed = 150;
     var obstacleDelay = 1400;

     Game.prototype = {
          constructor: Game,

          start: function() {
                    game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
                    preload: this.preload,
                    create: this.create
               });
          },

          preload: function() {
               game.load.image('logo', 'js/2cars/car.png');
               game.load.image("road", "js/2cars/road.png");
               game.load.image("target", "js/2cars/target.png");
               game.load.image("car", "js/2cars/car.png");
               game.load.image("obstacle", "js/2cars/obstacle.png");
          },

          create: function() {
               var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
               logo.anchor.setTo(0.5, 0.5);
               game.add.image(0, 0, "road");
               game.physics.startSystem(Phaser.Physics.ARCADE);
               carGroup = game.add.group();
               obstacleGroup = game.add.group();
               targetGroup = game.add.group();
               for(var i = 0; i < 4; i++){
                    cars[i] = game.add.sprite(0, game.height - 80, "car");
                    cars[i].number = i;
                    cars[i].positions = [(640/8 - 40)*(i*4+1), (640/8 - 40)*(i*4+1)+80];
                    cars[i].anchor.set(0.5);
                    cars[i].tint = carColors[i];
                    cars[i].canMove = true;
                    cars[i].side = 0;
                    cars[i].x = cars[i].positions[0];
                    game.physics.enable(cars[i], Phaser.Physics.ARCADE);
                    cars[i].body.allowRotation = false;
                    cars[i].body.moves = false;
                    carGroup.add(cars[i]);
               }
               game.input.onDown.add(moveCar);
               //ADD OBSTACLES
          },
          update: function(){
               game.physics.arcade.collide(carGroup, obstacleGroup, function(){
                    game.state.start("PlayGame");
               });
               game.physics.arcade.collide(carGroup, targetGroup, function(c, t){
                    t.destroy();
               });
          }
     };
     function moveCar(e){
          var carToMove = Math.floor(e.position.x / (game.width / 4));
          if(cars[carToMove].canMove){
               cars[carToMove].canMove = false;
               var steerTween = game.add.tween(cars[carToMove]).to({
                    angle: 20 - 40 * cars[carToMove].side
               }, carTurnSpeed / 2, Phaser.Easing.Linear.None, true);
               steerTween.onComplete.add(function(){
                    var steerTween = game.add.tween(cars[carToMove]).to({
                         angle: 0
                    }, carTurnSpeed / 2, Phaser.Easing.Linear.None, true);
               })
               cars[carToMove].side = 1 - cars[carToMove].side;
               var moveTween = game.add.tween(cars[carToMove]).to({
                    x: cars[carToMove].positions[cars[carToMove].side],
               }, carTurnSpeed, Phaser.Easing.Linear.None, true);
               moveTween.onComplete.add(function(){
                    cars[carToMove].canMove = true;
               })
          }
     }



     return Game;
});