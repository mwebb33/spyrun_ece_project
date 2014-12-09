var Character = function(spyWalk , render) {
	var charSpriteContainer = new PIXI.DisplayObjectContainer();

	spyWalkMovB = new PIXI.MovieClip(spyWalk);
		spyWalkMovB.animationSpeed = .1;
		spyWalkMovB.gotoAndPlay(1);

	charSpriteContainer.addChild(spyWalkMovB);
	this.charSprite = charSpriteContainer;

	this.charSprite.children[0].x = 0;
	this.charSprite.children[0].y = 0;
	this.charSprite.pivot = new PIXI.Point(32,32);
	this.charSprite.buttonMode = true;
	this.charSprite.interactive = true;

	this.thisName = new PIXI.Text(clientName, {font:"16px Consolas", fill:"white", align:"center"});
	this.thisName.position.x = 120;
	this.thisName.position.y = 50;
	this.thisName.anchor.set(0.5, 0);
	this.thisName.style.align = "center";
	
	if( render ){
		stage.addChild(this.charSprite);
		stage.addChild(this.thisName);
	}
	this.setPosition(125, 95);
	this.moving = false; 
	ws.send(this.getState(), {mask: true});
};

Character.prototype.updateName = function(name) {
	this.thisName.setText(name);
};

Character.prototype.JSONupdate = function(json) {
	this.charSprite.position.x = json.x; 
	this.charSprite.position.y = json.y; 
	this.thisName.position.x = json.x - 5;
	this.thisName.position.y = json.y - 45;
	this.charSprite.rotation = parseFloat(json.rot); 
	this.thisName.setText(json.name);
	console.log(json.name + "moving? :" + json.moving);
	this.charSprite.children[0].playing = json.moving; 
}

Character.prototype.updateSprite = function(characterSprite) {
	this.charSprite = characterSprite;
};

Character.prototype.setPosition= function(x, y) {
		this.charSprite.position.x = x;
		this.charSprite.position.y = y;
		this.thisName.position.x = x - 5;
		this.thisName.position.y = y - 45;
};

Character.prototype.getState= function() { 
	
	//Create JSON for char
	var obj = new Object();
	obj.name = this.thisName.text;
	obj.x = this.charSprite.position.x;
	obj.y = this.charSprite.position.y;
	obj.rot = this.charSprite.rotation.toFixed(2);
	obj.moving = this.moving; 
	var charState = JSON.stringify(obj);
	return charState;
};

Character.prototype.translation = function(xAmount, yAmount) {
	/* Get the rectangle object that defines our coordinates */
	//var bounds = this.charSprite.getLocalBounds();

	/* Let the Game Board detect the entire rectangle for collision */
	var collisionDetected = gameBoard.detectCollision(this.charSprite.position.x + xAmount -  22, this.charSprite.position.y + yAmount - 20, 46, 50);

	/* Only move if no collision was detected */
	if(collisionDetected == 0) {
		this.setPosition(this.charSprite.position.x + xAmount, this.charSprite.position.y + yAmount);
	}

	else if(collisionDetected == 2) {
		this.setPosition(125,95);
	}

	else if(collisionDetected == 3) {
		var style = {font:"70px Arial", fill:"red"};
		var score = new PIXI.Text("Your Score Is 4,000!!!",style);
		score.position.x = 350;
		score.position.y = 200;
		gameContainer.addChild(score);
	}
};

Character.prototype.sendState = function () {
	ws.send(this.getState(), {mask: true});
}

Character.prototype.rotateCardinal = function(dirLeft,dirRight,dirDown,dirUp) {

	/* Only move if no collision was detected */
	if(dirRight) {
		this.charSprite.rotation = 0;
	}
	else if(dirUp) {
		this.charSprite.rotation = (3*Math.PI)/2;
	}
	else if(dirLeft) {
		this.charSprite.rotation = Math.PI;
	}
	else if (dirDown) {
		this.charSprite.rotation = Math.PI/2;
	}

	/* Only move if no collision was detected */
	if(dirRight && dirUp) {
		this.charSprite.rotation = (3*Math.PI)/2 + Math.PI/4;
	}
	else if(dirLeft && dirUp) {
		this.charSprite.rotation = Math.PI + Math.PI/4;
	}
	else if(dirLeft && dirDown) {
		this.charSprite.rotation = Math.PI - Math.PI/4;
	}
	else if(dirRight && dirDown) {
		this.charSprite.rotation = 0 + Math.PI/4;
	} else {}
};

Character.prototype.getPosition_x = function() {
	return this.charSprite.children[0].position.x;
};

Character.prototype.getPosition_y = function() {
	return this.charSprite.children[0].position.y;
};

Character.prototype.updatePosition = function() {

	this.rotateCardinal(key.isDown(key.LEFT),key.isDown(key.RIGHT),
		key.isDown(key.DOWN),key.isDown(key.UP));

	this.updateAnimationState(key.isDown(key.LEFT),key.isDown(key.RIGHT),
		key.isDown(key.DOWN),key.isDown(key.UP));

	if(key.isDown(key.LEFT)){
		this.translation(-2,0);
	}
	if(key.isDown(key.UP)) {
		this.translation(0,-2);
	}
	if(key.isDown(key.DOWN)) {
		this.translation(0,2);
	}
	if(key.isDown(key.RIGHT)) {
		this.translation(2,0);
	}
};

Character.prototype.updateAnimationState = function(dirLeft,dirRight,dirDown,dirUp) {

	if(dirRight || dirLeft || dirDown || dirUp)
	{
		this.moving = true;
		this.charSprite.children[0].playing = true;
	}
	else 
	{
		this.moving = false;
		this.charSprite.children[0].playing = false;
	}
}
