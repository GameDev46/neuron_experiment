/*
╔═══╗             ╔╗       ╔╗    ╔══╗          ╔═══╗             ╔═══╗        ╔╗ ╔╗╔═══╗
║╔═╗║            ╔╝╚╗      ║║    ║╔╗║          ║╔═╗║             ╚╗╔╗║        ║║ ║║║╔══╝
║║ ╚╝╔═╗╔══╗╔══╗ ╚╗╔╝╔══╗╔═╝║    ║╚╝╚╗╔╗ ╔╗    ║║ ╚╝╔══╗ ╔╗╔╗╔══╗ ║║║║╔══╗╔╗╔╗║╚═╝║║╚══╗
║║ ╔╗║╔╝║╔╗║╚ ╗║  ║║ ║╔╗║║╔╗║    ║╔═╗║║║ ║║    ║║╔═╗╚ ╗║ ║╚╝║║╔╗║ ║║║║║╔╗║║╚╝║╚══╗║║╔═╗║
║╚═╝║║║ ║║═╣║╚╝╚╗ ║╚╗║║═╣║╚╝║    ║╚═╝║║╚═╝║    ║╚╩═║║╚╝╚╗║║║║║║═╣╔╝╚╝║║║═╣╚╗╔╝   ║║║╚═╝║
╚═══╝╚╝ ╚══╝╚═══╝ ╚═╝╚══╝╚══╝    ╚═══╝╚═╗╔╝    ╚═══╝╚═══╝╚╩╩╝╚══╝╚═══╝╚══╝ ╚╝    ╚╝╚═══╝
																			╔═╝║                                              
																			╚══╝                                              
																		 
																							  
*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasData = document.getElementById("side-canvas");
const ctxData = canvasData.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", e => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	mapPosition = {
		x: (window.innerWidth / 2) - ((pixelSize * mapWidth) / 2),
		y: 0
	}

	if (window.innerWidth < 1200) {
		mapPosition.x = 40
	}
})

const speedControlButtons = [document.getElementById("rewind"), document.getElementById("play"), document.getElementById("forward")]


let pixelMap = [];
let safeZones = [];

let currentDrawingPiece = 0;

let FPS = 0;

let generation = 1;

let creatureData = [];
let killedCreatures = [];

let bestCreaturecreatureData = [];
let creatureFrameLimit = 200;
let creatureCollisions = false;

let creatureNames = ["Bob", "Gregg", "Tony", "Charlotte", "Milly", "Tom", "Will", "Issy", "Ella", "Gary", "Karen", "Katrina"]
let creatureChildPrefix = ["", "Small", "Tiny", "Mini", "Teeny", "Miniscule", "Minute", "Weeny", "Atomic", "Just stop", "Calm down", "STOP"]

let creatureMutationChance = 1;
let creatureMutationIntensity = 0.1;

let mapWidth = 200;
let mapHeight = 200;

let pixelSize = 3;

document.getElementById("gridsize").innerText = "Grid Size: " + mapWidth + " x " + mapHeight;

let startingCreatureCount = 400;
let creatureNeurons = [8];

let mapSafeX = mapWidth + 1;
let mapSafeY = 0;

let bestCreatureHolder;
let bestCreature;
let currentlySelectedCreature = [null, null, null, null];

let mouse = {
	down: false
}

let mapPosition = {
	x: (window.innerWidth / 2) - ((pixelSize * mapWidth) / 2),
	y: 0
}

if (window.innerWidth < 1200) {
	mapPosition.x = 40
}

function setupPixelMap() {

	for (let y = 0; y < mapHeight; y++) {
		let mapArr = [];
		let mapArr2 = [];

		for (let x = 0; x < mapWidth; x++) {
			mapArr.push(0);
			mapArr2.push(0);
		}

		pixelMap.push(mapArr);
		safeZones.push(mapArr2);
	}

	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			if (mapSafeX < x) {
				safeZones[y][x] = 1;
			}
		}
	}

}

function setupStartingNeutons() {
	let randX = 0;
	let randY = 0;

	for (let i = 0; i < startingCreatureCount; i++) {
		randX += Math.floor(Math.random() * ((mapHeight * mapWidth) / (400 + startingCreatureCount)));

		if (randX > mapWidth) {
			randY += 1;
			randX = randX - mapWidth;
		}

		while (pixelMap[randY][randX] == 1 || safeZones[randY][randX] == 1 || safeZones[randY][randX] == 7) {
			randX += 1;

			if (randX > mapWidth) {
				randY += 1;
				randX = randX - mapWidth;
			}
		}

		let weights = []

		for (var p = 0; p < creatureNeurons.length + 1; p++) {
			weights.push([]);
		}

		for (var w = 0; w < creatureNeurons[0] * 6; w++) {
			weights[0].push(round(Math.random() * 2) - 1);
		}

		for (var p = 0; p < creatureNeurons.length; p++) {

			let multi = creatureNeurons[p + 1];

			for (var w = 0; w < creatureNeurons[p] * multi; w++) {
				weights[p + 1].push(round(Math.random() * 2) - 1);
			}
		}

		for (var w = 0; w < creatureNeurons[creatureNeurons.length - 1] * 2; w++) {
			weights[p].push(round(Math.random() * 2) - 1);
		}

		let totalWeight = [0, 0];
		for (var h = 0; h < creatureNeurons.length + 1; h++) {
			for (var w = 0; w < weights[h].length; w++) {
				totalWeight[h] += weights[h][w];
			}
		}

		pixelMap[randY][randX] = rgbToHex((totalWeight[0] + weights[0].length) * (255 / (weights[0].length * 2)), 110, (totalWeight[1] + weights[1].length) * (255 / (weights[1].length * 2)));

		// Weights = first neuron first connection, second neuron first connection, ..., first neuron second connection, second neuron second connection ...

		let neurons = [];

		for (let p = 0; p < creatureNeurons.length; p++) {
			let startArr = []

			for (var n = 0; n < creatureNeurons[p]; n++) {
				startArr.push(0);
			}

			neurons.push(startArr);
		}

		creatureData.push([randX, randY, weights, neurons, -1, -1, creatureNames[Math.floor(Math.random() * (creatureNames.length - 1))], 0]);
	}
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);

	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function renderPixels() {
	let outlineHold = [null, null];

	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {

			if (currentlySelectedCreature[2] == x && currentlySelectedCreature[3] == y) {
				outlineHold = [x, y];
			}

			ctx.fillStyle = "rgb(13, 13, 23)";

			if (safeZones[y][x] == 1) {
				ctx.fillStyle = "#557755";
			}

			if (safeZones[y][x] == 5) {
				ctx.fillStyle = "#41425e";
			}

			if (safeZones[y][x] == 7) {
				ctx.fillStyle = "#272d3d";
			}

			if (pixelMap[y][x] == 1) {
				ctx.fillStyle = "#FFFFFF";
			}

			if (pixelMap[y][x] == 6) {
				ctx.fillStyle = "#AA5555";
			}

			if (pixelMap[y][x].toString().substring(0, 1) == "#") {
				ctx.fillStyle = pixelMap[y][x];
			}

			ctx.fillRect((x * pixelSize) + mapPosition.x, (y * pixelSize) + mapPosition.y, pixelSize, pixelSize);
		}
	}

	if (outlineHold[0] != null && outlineHold[1] != null) {
		let outlineSize = 4;

		ctx.fillStyle = "#FFFFFF22";
		ctx.fillRect(((outlineHold[0] * pixelSize) + mapPosition.x) - outlineSize, ((outlineHold[1] * pixelSize) + mapPosition.y) - outlineSize, pixelSize + (outlineSize * 2), pixelSize + (outlineSize * 2));

		ctx.fillStyle = pixelMap[outlineHold[1]][outlineHold[0]];
		ctx.fillRect((outlineHold[0] * pixelSize) + mapPosition.x, (outlineHold[1] * pixelSize) + mapPosition.y, pixelSize, pixelSize);
	}
}

function updateNeurons() {
	for (let i = 0; i < creatureData.length; i++) {
		// Run Neural Network

		let foundMe = false;
		for (let search = 0; search < killedCreatures.length; search++) {
			if (killedCreatures[search] == i) {
				foundMe = true;
			}
		}

		if (foundMe) {
			continue;
		}

		// x distance to safe zone, y distance to safe zone, wall in front, wall behind, wall above, wall below

		let wallData = [0, 0, 0, 0];

		//|| (pixelMap[creatureData[i][1] - 1][creatureData[i][0]].toString().substring(0, 1) == "#" && creatureCollisions)

		if (creatureData[i][0] + 1 >= mapWidth) {
			wallData[0] = 1;
		}
		else if (pixelMap[creatureData[i][1]][creatureData[i][0] + 1] == 1) {
			wallData[0] = 1;
		}

		if (creatureData[i][0] - 1 < 0) {
			wallData[1] = 1;
		}
		else if (pixelMap[creatureData[i][1]][creatureData[i][0] - 1] == 1) {
			wallData[1] = 1;
		}

		if (creatureData[i][1] + 1 >= mapWidth) {
			wallData[2] = 1;
		}
		else if (pixelMap[creatureData[i][1] + 1][creatureData[i][0]] == 1) {
			wallData[2] = 1;
		}

		if (creatureData[i][1] - 1 < 0) {
			wallData[3] = 1;
		}
		else if (pixelMap[creatureData[i][1] - 1][creatureData[i][0]] == 1) {
			wallData[3] = 1;
		}

		let shortestDist = Infinity;

		let xPos = 0;
		let yPos = 0;

		if (creatureData[i][5] < 0 || creatureData[i][4] < 0) {

			for (let y = 0; y < mapHeight; y++) {
				for (let x = 0; x < mapWidth; x++) {

					let dist = ((x - creatureData[i][0]) * (x - creatureData[i][0])) + ((y - creatureData[i][1]) * (y - creatureData[i][1]));

					if (safeZones[y][x] == 1 && dist < shortestDist) {
						shortestDist = dist;

						xPos = x;
						yPos = y;
					}
				}
			}

			creatureData[i][4] = xPos;
			creatureData[i][5] = yPos;

		}

		let inputs = [clamp(creatureData[i][4] - creatureData[i][0], -1, 1), clamp(creatureData[i][5] - creatureData[i][1], -1, 1), wallData[0], wallData[1], wallData[2], wallData[3]];

		//creatureData.push([randX, randY, weights, neurons, -1, -1, creatureNames[Math.floor(Math.random() * (creatureNames.length - 1))], 0]);

		for (let x = 0; x < inputs.length; x++) {

			// Calculate neurons
			for (let n = 0; n < creatureData[i][3][0].length; n++) {

				if (x == 0) {
					creatureData[i][3][0][n] = 0;
				}

				creatureData[i][3][0][n] += inputs[x] * creatureData[i][2][0][(x * creatureData[i][3][0].length) + n];

				creatureData[i][3][0][n] = hyperbolicTangent(creatureData[i][3][0][n]);

			}
		}

		for (let x = 1; x < creatureData[i][3].length; x++) {

			for (let c = 0; c < creatureData[i][3][x - 1].length; c++) {

				for (let n = 0; n < creatureData[i][3][x].length; n++) {

					creatureData[i][3][x][n] += creatureData[i][3][x - 1][c] * creatureData[i][2][x][(c * creatureData[i][3][x].length) + n];

					creatureData[i][3][x][n] = hyperbolicTangent(creatureData[i][3][x][n]);

				}
			}
		}

		let outputs = [0, 0]

		for (let x = 0; x < outputs.length; x++) {

			outputs[x] = 0;

			for (var c = 0; c < creatureData[i][3][creatureData[i][3].length - 1].length; c++) {
				// Update outputs based on neurons
				outputs[x] += (creatureData[i][2][creatureData[i][2].length - 1][(x * creatureData[i][3][creatureData[i][3].length - 1].length) + c] * creatureData[i][3][creatureData[i][3].length - 1][c]);
			}

		}

		// Apply outputs

		pixelMap[creatureData[i][1]][creatureData[i][0]] = 0;

		if (safeZones[creatureData[i][1]][creatureData[i][0]] != 5) {
			creatureData[i][0] += Math.round(clamp(outputs[0], -1, 1));
			creatureData[i][1] += Math.round(clamp(outputs[1], -1, 1));
		}

		if (creatureData[i][0] < 0) {
			creatureData[i][0] = 0
		}
		else if (creatureData[i][0] >= mapWidth) {
			creatureData[i][0] = mapWidth - 1;
		}

		if (creatureData[i][1] < 0) {
			creatureData[i][1] = 0
		}
		else if (creatureData[i][1] >= mapHeight) {
			creatureData[i][1] = mapHeight - 1;
		}

		if (pixelMap[creatureData[i][1]][creatureData[i][0]] == 6) {
			killedCreatures.push(i);
			currentlySelectedCreature = [null, null, null, null];
			continue;
		}

		if (pixelMap[creatureData[i][1]][creatureData[i][0]] == 1) {
			creatureData[i][0] -= Math.round(clamp(outputs[0], -1, 1));
			creatureData[i][1] -= Math.round(clamp(outputs[1], -1, 1));
		}

		let totalWeight = [0, 0];

		for (var h = 0; h < 2; h++) {
			for (var w = 0; w < creatureData[i][2][h].length; w++) {
				totalWeight[h] += creatureData[i][2][h][w];
			}
		}

		pixelMap[creatureData[i][1]][creatureData[i][0]] = rgbToHex((totalWeight[0] + creatureData[i][2][0].length) * (255 / (creatureData[i][2][0].length * 2)), 110, (totalWeight[1] + creatureData[i][2][1].length) * (255 / (creatureData[i][2][1].length * 2)));

		// Update followed creature tracker

		if (currentlySelectedCreature[0] == i) {

			currentlySelectedCreature[2] = creatureData[i][0];
			currentlySelectedCreature[3] = creatureData[i][1];

			if (currentlySelectedCreature[1] != creatureData[i]) {
				currentlySelectedCreature[1] = creatureData[i];

				updateBestNeuralNetworkDisplay();
			}
		}

	}
}

function sigmoid(z) {
	return 1 / (1 + Math.exp(-z));
}

function hyperbolicTangent(z) {
	let x = Math.exp(2 * z);
	return (x - 1) / (x + 1);
}

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

function round(num) {
	return Math.round(num * 100) / 100;
}

function killAndReproduceNeutons() {

	// Clear creature pixels

	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			if (pixelMap[y][x].toString().substring(0, 1) == "#") {
				pixelMap[y][x] = 0;
			}
		}
	}


	let safeCreaturesHolder = [];
	let safeCreatureCounter = -1;

	for (let i = 0; i < creatureData.length; i++) {
		if (safeZones[creatureData[i][1]][creatureData[i][0]] == 1) {
			safeCreaturesHolder.push(creatureData[i]);
			safeCreatureCounter += 1;

			if (currentlySelectedCreature[1] != null) {
				if (currentlySelectedCreature[0] == i) {
					currentlySelectedCreature[0] = safeCreatureCounter;
				}
			}
		}
		else if (currentlySelectedCreature[1] != null) {
			if (currentlySelectedCreature[0] == i) {
				currentlySelectedCreature = [null, null, null, null];
			}
		}
	}

	bestCreatureHolder = safeCreaturesHolder[0];

	let genSurvivalR = document.createElement("p");

	genSurvivalR.innerText = "Generation " + (generation - 1) + " survival rate: " + (Math.round((safeCreaturesHolder.length / creatureData.length) * 1000) / 10) + "%";

	document.getElementById("survival-rate").appendChild(genSurvivalR);

	creatureData = [];
	killedCreatures = [];

	let x = 0;
	let repeated = false;

	let randX = 0;
	let randY = 0;

	for (let i = 0; i < startingCreatureCount; i++) {
		// Mutate creatures
		randX += Math.floor(Math.random() * ((mapHeight * mapWidth) / (400 + startingCreatureCount)));

		if (randX > mapWidth) {
			randY += 1;
			randX = randX - mapWidth;
		}

		while (pixelMap[randY][randX] == 1 || safeZones[randY][randX] == 1 || safeZones[randY][randX] == 7) {
			randX += 1;

			if (randX > mapWidth) {
				randY += 1;
				randX = randX - mapWidth;
			}
		}

		// Reset x and y position

		pixelMap[randY][randX] = 2;

		let safeCreatures = [safeCreaturesHolder[x][0], safeCreaturesHolder[x][1], safeCreaturesHolder[x][2], safeCreaturesHolder[x][3], -1, -1, safeCreaturesHolder[x][6], safeCreaturesHolder[x][7] + 1];

		if (!repeated) {
			safeCreatures[7] = safeCreaturesHolder[x][7];
		}

		safeCreatures[0] = randX;
		safeCreatures[1] = randY;

		// Mutate weights

		if (repeated) {

			for (var n = 0; n < safeCreatures[2].length; n++) {
				for (var w = 0; w < safeCreatures[2][n].length; w++) {
					if (Math.floor(Math.random() * 100) < creatureMutationChance) {
						safeCreatures[2][n][w] += round((Math.random() * creatureMutationIntensity) - (creatureMutationIntensity / 2));

						safeCreatures[2][n][w] = clamp(safeCreatures[2][n][w], -1, 1);
					}
				}
			}

		}

		creatureData.push(safeCreatures);

		x += 1;

		if (x >= safeCreaturesHolder.length) {
			x = 0;
			repeated = true;
		}
	}

	document.getElementById("generation-counter").innerText = "Generation " + generation;
}

let playPauseBool = false;

speedControlButtons[0].addEventListener("click", e => {
	FPS = 10;

	playPauseBool = true;

	speedControlButtons[1].innerHTML = '<i data-feather="pause"></i>';
	feather.replace();

	document.getElementById("FPS").innerText = "FPS: " + FPS;
	document.getElementById("generationTiming").innerText = "Generation Life Time: " + round(creatureFrameLimit / FPS) + "s";
})

speedControlButtons[2].addEventListener("click", e => {
	FPS = 30;

	playPauseBool = true;

	speedControlButtons[1].innerHTML = '<i data-feather="pause"></i>';
	feather.replace();

	document.getElementById("FPS").innerText = "FPS: " + FPS;
	document.getElementById("generationTiming").innerText = "Generation Life Time: " + round(creatureFrameLimit / FPS) + "s";
})

let savedFPS = 60;
speedControlButtons[1].innerHTML = '<i data-feather="play"></i>';
feather.replace();

speedControlButtons[1].addEventListener("click", e => {
	playPauseBool = !playPauseBool;

	if (!playPauseBool) {
		savedFPS = FPS;
		FPS = 0;

		speedControlButtons[1].innerHTML = '<i data-feather="play"></i>';
	}
	else {
		FPS = savedFPS;

		speedControlButtons[1].innerHTML = '<i data-feather="pause"></i>';
	}

	feather.replace();
})

canvas.addEventListener("mousedown", e => {
	mouse.down = true;

	for (let i = 0; i < 3; i++) {
		addNewMapPiece(e.pageX, e.pageY + (i * pixelSize), 1, false)
		addNewMapPiece(e.pageX + pixelSize, e.pageY + (i * pixelSize), 1, i == 1)
		addNewMapPiece(e.pageX - pixelSize, e.pageY + (i * pixelSize), 1, false)
	}
})

document.addEventListener("mousemove", e => {
	if (mouse.down) {
		for (let i = 0; i < 3; i++) {
			addNewMapPiece(e.pageX, e.pageY + (i * pixelSize), 1, false)
			addNewMapPiece(e.pageX + pixelSize, e.pageY + (i * pixelSize), 1, i == 1)
			addNewMapPiece(e.pageX - pixelSize, e.pageY + (i * pixelSize), 1, false)
		}
	}
})

document.addEventListener("mouseup", e => {
	mouse.down = false;
})

canvas.addEventListener("touchstart", e => {
	mouse.down = true;

	for (let i = 0; i < 3; i++) {
		addNewMapPiece(e.touches[0].pageX, e.touches[0].pageY + (i * pixelSize), 1, false)
		addNewMapPiece(e.touches[0].pageX + pixelSize, e.touches[0].pageY + (i * pixelSize), 1, i == 1)
		addNewMapPiece(e.touches[0].pageX - pixelSize, e.touches[0].pageY + (i * pixelSize), 1, false)
	}
})

document.addEventListener("touchmove", e => {
	if (mouse.down) {
		for (let i = 0; i < 3; i++) {
			addNewMapPiece(e.touches[0].pageX, e.touches[0].pageY + (i * pixelSize), 1, false)
			addNewMapPiece(e.touches[0].pageX + pixelSize, e.touches[0].pageY + (i * pixelSize), 1, i == 1)
			addNewMapPiece(e.touches[0].pageX - pixelSize, e.touches[0].pageY + (i * pixelSize), 1, false)
		}
	}
})

document.addEventListener("touchend", e => {
	mouse.down = false;
})

// Draw Walls

document.getElementById("draw-0").addEventListener("click", e => {
	let id = 0;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 1;
})

// Draw Safe Zone

document.getElementById("draw-1").addEventListener("click", e => {
	let id = 1;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 3;
})

// Eraser

document.getElementById("draw-2").addEventListener("click", e => {
	let id = 2;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 0;
})

// Creature Select

document.getElementById("draw-3").addEventListener("click", e => {
	let id = 3;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 4;
})

// Glue

document.getElementById("draw-4").addEventListener("click", e => {
	let id = 4;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 5;
})

// Lava

document.getElementById("draw-5").addEventListener("click", e => {
	let id = 5;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 6;
})

// Lava

document.getElementById("draw-6").addEventListener("click", e => {
	let id = 6;

	for (let i = 0; i < 7; i++) {
		document.getElementById("draw-" + i).classList.remove("selected-drawing");
	}

	document.getElementById("draw-" + id).classList.add("selected-drawing");

	currentDrawingPiece = 7;
})


function addNewMapPiece(x, y, piece, isMiddle) {
	x = (x - mapPosition.x) / pixelSize;
	y = (y - mapPosition.y) / pixelSize;

	x -= 4;
	y -= 4;

	x = Math.round(x);
	y = Math.round(y);

	if (x >= mapWidth || x < 0) {
		return;
	}

	if (y >= mapHeight || y < 0) {
		return;
	}

	if (currentDrawingPiece == 3) {
		safeZones[y][x] = 1;
	}
	else if (currentDrawingPiece == 0) {
		if (pixelMap[y][x].toString().substring(0, 1) != "#") {
			pixelMap[y][x] = currentDrawingPiece;
		}
		safeZones[y][x] = currentDrawingPiece;
	}
	else if (currentDrawingPiece == 1) {
		if (pixelMap[y][x].toString().substring(0, 1) != "#") {
			pixelMap[y][x] = currentDrawingPiece;
		}
	}
	else if (currentDrawingPiece == 4) {
		// Inspect creatures
		if (pixelMap[y][x].toString().substring(0, 1) == "#" && isMiddle) {
			currentlySelectedCreature = [null, null, null, null];

			for (let c = 0; c < creatureData.length; c++) {
				if (creatureData[c][0] == x && creatureData[c][1] == y) {
					currentlySelectedCreature[0] = c;
					currentlySelectedCreature[1] = creatureData[c];
					currentlySelectedCreature[2] = x;
					currentlySelectedCreature[3] = y;
				}
			}

			updateBestNeuralNetworkDisplay();
		}
	}
	else if (currentDrawingPiece == 5) {
		safeZones[y][x] = currentDrawingPiece;
	}
	else if (currentDrawingPiece == 6) {
		if (pixelMap[y][x].toString().substring(0, 1) != "#") {
			pixelMap[y][x] = currentDrawingPiece;
		}
	}
	else if (currentDrawingPiece == 7) {
		safeZones[y][x] = currentDrawingPiece;
	}
}

function updateBestNeuralNetworkDisplay() {
	ctxData.clearRect(0, 0, canvasData.width, canvasData.height);

	ctxData.fillStyle = "#FFAAAA"
	ctxData.strokeStyle = "#FFFFFF"

	let neuronCount = 6;

	for (var i = 0; i < neuronCount; i++) {
		ctxData.beginPath();
		ctxData.arc(40, (i * (canvasData.height / neuronCount)) + 20, 5, 0, 2 * Math.PI);
		ctxData.fill();
	}

	for (let p = 0; p < creatureNeurons.length; p++) {
		for (var i = 0; i < creatureNeurons[p]; i++) {
			ctxData.beginPath();
			ctxData.arc(40 + ((150 / creatureNeurons.length) * (p + 1)), (i * (canvasData.height / creatureNeurons[p])) + 15, 5, 0, 2 * Math.PI);
			ctxData.fill();
		}
	}

	neuronCount = 2;

	for (var i = 0; i < neuronCount; i++) {
		ctxData.beginPath();
		ctxData.arc(240, (i * (canvasData.height / neuronCount)) + 60, 5, 0, 2 * Math.PI);
		ctxData.fill();
	}

	// Render connections

	bestCreature = bestCreatureHolder;

	if (currentlySelectedCreature[1] != null) {
		bestCreature = currentlySelectedCreature[1];
	}

	if (bestCreature != null) {

		if (bestCreature[7] >= creatureChildPrefix.length) {
			bestCreature[7] = creatureChildPrefix.length - 1;
		}

		document.getElementById("creature-name").innerHTML = creatureChildPrefix[bestCreature[7]] + " " + bestCreature[6] + ' <span id="creature-colour"></span>';

		let totalWeight = [0, 0];

		for (var h = 0; h < 2; h++) {
			for (var w = 0; w < bestCreature[2][h].length; w++) {
				totalWeight[h] += bestCreature[2][h][w];
			}
		}

		document.getElementById("creature-colour").style.background = "rgb(" + ((totalWeight[0] + bestCreature[2][0].length) * (255 / (bestCreature[2][0].length * 2))) + "," + 110 + "," + ((totalWeight[1] + bestCreature[2][1].length) * (255 / bestCreature[2][1].length * 2)) + ")";

		for (let x = 0; x < 6; x++) {

			// Calculate neurons
			for (let n = 0; n < bestCreature[3][0].length; n++) {

				// Render in line

				ctxData.lineWidth = Math.abs(bestCreature[2][0][(x * bestCreature[3][0].length) + n]) * 1;

				if (bestCreature[2][0][(x * bestCreature[3][0].length) + n] < 0) {
					ctxData.strokeStyle = "rgb(255, 120, 120)"
				}
				else {
					ctxData.strokeStyle = "rgb(120, 255, 120)"
				}

				if (bestCreature[2][0][(x * bestCreature[3][0].length) + n] > -0.05 && bestCreature[2][0][(x * bestCreature[3][0].length) + n] < 0.05) {
					ctxData.strokeStyle = "rgb(10, 10, 30)"
				}

				ctxData.beginPath();
				ctxData.moveTo(40, (x * (canvasData.height / 6)) + 20);
				ctxData.lineTo(40 + (150 / creatureNeurons.length), (n * (canvasData.height / creatureNeurons[0])) + 15);
				ctxData.stroke();

			}
		}

		for (let x = 1; x < bestCreature[3].length; x++) {

			for (let c = 0; c < bestCreature[3][x - 1].length; c++) {

				for (let n = 0; n < bestCreature[3][x].length; n++) {
					// Render in line

					ctxData.lineWidth = Math.abs(bestCreature[2][x][(c * bestCreature[3][x].length) + n]) * 1;

					if (bestCreature[2][x][(c * bestCreature[3][x].length) + n] < 0) {
						ctxData.strokeStyle = "rgb(255, 120, 120)"
					}
					else {
						ctxData.strokeStyle = "rgb(120, 255, 120)"
					}

					if (bestCreature[2][x][(c * bestCreature[3][x].length) + n] > -0.05 && bestCreature[2][x][(c * bestCreature[3][x].length) + n] < 0.05) {
						ctxData.strokeStyle = "rgb(10, 10, 30)"
					}

					ctxData.beginPath();
					ctxData.moveTo(40 + ((150 / creatureNeurons.length) * (x + 0)), (c * (canvasData.height / creatureNeurons[x - 1])) + 15);
					ctxData.lineTo(40 + ((150 / creatureNeurons.length) * (x + 1)), (n * (canvasData.height / creatureNeurons[x])) + 15);
					ctxData.stroke();

				}
			}
		}

		for (let x = 0; x < 2; x++) {

			for (var c = 0; c < bestCreature[3][bestCreature[3].length - 1].length; c++) {
				// Render in line

				ctxData.lineWidth = Math.abs(bestCreature[2][bestCreature[2].length - 1][(x * bestCreature[3][bestCreature[3].length - 1].length) + c]) * 1;

				if (bestCreature[2][bestCreature[2].length - 1][(x * bestCreature[3][bestCreature[3].length - 1].length) + c] < 0) {
					ctxData.strokeStyle = "rgb(255, 120, 120)"
				}
				else {
					ctxData.strokeStyle = "rgb(120, 255, 120)"
				}

				if (bestCreature[2][bestCreature[2].length - 1][(x * bestCreature[3][bestCreature[3].length - 1].length) + c] > -0.05 && bestCreature[2][bestCreature[2].length - 1][(x * bestCreature[3][bestCreature[3].length - 1].length) + c] < 0.05) {
					ctxData.strokeStyle = "rgb(10, 10, 30)"
				}

				ctxData.beginPath();
				ctxData.moveTo(240, (x * (canvasData.height / 2)) + 60);
				ctxData.lineTo(40 + ((150 / creatureNeurons.length) * (creatureNeurons.length)), (c * (canvasData.height / creatureNeurons[creatureNeurons.length - 1])) + 15);
				ctxData.stroke();
			}

		}

	}
}

let frames = 0

let lastUpdateTime = 0;
let lastUpdateDate = Date.now();
let timer = 0;
let deltaTime = 0;

function update() {
	deltaTime = (Date.now() - lastUpdateDate) / 1000;
	lastUpdateDate = Date.now();

	timer += 1 * deltaTime;

	if (FPS > 0) {
		if (lastUpdateTime + (1 / FPS) < timer) {

			lastUpdateTime = timer;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			frames += 1;

			updateNeurons();

			if (frames > creatureFrameLimit) {
				frames = 0;
				generation += 1;

				killAndReproduceNeutons();
				updateBestNeuralNetworkDisplay();
			}
		}
	}

	renderPixels();

	requestAnimationFrame(update);
}

setupPixelMap();
setupStartingNeutons();

updateBestNeuralNetworkDisplay();

document.getElementById("generation-counter").innerText = "Generation " + generation;

document.getElementById("apply").addEventListener("click", e => {
	startingCreatureCount = Number(document.getElementById("spawned").value);

	creatureNeurons = document.getElementById("neurones").value.split(",");

	creatureMutationChance = Number(document.getElementById("mutationChance").value);

	mapWidth = Number(document.getElementById("grid-size-x").value);
	mapHeight = Number(document.getElementById("grid-size-y").value);

	updateSafeSpaceWithMapSize();

	creatureFrameLimit = Math.max(mapWidth, mapHeight) + 50;

	document.getElementById("generationTiming").innerText = "Generation Life Time: " + round(creatureFrameLimit / 30) + "s";

	// Reset all variables to restart the simulation
	frames = 0

	lastUpdateTime = 0;
	lastUpdateDate = Date.now();
	timer = 0;
	deltaTime = 0;

	// Clear creature pixels

	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			if (pixelMap[y][x].toString().substring(0, 1) == "#") {
				pixelMap[y][x] = 0;
			}
		}
	}

	creatureData = [];
	killedCreatures = [];
	bestCreature = null;

	generation = 1

	document.getElementById("generation-counter").innerText = "Generation " + generation;

	document.getElementById("survival-rate").innerHTML = "";

	savedFPS = 30;
	FPS = 0;
	playPauseBool = false;

	speedControlButtons[1].innerHTML = '<i data-feather="play"></i>';

	feather.replace();

	setupStartingNeutons();

	updateBestNeuralNetworkDisplay();

	renderPixels();

})

function updateSafeSpaceWithMapSize() {

	mapPosition = {
		x: (window.innerWidth / 2) - ((pixelSize * mapWidth) / 2),
		y: 0
	}

	if (window.innerWidth < 1200) {
		mapPosition.x = 40
	}

	for (let y = 0; y < mapHeight; y++) {
		let mapArr = [];
		let mapArr2 = [];

		for (let x = 0; x < mapWidth; x++) {
			if (pixelMap[y][x] != null) {
				mapArr.push(pixelMap[y][x]);
				mapArr2.push(safeZones[y][x]);
			}
			else {
				mapArr.push(0);
				mapArr2.push(0);
			}
		}

		pixelMap[y] = mapArr;
		safeZones[y] = mapArr2;
	}

	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			if (mapSafeX < x) {
				safeZones[y][x] = 1;
			}
		}
	}

}

update();