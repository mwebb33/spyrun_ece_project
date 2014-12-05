var Camera = function(cameraSprite) {

	this.sprite = cameraSprite;
	this.sprite.buttonMode = false;
	this.sprite.interactive = true;
	this.rotationNum = 28;
	this.rotationDirection = true;
	this.rotationTicks = 56;
	this.rotationAmount = 0.025;
	this.sprite.pivot.y =  (this.sprite.height/2);
};


Camera.prototype.updateSprite = function(characterSprite) {
	this.sprite = characterSprite;
};


Camera.prototype.setPosition = function(x, y) {
		this.sprite.position.x = x;
		this.sprite.position.y = y;
};


Camera.prototype.translation = function(xAmount, yAmount) {

	/* Get the rectangle object that defines our coordinates */
	var bounds = this.sprite.getLocalBounds();

	/* Let the Game Board detect the entire rectangle for collision */
	var collisionDetected = gameBoard.detectCollision(this.sprite.position.x + xAmount, this.sprite.position.y + yAmount, bounds.width, bounds.height);

	/* Only move if no collision was detected */
	if(!collisionDetected) {
		this.setPosition(this.sprite.position.x + xAmount, this.sprite.position.y + yAmount);
	}
};


Camera.prototype.getPosition_x = function() {
	return this.sprite.position.x;
};


Camera.prototype.getPosition_y = function() {
	return this.sprite.position.y;
};


Camera.prototype.updatePosition = function() {

	/* Update the shadow and camera position on the map */	
	this.sprite.rotation += this.rotationAmount;
	this.shadow.rotation += this.rotationAmount;
	this.rotationNum += 1;
	if(this.rotationNum > this.rotationTicks) {
		this.rotationAmount = -this.rotationAmount;
		this.rotationNum = 0;
	}
	
};

Camera.prototype.getShadowLines = function() {

	/* Create a point to reference the camera's position */
	var reference = new PIXI.Point(0,0);

	/* Find the new end points for the shadow */
	var shadowAngle = Math.tan(this.shadow.width/this.shadow.height);
	console.log(Math.sin(this.shadow.rotation));



};






