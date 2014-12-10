var Camera = function(cameraSprite) {

	this.sprite = cameraSprite;
	this.sprite.buttonMode = false;
	this.sprite.interactive = true;
	this.rotationNum = 28; 			//The starting rotation number for the camera
	this.rotationDirection = true; 	//I don't think this is used anymore
	this.rotationTicks = 56; 		//The number of ticks to rotate before restarting
	this.rotationAmount = 0.025; 	//How much to rotate per tick
	this.sprite.pivot.y =  (this.sprite.height/2); //Pivot location on the Sprite for rotating
	this.shadowHeight;
	this.shadowWidth;

	this.old_x;
	this.old_y;
	this.old_mid_x;
	this.old_mid_y;
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
	//console.log(this.shadow.position);
	this.sprite.rotation += this.rotationAmount;
	this.shadow.rotation += this.rotationAmount;
	this.rotationNum += 1;
	if(this.rotationNum > this.rotationTicks) {
		this.rotationAmount = -this.rotationAmount;
		this.rotationNum = 0;
	}
};

/**
 	This updates the shadow lines for a given camera 
 **/
Camera.prototype.getShadowLines = function(GameBoard) {

	/* Create a point to reference the camera's position */
	var reference = new PIXI.Point(0,0);
	var diff = this.shadow.toGlobal(reference);

	/* Get the current point of the shadow */
	var x = this.shadow.position.x;
	var y = this.shadow.position.y;

	var x = x - (Math.cos(this.shadow.rotation) * this.sprite.width);
	var y = y - (Math.sin(this.shadow.rotation) * this.sprite.height);
	//console.log(x + " " + y);

	/* Find the new end points for the shadow */
	var shadowAngle = Math.tan((this.shadowWidth/2)/this.shadowHeight);
	//shadowAngle = (shadowAngle * Math.PI)/180; //Convert to radians -- already in radians!
	var mid_x = (Math.cos(shadowAngle + this.shadow.rotation) * this.shadowHeight) + x;
 	var mid_y = (Math.sin(shadowAngle + this.shadow.rotation) * this.shadowWidth) + y;

 	/* Now update the GameBoard */
 	gameBoard.drawLine(Math.floor(this.old_x), Math.floor(this.old_y), Math.floor(this.old_mid_x), Math.floor(this.old_mid_y), 0);
 	gameBoard.drawLine(Math.floor(x), Math.floor(y), Math.floor(mid_x), Math.floor(mid_y), 2);

 	this.old_x = x;
 	this.old_y = y;
 	this.old_mid_x = mid_x;
 	this.old_mid_y = mid_y;
};



/**
 	This draws the shadow for the camera to the map, and sets the approiate orientation and
	attributes for the camera 
**/
Camera.prototype.drawCamera = function(cameraInfo, index) {

	this.shadow.beginFill(0xFFFF0B, .5);
	/* Check the starting orientation of the camera (right/left) */
	if(cameraInfo.pivot[index] == 0) {
		
		/* Draw the shadow on the map */
		this.shadow.moveTo(cameraInfo.position[index][0] + this.sprite.width, cameraInfo.position[index][1]);
		this.shadow.lineTo(cameraInfo.position[index][0] + cameraInfo.height[index], cameraInfo.position[index][1] + cameraInfo.width[index]);
		this.shadow.lineTo(cameraInfo.position[index][0] + cameraInfo.height[index], cameraInfo.position[index][1] - cameraInfo.width[index]);

		/* Set the proerties for rotation */
		this.shadow.position.x = cameraInfo.position[index][0];
		this.shadow.position.y = cameraInfo.position[index][1];
		this.shadow.pivot.x = cameraInfo.position[index][0];
		this.shadow.pivot.y = cameraInfo.position[index][1];

		/* Now add the shadow lines for detection */
		gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x + this.shadowHeight, this.shadow.position.y + this.shadowWidth, 2);
	}
	else if(levelMaps.Cameras[0].pivot[index] == this.sprite.width) {

		/* Change the camera's pivot point since we're looking to the left */
		this.sprite.pivot.x = this.sprite.width;
		
		/* Draw the shadow on the map */
		this.shadow.moveTo(cameraInfo.position[index][0]	- this.sprite.width, cameraInfo.position[index][1]);
		this.shadow.lineTo(cameraInfo.position[index][0] - cameraInfo.height[index], cameraInfo.position[index][1] + cameraInfo.width[index]);
		this.shadow.lineTo(cameraInfo.position[index][0] - cameraInfo.height[index], cameraInfo.position[index][1] - cameraInfo.width[index]);

		/* Set the properties for rotation */
		this.shadow.position.x = cameraInfo.position[index][0];
		this.shadow.position.y = cameraInfo.position[index][1];
		this.shadow.pivot.x = cameraInfo.position[index][0];
		this.shadow.pivot.y = cameraInfo.position[index][1];

		/* Now add the shadow lines for detection */
		gameBoard.drawLine(this.shadow.position.x + this.shadowHeight, this.shadow.position.y + this.shadowWidth, this.shadow.position.x, this.shadow.position.y, 2);
	}
	console.log(this.shadowWidth)

	/* Remember the old coordinates so we can remove them later */
	this.old_x = this.shadow.position.x;
	this.old_y = this.shadow.position.y;
	this.old_mid_x = this.shadow.position.x + this.shadowHeight;
	this.old_mid_y = this.shadow.position.y + this.shadowWidth;

	this.shadow.endFill();
}
