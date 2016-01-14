define([
     'phaser', 'gameApi'
], function (Phaser, gameApi) {
     'use strict';

     function Game() {
          console.log('Making the Game');
     }
     //preamble
     var game;
     var cars = [];
     var carsToUser = {};
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
     function moveCar(carToMove){

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


     /**
      * HANDSHAKE
      * */
     gameApi.frontendConnection = function (connInfoObj) {
          gameApi.addLogMessage(gameApi.log.INFO, 'conn', connInfoObj + " " + gameApi.socket.id);
          this.emit('frontendOutboundMessage', {type: 'setControllerTemplate', data: gameApi.controller});
     };

     /**
      * INCOMING DATA HANDLING
      * */
     gameApi.frontendInboundMessage = function (data) {

          var clientName = data.data.clientName;
          var message = data.data.message;

          //console.log(data);

          switch (data.type) {
               case "userConnection":
                    gameApi.addLogMessage(gameApi.log.INFO, 'client', 'Client ' + clientName + ' ' + message);

                    if (message === 'connected') {
                        addCarIfPossible(clientName);
                    } else if (message === 'disconnected') {
                        removeCar(clientName);
                    }
                    break;
               case "button":
                    moveCar(carsToUser[clientName]);
                   console.log(clientName);
                    break;
               case "accelerationData":

                    break;
               case "orientationData":
                    addLine(clientName, 'ORIENTATION | ' + message.orientationAlpha + ' | ' + message.orientationBeta + ' | ' + message.orientationGamma);
                    break;
               default:
                    break;
          }
     };

     var addCarIfPossible = function (clientName) {
         if(!cars[0]){
             newCar(0);
             carsToUser[clientName] = 0;

         }
         else if(!cars[1]){
             newCar(1);
             carsToUser[clientName] = 1;
         }
         else if(!cars[2]){
             newCar(2);
             carsToUser[clientName] = 2;
         }
         else if(!cars[3]){
             newCar(3);
             carsToUser[clientName] = 3;
         }
         else {
             //TODO: send message to User that game is full
         }

     };

     var newCar = function (i) {
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
    };
     var removeCar = function (clientName) {
         cars[carsToUser[clientName]].destroy();
         cars[carsToUser[clientName]] = null;
     };



     /**
      * GAME INIT
      * */
     var gameSocketInstance = gameApi.init();

     return Game;
});