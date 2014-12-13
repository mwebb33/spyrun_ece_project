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
	this.old_mid_x1;
	this.old_mid_y1;
	this.old_mid_x2;
	this.old_mid_y2;
	this.num = 0;
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

//DEPERCIATED//
Camera.prototype.updatePosition = function() {

	/* Update the shadow and camera position on the map */	
	//console.log(this.shadow.position);
	this.sprite.rotation += this.rotationAmount;
	this.shadow.rotation += this.rotationAmount;
	if(this.sprite.pivot.x != 35){
		this.rotationNum += 1;
		if(this.rotationNum > this.rotationTicks) {
			this.rotationAmount = -this.rotationAmount;
			this.rotationNum = 0;
		}
	}
};

Camera.prototype.setCameraRotation = function(rotationAngle) {

	/* Update the shadow and camera position on the map */	
	//console.log(this.shadow.position);
	this.sprite.rotation = rotationAngle;
	this.shadow.rotation = rotationAngle;
};

/**
 	This updates the shadow lines for a given camera 
 **/
Camera.prototype.getShadowLines = function(GameBoard) {

	/* Create a point to reference the camera's position */
	var reference = new PIXI.Point(0,0);
	var diff = this.shadow.toGlobal(reference);
	var height = this.shadowHeight - 40;
	
	if (this.sprite.pivot.x == 0) {
		/* Get the current point of the shadow */
		var x = this.shadow.position.x;
		var y = this.shadow.position.y;
		//var x = diff.x + x;
		//var y = diff.y + y;

		var x = x + (Math.cos(this.shadow.rotation) * this.sprite.width/2);
		var y = y + (Math.sin(this.shadow.rotation) * this.sprite.width/2);

		//console.log(x + " " + y);

		/* Find the new end points for the shadow */
		var shadowAngle = Math.atan((this.shadowWidth/2)/this.shadowHeight);
		//shadowAngle = (shadowAngle * Math.PI)/180; //Convert to radians -- already in radians!


		var mid_x1 = (Math.cos(shadowAngle + this.shadow.rotation) * height) + x;
 		var mid_y1 = (Math.sin(shadowAngle + this.shadow.rotation) * height) + y;


 		var mid_x2 = (Math.cos(-shadowAngle + this.shadow.rotation) * height) + x;
 		var mid_y2 = (Math.sin(-shadowAngle + this.shadow.rotation) * height) + y;

 	}

 	else if(this.sprite.pivot.x == this.sprite.width){

		///Get the current point of the shadow 
		var x = this.shadow.position.x;
		var y = this.shadow.position.y;
		//var x = diff.x + x;
		//var y = diff.y + y;

		var x = x - (Math.cos(this.shadow.rotation) * this.sprite.width/2);
		var y = y - (Math.sin(this.shadow.rotation) * this.sprite.width/2);

		//console.log(x + " " + y);

		// Find the new end points for the shadow 
		var shadowAngle = -Math.tan((this.shadowWidth/2)/this.shadowHeight);
		//shadowAngle = (shadowAngle * Math.PI)/180; //Convert to radians -- already in radians!


		var mid_x1 = -(Math.cos(shadowAngle + this.shadow.rotation) * height) + x;
 		var mid_y1 = -(Math.sin(shadowAngle + this.shadow.rotation) * height) + y;

 		var mid_x2 = -(Math.cos(-shadowAngle + this.shadow.rotation) * height) + x;
 		var mid_y2 = -(Math.sin(-shadowAngle + this.shadow.rotation) * height) + y;
 	}

 	else if(this.sprite.pivot.x == this.sprite.width/2){

 		var height = this.shadowHeight - 70;
		///Get the current point of the shadow 
		var x = this.shadow.position.x;
		var y = this.shadow.position.y;
		//var x = diff.x + x;
		//var y = diff.y + y;

		var x = x - (Math.cos(this.shadow.rotation) * this.sprite.width/2);
		var y = y - (Math.sin(this.shadow.rotation) * this.sprite.width/2);

		//console.log(x + " " + y);

		// Find the new end points for the shadow 
		var shadowAngle = Math.tan((this.shadowWidth/2)/this.shadowHeight);
		//shadowAngle = (shadowAngle * Math.PI)/180; //Convert to radians -- already in radians!


		var mid_x1 = -(Math.cos(shadowAngle + this.shadow.rotation) * height) + x;
 		var mid_y1 = -(Math.sin(shadowAngle + this.shadow.rotation) * height) + y;

 		var mid_x2 = -(Math.cos(-shadowAngle + this.shadow.rotation) * height) + x;
 		var mid_y2 = -(Math.sin(-shadowAngle + this.shadow.rotation) * height) + y;
 	}


 		if(this.num % 2 == 0){
 			gameBoard.drawLine(Math.floor(x), Math.floor(y), Math.floor(mid_x1), Math.floor(mid_y1), 2);
 			gameBoard.drawLine(Math.floor(x), Math.floor(y), Math.floor(mid_x2), Math.floor(mid_y2), 2);
 			this.num += 1;
 		}
 		else{
 			gameBoard.drawLine(Math.floor(this.old_x), Math.floor(this.old_y), Math.floor(this.old_mid_x1), Math.floor(this.old_mid_y1), 0);
 			gameBoard.drawLine(Math.floor(this.old_x), Math.floor(this.old_y), Math.floor(this.old_mid_x2), Math.floor(this.old_mid_y2), 0);
			this.num -= 1; 	
 		}


 	this.old_x = x;
 	this.old_y = y;
 	this.old_mid_x1 = mid_x1;
 	this.old_mid_y1 = mid_y1;
 	this.old_mid_x2 = mid_x2;
 	this.old_mid_y2 = mid_y2;
};



/**
 	This draws the shadow for the camera to the map, and sets the approiate orientation and
	attributes for the camera 
**/
Camera.prototype.drawCamera = function(cameraInfo, index, levelNum) {

	this.shadow.beginFill(0xFFFF0B, .5);
	/* Check the starting orientation of the camera (right/left) */
	if(levelMaps.Cameras[levelNum].pivot[index] == 0) {

		//console.log(this.sprite.pivot.x);
		
		this.rotationNum = 56;
		this.rotationTicks = 112;
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
		//gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x + this.shadowHeight, this.shadow.position.y + this.shadowWidth, 2);
		//gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x + this.shadowHeight, this.shadow.position.y - this.shadowWidth, 2);

		/*this.old_x = this.shadow.position.x;
		this.old_y = this.shadow.position.y;
		this.old_mid_x1 = this.shadow.position.x + this.shadowHeight;
		this.old_mid_y1 = this.shadow.position.y + this.shadowWidth;
		this.old_mid_x2 = this.shadow.position.x + this.shadowHeight;
		this.old_mid_y2 = this.shadow.position.y - this.shadowWidth;*/
	}
	else if(levelMaps.Cameras[levelNum].pivot[index] == this.sprite.width) {

		//this.rotationAmount = -this.rotationAmount;
		/* Change the camera's pivot point since we're looking to the left */
		this.sprite.pivot.x = this.sprite.width;
		//console.log(this.sprite.pivot.x);

		/* Draw the shadow on the map */
		this.shadow.moveTo(cameraInfo.position[index][0] - this.sprite.width, cameraInfo.position[index][1]);
		this.shadow.lineTo(cameraInfo.position[index][0] - cameraInfo.height[index], cameraInfo.position[index][1] + cameraInfo.width[index]);
		this.shadow.lineTo(cameraInfo.position[index][0] - cameraInfo.height[index], cameraInfo.position[index][1] - cameraInfo.width[index]);

		/* Set the properties for rotation */
		this.shadow.position.x = cameraInfo.position[index][0];
		this.shadow.position.y = cameraInfo.position[index][1];
		this.shadow.pivot.x = cameraInfo.position[index][0];
		this.shadow.pivot.y = cameraInfo.position[index][1];

		/* Now add the shadow lines for detection */
		//gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x - this.shadowHeight, this.shadow.position.y + this.shadowWidth, 2);
		//gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x - this.shadowHeight, this.shadow.position.y - this.shadowWidth, 2);

		/*this.old_x = this.shadow.position.x;
		this.old_y = this.shadow.position.y;
		this.old_mid_x1 = this.shadow.position.x - this.shadowHeight;
		this.old_mid_y1 = this.shadow.position.y + this.shadowWidth;
		this.old_mid_x2 = this.shadow.position.x - this.shadowHeight;
		this.old_mid_y2 = this.shadow.position.y - this.shadowWidth;*/
	}

	else if(levelMaps.Cameras[levelNum].pivot[index] == this.sprite.width/2) {

		//this.rotationAmount = -this.rotationAmount;
		this.rotationNum = 112;
		this.rotationTicks = 224;
		/* Change the camera's pivot point since we're looking to the left */
		this.sprite.pivot.x = this.sprite.width/2;
		//console.log(this.sprite.pivot.x);
		
		/* Draw the shadow on the map */
		this.shadow.moveTo(cameraInfo.position[index][0] - this.sprite.width, cameraInfo.position[index][1]);
		this.shadow.lineTo(cameraInfo.position[index][0] - cameraInfo.height[index], cameraInfo.position[index][1] + cameraInfo.width[index]);
		this.shadow.lineTo(cameraInfo.position[index][0] - cameraInfo.height[index], cameraInfo.position[index][1] - cameraInfo.width[index]);

		/* Set the properties for rotation */
		this.shadow.position.x = cameraInfo.position[index][0];
		this.shadow.position.y = cameraInfo.position[index][1];
		this.shadow.pivot.x = cameraInfo.position[index][0]-35;
		this.shadow.pivot.y = cameraInfo.position[index][1];

		/* Now add the shadow lines for detection */
		//gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x - this.shadowHeight, this.shadow.position.y + this.shadowWidth, 2);
		//gameBoard.drawLine(this.shadow.position.x, this.shadow.position.y, this.shadow.position.x - this.shadowHeight, this.shadow.position.y - this.shadowWidth, 2);

		/*this.old_x = this.shadow.position.x;
		this.old_y = this.shadow.position.y;
		this.old_mid_x1 = this.shadow.position.x - this.shadowHeight;
		this.old_mid_y1 = this.shadow.position.y + this.shadowWidth;
		this.old_mid_x2 = this.shadow.position.x - this.shadowHeight;
		this.old_mid_y2 = this.shadow.position.y - this.shadowWidth;*/
	}

	//console.log(this.shadowWidth)

	/* Remember the old coordinates so we can remove them later */
	/*this.old_x = this.shadow.position.x;
	this.old_y = this.shadow.position.y;
	this.old_mid_x1 = this.shadow.position.x + this.shadowHeight;
	this.old_mid_y1 = this.shadow.position.y + this.shadowWidth;
	this.old_mid_x2 = this.shadow.position.x + this.shadowHeight;
	this.old_mid_y2 = this.shadow.position.y + this.shadowWidth;*/


	this.shadow.endFill();
}
