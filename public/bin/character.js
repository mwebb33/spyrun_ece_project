var Character = function(render) {
	var charSpriteContainer = new PIXI.DisplayObjectContainer();
	var charSpriteContainerT = new PIXI.DisplayObjectContainer();

	spyWalkMovB = new PIXI.MovieClip(spyWalkB);
		spyWalkMovB.animationSpeed = .1;
		spyWalkMovB.playing = true;

	spyWalkMovTransB = new PIXI.MovieClip(spyWalkTransB);
		spyWalkMovTransB.animationSpeed = .1;
		spyWalkMovTransB.playing = true;

	charSpriteContainer.addChild(spyWalkMovB);
	charSpriteContainer.addChild(spyWalkMovTransB);
	this.charSprite = charSpriteContainer;

	this.charSprite.children[0].x = 0;
	this.charSprite.children[0].y = 0;

	this.charSprite.pivot = new PIXI.Point(32,32);

	this.charSprite.buttonMode = false;
	this.charSprite.interactive = false;

	this.charSprite.children[0].visible = true;
	this.charSprite.children[1].visible = false;

	this.thisName = new PIXI.Text(clientName, {font:"16px Consolas", fill:"white", align:"center"});
	this.thisName.position.x = 120;
	this.thisName.position.y = 50;
	this.thisName.anchor.set(0.5, 0);
	this.thisName.style.align = "center";
	this.speed = false;
	this.counter = 0;
	this.fastcount = 0;
	this.inviscount = 0;
	this.scorecount = 0;

	this.invisBool = false; 
	this.runFastBool = false; 
	this.locLvl; 
	this.counter2 = 0;


	if( render ){
		stage.addChild(this.charSprite);
		stage.addChild(this.thisName);
	}

	this.setPosition(125, 95);
	this.moving = false; 
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
	this.invisBool = json.invis; 
	this.runFastBool = json.fast;
	this.locLvl = json.lvl; 

	if(this.runFastBool){
		this.charSprite.children[0].animationSpeed = 0.4;
		this.charSprite.children[1].animationSpeed = 0.4;
	} 
	else 
	{
		this.charSprite.children[0].animationSpeed = 0.1;
		this.charSprite.children[1].animationSpeed = 0.1;
	}

	if(this.invisBool){
		this.charSprite.children[0].visible = false;
		this.charSprite.children[1].visible = true;
	}
	else 
	{
		this.charSprite.children[0].visible = true;
		this.charSprite.children[1].visible = false;
	}

	this.charSprite.children[0].playing = json.moving; 
	this.charSprite.children[1].playing = json.moving; 
}

Character.prototype.addChar = function() {
	stage.addChild(this.charSprite);
	stage.addChild(this.thisName);
};

Character.prototype.removeChar = function() {
	stage.removeChild(this.charSprite);
	stage.removeChild(this.thisName);
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
	obj.invis = this.invisBool; 
	obj.fast = this.runFastBool;
	obj.lvl = level; 
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
		if(this.invisBool == false){
			this.setPosition(125,95);
		} else {
			this.setPosition(this.charSprite.position.x + xAmount, this.charSprite.position.y + yAmount);
		}
	}

	else if(collisionDetected == 3) {
		//var style = {font:"70px Arial", fill:"red"};
		//var score = new PIXI.Text("Finished level!!!",style);
		//score.position.x = 350;
		//score.position.y = 200;
		//gameContainer.addChild(score);
	}

	else if(collisionDetected == 4) {
		if(this.fastcount == 0){
			this.counter = 200;
			this.fastcount = 1000;
		}
		this.setPosition(this.charSprite.position.x + xAmount, this.charSprite.position.y + yAmount);
	}

	else if(collisionDetected == 5) {
		if(this.inviscount == 0){
			this.counter2 = 200;
			this.inviscount = 1000;
			this.invisBool = true;
		}
		this.setPosition(this.charSprite.position.x + xAmount, this.charSprite.position.y + yAmount);
	}

	else if(collisionDetected == 6) {
		if(this.scorecount == 0){
			gameBoard.score += 1000;
			this.scorecount = 1000;
		}
		this.setPosition(this.charSprite.position.x + xAmount, this.charSprite.position.y + yAmount);
	}
};

Character.prototype.sendState = function () {
	socket.emit('client', this.getState());
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
	} else {

	}
};

Character.prototype.getPosition_x = function() {
	return this.charSprite.children[0].position.x;
};

Character.prototype.getPosition_y = function() {
	return this.charSprite.children[0].position.y;
};

Character.prototype.updatePosition = function() {
	var dirLeft = key.isDown(key.LEFT);
	var dirRight = key.isDown(key.RIGHT);
	var dirDown = key.isDown(key.DOWN);
	var dirUp = key.isDown(key.UP);

	if(touched) {
		if(this.charSprite.position.x - currentMousePos.x > 3) dirLeft = true;
		if(this.charSprite.position.x - currentMousePos.x < -3) dirRight = true;
		if(this.charSprite.position.y - currentMousePos.y > 3) dirUp = true;
		if(this.charSprite.position.y - currentMousePos.y < -3) dirDown = true;
	}

	this.rotateCardinal(dirLeft,dirRight,
		dirDown,dirUp);

	this.updateAnimationState(dirLeft,dirRight,
		dirDown,dirUp);

	if(this.counter <= 0){
		this.runFastBool = false; 

		if(dirRight && dirUp){
			this.translation(2,-2);
		} else if(dirLeft && dirUp) {
			this.translation(-2,-2);
		} else if(dirLeft && dirDown) {
			this.translation(-2,2);
		} else if(dirRight && dirDown) {
			this.translation(2,2);
		} else if(dirLeft){
			this.translation(-2,0);
		} else if(dirUp) {
			this.translation(0,-2);
		} else if(dirDown) {
			this.translation(0,2);
		} else if(dirRight) {
			this.translation(2,0);
		}
	}
	else{
		this.runFastBool = true; 

		if(dirRight && dirUp){
			this.translation(4,-4);
		} else if(dirLeft && dirUp) {
			this.translation(-4,-4);
		} else if(dirLeft && dirDown) {
			this.translation(-4,4);
		} else if(dirRight && dirDown) {
			this.translation(4,4);
		} else if(dirLeft){
			this.translation(-4,0);
		} else if(dirUp) {
			this.translation(0,-4);
		} else if(dirDown) {
			this.translation(0,4);
		} else if(dirRight) {
			this.translation(4,0);
		}
	}
};

Character.prototype.updateAnimationState = function(dirLeft,dirRight,dirDown,dirUp) {
	if(this.runFastBool){
		this.charSprite.children[0].animationSpeed = 0.4;
		this.charSprite.children[1].animationSpeed = 0.4;
	} 
	else 
	{
		this.charSprite.children[0].animationSpeed = 0.1;
		this.charSprite.children[1].animationSpeed = 0.1;
	}


	if(this.invisBool){
		this.charSprite.children[0].visible = false; 
		this.charSprite.children[1].visible = true;	//invis
	}
	else 
	{
		this.charSprite.children[0].visible = true; 
		this.charSprite.children[1].visible = false; //invis 
	}


	if(dirRight || dirLeft || dirDown || dirUp)
	{
		this.moving = true;
		this.charSprite.children[0].playing = true;
		this.charSprite.children[1].playing = true;
	}
	else 
	{
		this.moving = false;
		this.charSprite.children[0].playing = false;
		this.charSprite.children[1].playing = false;
	}
}
