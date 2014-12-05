var GameBoard = function() {

	this.board = [];
	for(i = 0; i < WIDTH; i++) {
		this.board.push([]);
	}

	/* Initialize the Game Array */
	for(var w = 0; w < WIDTH; w++) {
		for(var j = 0; j < HEIGHT; j++) {
				this.board[w].push(0);
		}
	}
};

GameBoard.prototype.setWalls = function(levelMaps) {

	/* Add the walls to the graphics image */
	var graphics = new PIXI.Graphics();
	graphics.lineStyle(12, 0x0F0F0F); //0x0F0F0F
	for(var i = 0; i < levelMaps.Walls[0].start.length; i++) {
		graphics.beginFill(0xFF0000);
		graphics.moveTo(levelMaps.Walls[0].start[i][0], levelMaps.Walls[0].start[i][1]);
		graphics.lineTo(levelMaps.Walls[0].end[i][0], levelMaps.Walls[0].end[i][1]);
		graphics.endFill();

		/* Now add the wall to the gameBoard object for collision detection */
		var slope = (levelMaps.Walls[0].end[i][1] - levelMaps.Walls[0].start[i][1])/(levelMaps.Walls[0].end[i][0] - levelMaps.Walls[0].start[i][0]);
		var y = levelMaps.Walls[0].start[i][1];
		var x = levelMaps.Walls[0].start[i][0];
		var y_int = (y - (x * slope));
		while(x < levelMaps.Walls[0].end[i][0] || y < levelMaps.Walls[0].end[i][1]) {
			this.board[x][y] = 1
			if(Math.abs(slope) == Number.POSITIVE_INFINITY) {
				y += 1;
			}
			else if(slope == 0) {
				x += 1;
			}
			else if(slope != 0) {
				x += 1;
				y = (x*slope) + y_int;
			}
		}
	}

	/* Set the finish line on the map next */
	for(var i = 0; i < levelMaps.FinishLine[0].start.length; i++) {
		graphics.beginFill(0xFF0000);
		graphics.moveTo(levelMaps.FinishLine[0].start[i][0], levelMaps.FinishLine[0].start[i][1]);
		graphics.lineTo(levelMaps.FinishLine[0].end[i][0], levelMaps.FinishLine[0].end[i][1]);
		graphics.endFill();

		var slope = (levelMaps.FinishLine[0].end[i][1] - levelMaps.FinishLine[0].start[i][1])/(levelMaps.FinishLine[0].end[i][0] - levelMaps.FinishLine[0].start[i][0]);
		var y = levelMaps.FinishLine[0].start[i][1];
		var x = levelMaps.FinishLine[0].start[i][0];
		var y_int = (y - (x * slope));
		while(x < levelMaps.FinishLine[0].end[i][0] || y < levelMaps.FinishLine[0].end[i][1]) {
			this.board[x][y] = 3
			if(Math.abs(slope) == Number.POSITIVE_INFINITY) {
				y += 1;
			}
			else if(slope == 0) {
				x += 1;
			}
			else if(slope != 0) {
				x += 1;
				y = (x*slope) + y_int;
			}
		}
	}

	return graphics;
};


GameBoard.prototype.setCameras = function(levelMaps, gameContainer, shadowList) {
	
	/* Get the location from the levels file */
	for(var i = 0; i < levelMaps.Cameras[0].position.length; i++) {

		/* Load the camera image */
		var camera = new Camera(PIXI.Sprite.fromImage("/images/camera.png"));
		cameraList.push(camera);
		camera.sprite.position.x = levelMaps.Cameras[0].position[i][0];
		camera.sprite.position.y = levelMaps.Cameras[0].position[i][1];
		gameContainer.addChild(camera.sprite);
	
		/* Now set the shadow that is associated with the camera */
		var graphics = new PIXI.Graphics();
		var cameraInfo = levelMaps.Cameras[0]; 
		graphics.beginFill(0xFFFF0B, .5);
		if(levelMaps.Cameras[0].pivot[i] == 0) {
			graphics.position.x = cameraInfo.position[i][0];
			graphics.position.y = cameraInfo.position[i][1];
			graphics.moveTo(cameraInfo.position[i][0] + camera.sprite.width, cameraInfo.position[i][1]);
			graphics.lineTo(cameraInfo.position[i][0] + cameraInfo.height[i], cameraInfo.position[i][1] + cameraInfo.width[i]);
			graphics.lineTo(cameraInfo.position[i][0] + cameraInfo.height[i], cameraInfo.position[i][1] - cameraInfo.width[i]);
			graphics.pivot.x = cameraInfo.position[i][0];
			graphics.pivot.y = cameraInfo.position[i][1];
		}
		else if(levelMaps.Cameras[0].pivot[i] == camera.sprite.width) {
			camera.sprite.pivot.x = camera.sprite.width;
			graphics.position.x = cameraInfo.position[i][0];
			graphics.position.y = cameraInfo.position[i][1];
			graphics.moveTo(cameraInfo.position[i][0]	- camera.sprite.width, cameraInfo.position[i][1]);
			graphics.lineTo(cameraInfo.position[i][0] - cameraInfo.height[i], cameraInfo.position[i][1] + cameraInfo.width[i]);
			graphics.lineTo(cameraInfo.position[i][0] - cameraInfo.height[i], cameraInfo.position[i][1] - cameraInfo.width[i]);
			graphics.pivot.x = cameraInfo.position[i][0];
			graphics.pivot.y = cameraInfo.position[i][1];
		}
		//graphics.pivot.y = 0;
		camera.shadow = graphics;
		camera.shadowHeight = cameraInfo.height[i];
		camera.shadowWidth = cameraInfo.width[i];
		graphics.endFill();
		//shadowList.push(graphics);
		gameContainer.addChild(graphics);
	}
	//return graphics;
};

/*GameBoard.prototype.updateShadows = function(levelMaps, gameContainer, shadowList) {

	for(var i = 0; i < levelMaps.Cameras[0].position.length; i++) {
		var camera = new Camera(PIXI.Sprite.fromImage("/images/camera.png"));
		camera.sprite.position.x = levelMaps.Cameras[0].position[i][0];
		camera.sprite.position.y = levelMaps.Cameras[0].position[i][1];
		gameContainer.addChild(camera.sprite);

		var graphics = new PIXI.Graphics();
		graphics.beginFill(0xFFFF0B, 0.5);
		if(levelMaps.Cameras[0].pivot[i] == 0) {
			graphics.moveTo(levelMaps.Cameras[0].position[i][0] + 70, levelMaps.Cameras[0].position[i][1]);
			graphics.lineTo(levelMaps.Cameras[0].position[i][0] + 200, levelMaps.Cameras[0].position[i][1] + 50);
			graphics.lineTo(levelMaps.Cameras[0].position[i][0] + 200, levelMaps.Cameras[0].position[i][1] - 50);
			graphics.pivot.x = 0;
		}
		else if(levelMaps.Cameras[0].pivot[i] == 70) {
			camera.sprite.pivot.x = 70;
			graphics.moveTo(levelMaps.Cameras[0].position[i][0]	- 70, levelMaps.Cameras[0].position[i][1]);
			graphics.lineTo(levelMaps.Cameras[0].position[i][0] - 200, levelMaps.Cameras[0].position[i][1] + 50);
			graphics.lineTo(levelMaps.Cameras[0].position[i][0] - 200, levelMaps.Cameras[0].position[i][1] - 50);
			graphics.pivot.x = 0;
		}
		graphics.pivot.y = 0;
		camera.shadow = graphics;
		graphics.endFill();
		shadowList.push(graphics);
		gameContainer.addChild(graphics);
	}
}*/

GameBoard.prototype.detectCollision = function(x, y, width, height) {

	for(var i = x; i < x + width; i++) {
		for(var j = y; j < y + height; j++) {

			/* If we hit a wall */
			if(this.board[i][j] == 1) {
				return 1;
			}
			/* If we hit a camera */
			else if(this.board[i][j] == 2) {
				return 2;
			}
			/* If we hit the finish line */
			else if(this.board[i][j] == 3) {
				return 3;
			}
		}
	}
	return 0; //We are clear to move
};
