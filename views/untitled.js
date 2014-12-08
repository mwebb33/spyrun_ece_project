


	///start of commented code//

	/* Globals */
	var HEIGHT = 720;
	var WIDTH = 1080;

	/* Set a timeout for animation */
	var spriteNum = 1;
	var timeout = 0;
	var character; //Declare character here for global scope
	var cameraList = [];

	// create an new instance of a pixi stage with a grey background
	var stage = new PIXI.Stage(0x888888);

	// create a renderer instance width=640 height=480
	var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

	// importing Link's images
	var characterJSON = ["/images/spy.json"];

	// create a new loader
	var loader = new PIXI.AssetLoader(characterJSON);

	/* Create the camera object */
	var cameraJSON = ["/images/camera.json"];
	var cameraLoader = new PIXI.AssetLoader(cameraJSON);
	cameraLoader.load();

	// create an empty container
	var gameContainer = new PIXI.DisplayObjectContainer();

	// add the container to the stage
	stage.addChild(gameContainer);

	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	// use callback
	loader.onComplete = onTilesLoaded

	//begin load
	loader.load();	

	// importing a texture atlas created with texturepacker
	var bground = ["/images/background.json"];

	// create a new loader
	var loader = new PIXI.AssetLoader(bground);

	/* Create the game board */
	var gameBoard = new GameBoard();

	/* Get the maps object */
	var levelMaps = JSON.parse(Levels);

	/* Create the key handling object */	
	var key = new Key();

	/* Finally load the assests */
	var loader_new = new PIXI.AssetLoader(bground);
	loader_new.onComplete = test;
	loader_new.load();

	function test() {
		/* This can be empty for now since it is taken care of below */
	}

function onTilesLoaded(){

	/* Get the background image */
	var background = PIXI.Sprite.fromImage("/images/Level.png");
	gameContainer.addChild(background);

	/* Draw the walls on the screen */
	gameBoard.setWalls(levelMaps, gameContainer);
	gameBoard.setFinish(levelMaps, gameContainer);

	/* Initialize the main character sprite */
	character = new Character(PIXI.Sprite.fromFrame(2));

	/* Set the character's starting position */
	character.setPosition(125, 95);

	/* Add the character sprite to the screen */
	gameContainer.addChild(character.sprite);

	/* Add the cameras to the screen */
	var shadowList = [];
	
	graphics = gameBoard.setCameras(levelMaps, gameContainer, shadowList);
	//gameContainer.addChild(graphics);

	/* Add the event listeners for the button pushes */
	window.addEventListener('keydown', function(event) { 
		key.onKeyDown(event.keyCode);
	});
	window.addEventListener('keyup', function(event) { 
		key.onKeyUp(event.keyCode); 
	});

//	character.mousedown = character.touchstart = function(data) {
//		gameContainer.removeChild(this);
//		var character = PIXI.Sprite.fromFrame(1);
//		gameContainer.addChild(character);
//	}

	requestAnimFrame(animate);
}

/* This method gets called repeatedly by the Pixi driver */
function animate() {

	/* Get the animation frame (required by Pixi) */
	requestAnimFrame(animate);

	/* Update the character's position */
	character.updatePosition();

	/* Use a timeout for updating the Link sprite */
	timeout++;
	if((timeout%8) == 0) {	

		/* Increment through all of the spite images of Link */
		if(spriteNum >= 3)
			spriteNum = 0;

		/* Get the current character and the one to switch with
		   and set the new characters location to the same as the one
		   we're replacing  */	
		var orig = gameContainer.getChildAt(3);
		character.updateSprite(PIXI.Sprite.fromFrame(spriteNum+1));
		character.setPosition(orig.position.x, orig.position.y);

		/* Now swap the two characters on the screen */
		gameContainer.removeChild(orig);
		gameContainer.addChild(character.sprite);
		gameContainer.setChildIndex(character.sprite, 3);

		/* Update the cameras */
		for(var i = 0; i < cameraList.length; i++) {
			cameraList[i].updatePosition();
			cameraList[i].getShadowLines();
		}

		spriteNum++;
	}

	renderer.render(stage);
}

    </script>

    </body>
</html>
