var Character = function(container) {
	this.charSprite = container;
	this.charSprite.children[0].x = 0;
	this.charSprite.children[0].y = 0;
	this.charSprite.pivot = new PIXI.Point(32,32);
	this.charSprite.buttonMode = true;
	this.charSprite.interactive = true;
};

Character.prototype.updateSprite = function(characterSprite) {
	this.charSprite = characterSprite;
};

Character.prototype.setPosition = function(x, y) {
		this.charSprite.position.x = x;
		this.charSprite.position.y = y;
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
	}
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
		this.charSprite.children[0].playing = true;
	} 
	else 
	{
		this.charSprite.children[0].playing = false;
	}
}
