var game;



window.onload = function() {
	game = new Phaser.Game(640, 480, Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
	preload: function(){
          game.load.image("road", "js/2cars/road.png");
          game.load.image("target", "js/2cars/target.png");
          game.load.image("car", "js/2cars/car.png");
          game.load.image("obstacle", "js/2cars/obstacle.png");
	},
  	create: function(){
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
          game.time.events.loop(obstacleDelay, function(){
               for(var i = 0; i < 2; i++){
                    if(game.rnd.between(0, 1) == 1){
                         var obstacle = new Obstacle(game, i);
                         game.add.existing(obstacle);
                         obstacleGroup.add(obstacle);
                    }
                    else{
                         var target = new Target(game, i);
                         game.add.existing(target);
                         targetGroup.add(target);
                    }
               }
          });
	},
     update: function(){
          game.physics.arcade.collide(carGroup, obstacleGroup, function(){
               game.state.start("PlayGame");
          });
          game.physics.arcade.collide(carGroup, targetGroup, function(c, t){
               t.destroy();
          });
     }
}

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

Obstacle = function (game, lane) {
     var position = game.rnd.between(0, 1) + 2 * lane;
	Phaser.Sprite.call(this, game, game.width * (position * 2 + 1) / 8, -20, "obstacle");
	game.physics.enable(this, Phaser.Physics.ARCADE);
     this.anchor.set(0.5);
     this.tint = carColors[Math.floor(position / 2)];
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height){
		this.destroy();
	}
};

Target = function (game, lane) {
     var position = game.rnd.between(0, 1) + 2 * lane;
	Phaser.Sprite.call(this, game, game.width * (position * 2 + 1) / 8, -20, "target");
	game.physics.enable(this, Phaser.Physics.ARCADE);
     this.anchor.set(0.5);
     this.tint = carColors[Math.floor(position / 2)];
};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function() {
	this.body.velocity.y = obstacleSpeed;
	if(this.y > game.height - this.height / 2){
		game.state.start("PlayGame");
	}
};