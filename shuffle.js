var Layout = function(width, height, clusters) {
	this.width = width;
	this.height = height;
	this.clusters = clusters.slice(); // List of clusters to place
	this.numRooms = 0;
	for (var r = 0; r < this.clusters.length; r++) {
		this.numRooms += this.clusters[r].roomList.length;
	}

	this.HALLWAY_WIDTH = 5;
	this.DOOR_WIDTH = 3;
	this.OPEN_WALLS = [['right', 'bottom'], // [rotated, unrotated]; corners 1-4
		['left', 'bottom'],
		['left', 'top'],
		['right', 'top']]

	// grid is a 2D array marking which squares have been filled by room(s)
	// a square contains a # which indicates what kind of room it is a part of:
	// 0 = empty; 1 = hallway; 2 = room
	this.grid = new Array(this.height);
	for (var i = 0; i < this.height; i++) {
		this.grid[i] = new Array(this.width);
		for (var j = 0; j < this.width; j++) {
			this.grid[i][j] = 0;
		}
	}

	// console.log(this.grid);

	// adds a foyer (size: width=5 by height=10) to the same location of each apartment where the door goes
	// location = bottom center of each layout along the wider wall
	// this labels those squares as a hallway (1)
	this.addFoyer = function() {
		var roomCenterWidth = Math.floor(this.width/2);
		var foyerStart = roomCenterWidth - 3; 
		var foyerEnd = roomCenterWidth + 2;
		var foyerLength = 10; 

		for (i = 0; i < foyerLength; i++) {
			for (j = foyerStart; j < foyerEnd; j++) {
				this.grid[this.height-1-i][j] = 1;
			}
		}
	}

	// returns whether adding cluster was successful
	this.addCluster = function(cluster, corner) {
		//console.log("corner "+corner);
		//console.log(cluster);
		var clusterWidth = cluster.width;
		var clusterHeight = cluster.height;

		// Flip dimensions if cluster is rotated
		if (cluster.rotated) {
			clusterWidth = cluster.height;
			clusterHeight = cluster.width;
		}
		
		//console.log(clusterWidth +" "+clusterHeight);


		// Set boundary coordinates of cluster in grid
		var minX, maxX, minY, maxY;
		var hallwayDeltas = [];
		if (corner == 1) { // Top-left
			hallwayDeltas = [0, this.HALLWAY_WIDTH, 0, this.HALLWAY_WIDTH];
			minX = 0;
			maxX = clusterWidth-1;
			minY = 0;
			maxY = clusterHeight-1;
		} else if (corner == 2) { // Top-right
			hallwayDeltas = [-this.HALLWAY_WIDTH, 0, 0, this.HALLWAY_WIDTH];
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = 0;
			maxY = clusterHeight-1;
		} else if (corner == 3) { // Bottom-right
			hallwayDeltas = [-this.HALLWAY_WIDTH, 0, -this.HALLWAY_WIDTH, 0];
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		} else if (corner == 4) { // Bottom-left
			hallwayDeltas = [0, this.HALLWAY_WIDTH, -this.HALLWAY_WIDTH, 0];
			minX = 0;
			maxX = clusterWidth-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		}

		//console.log("minX, corner: " + minX + " " + corner);
		if (minX == undefined) return false; // Boundaries not set from invalid corner
		
		var d_minX = hallwayDeltas[0];
		var d_maxX = hallwayDeltas[1];
		var d_minY = hallwayDeltas[2];
		var d_maxY = hallwayDeltas[3];

		// IS VALID PLACEMENT
		for (var x = minX + d_minX; x < maxX + d_maxX; x++) {
			for (var y = minY + d_minY; y < maxY + d_maxY; y++) {
				if (this.grid[y][x] == 2) {
					return false;
				}
			}
		}

		// MARK HALLWAY FILLED
		for (var x = minX + d_minX; x < maxX + d_maxX; x++) {
			for (var y = minY + d_minY; y < maxY + d_maxY; y++) {
				this.grid[y][x] = 1;
			}
		}

		// MARK ROOM FILLED
		for (var x = minX; x < maxX; x++) {
			for (var y = minY; y < maxY; y++) {
				this.grid[y][x] = 2;
			}
		}

		// UPDATE X, Y POSITION
		//console.log("x, y: "+minX+" "+minY);
		cluster.xPos = minX;
		cluster.yPos = minY;

		// ADD DOORS
		var openWall = this.OPEN_WALLS[corner-1][cluster.rotated ? 0 : 1];
		var rooms = cluster.roomList;
		var totalDistance = 0;
		if (openWall == 'left' || openWall == 'right') {
			// Cluster is rotated
			var clusterLength = 0;
			for (var i = 0; i < rooms.length; i++) {
				// Must flip height + width since cluster is rotated
				var roomHeight = rooms[i].width;

				// Initially place doors on left side of cluster
				var xCenter = minX + 0;
				var yCenter = minY + Math.floor(roomHeight/2) + clusterLength;
				clusterLength += roomHeight;

				// Move doors to right side of cluster
				if (openWall == 'right') xCenter += (cluster.width-1); 

				// Door created with coordinates relative to entire layout + rotation included
				// Coordinates are center of door
				rooms[i].door = new Door(xCenter, yCenter, cluster.rotated);
			}
		} else if (openWall == 'top' || openWall == 'bottom') {
			var clusterLength = 0;
			// Cluster NOT rotated
			for (var i = 0; i < rooms.length; i++) {
				// Must flip height + width since cluster is rotated
				var roomWidth = rooms[i].width;

				// Initially place doors on top side of cluster
				var xCenter = minX + Math.floor(roomWidth/2) + clusterLength;
				var yCenter = minY + 0;
				clusterLength += roomWidth;

				// Move doors to bottom side of cluster
				if (openWall == 'bottom') yCenter += (cluster.height-1); 

				// Door created with coordinates relative to entire layout + rotation included
				rooms[i].door = new Door(xCenter, yCenter, cluster.rotated);
			}
		}

		return true;
	}
}

// clusters already ordered largest to smallest
// orderings: list of corner ordering lists to try from top-left, going clockwise
// returns: list of generated layouts
var shuffleClusters = function(clusters, orderings, width, height) {
	var layouts = new Array();
	// console.log("orderings" + orderings);
	
	for (var i = 0; i < orderings.length; i++) {
		var layout = new Layout(width, height, clusters);
		var ordering = orderings[i];
		var layoutSuccessful = true;

		layout.addFoyer(); // Add foyer first to mark space

		// console.log(layout.grid);

		for (var j = 0; j < clusters.length; j++) {
			var clusterToPlace = clusters[j];
			if (!layout.addCluster(clusterToPlace, ordering[j])) {
			//	console.log("cluster failed");
				layoutSuccessful = false;
				break;
			}
			//console.log("cluster placed successfully ordering: " + i + "cluster: " + j);
		}

		if (layoutSuccessful) layouts.push(layout);
	}

	return layouts;
}

// called by main.js 
// params is a JSON of all user constraints
// returns JSON of rectangles of all layouts to draw on visualization for a given cluster
function createBlueprints(params) {
	var width = getFloorDimensions(params)[0];
	var height = getFloorDimensions(params)[1];

	// // calls roomList = JSONtoRoomList(params)
	// var roomList = JSONtoRoomList(params);

	// // calls groupList = groupRooms(roomList)
	// var groupList = groupRooms(roomList);

	// // calls clusterList = createClusterList(groupList)
	// var clusterList = createClusterList(groupList);

	// // make orderings = getRoomPlacementOrder()
	// // var orderings = [getRoomPlacementOrder(), getRoomPlacementOrder(), getRoomPlacementOrder(), getRoomPlacementOrder()];

	// var orderings = [getRoomPlacementOrder()];

	

	// // var width = 50;
	// // var height = 50;
	// var layoutList = shuffleClusters(clusterList, orderings, width, height);

	// var layoutJson = layoutToJson(layoutList);
	var numLayouts = 3;
	// console.log(layoutJson);
	var finalOutput = new Object();
	for (var i = 0; i < numLayouts; i++) {
		// calls roomList = JSONtoRoomList(params)
		var roomList = JSONtoRoomList(params);

		// calls groupList = groupRooms(roomList)
		var groupList = groupRooms(roomList);

		// calls clusterList = createClusterList(groupList)
		var clusterList = createClusterList(groupList);

		// make orderings = getRoomPlacementOrder()
		// var orderings = [getRoomPlacementOrder(), getRoomPlacementOrder(), getRoomPlacementOrder(), getRoomPlacementOrder()];

		var orderings = [getRoomPlacementOrder()];

		// var width = 50;
		// var height = 50;
		var layoutList = shuffleClusters(clusterList, orderings, width, height);

		var layoutJson = layoutToJson(layoutList);

		finalOutput[i] = layoutJson;
	}

	finalOutput["layoutCount"] = numLayouts;
	//console.log(finalOutput);
	return finalOutput;
}

// Convert layouts to parsable format for 2D-visualization generation
var layoutToJson = function(layouts) {
	var finalOutput = new Object();

	for (var i = 0; i < layouts.length; i++) {
		var clusters = layouts[i].clusters;
		var roomsOutput = new Object();
		var doorsOutput = new Object();
		var roomCount = 0;
		var numRooms = layouts[i].numRooms;

		for (var j = 0; j < clusters.length; j++) {
			var c = clusters[j];
			var isRotated = c.rotated;
			var rooms = clusters[j].roomList;
			var clusterLength = 0;

			for (var k = 0; k < rooms.length; k++) {
				var r = rooms[k];
				var roomHeight = isRotated ? r.width : r.height;
				var roomWidth = isRotated ? r.height : r.width;

				var roomData = new Object();
				// Add room's coords
				if (isRotated) { // Rooms go vertically
					roomData["type"] = r.name;
					roomData["coords"] = [c.xPos, c.yPos+clusterLength, c.xPos+roomWidth, c.yPos+clusterLength+roomHeight];
					roomsOutput[roomCount] = roomData;
					clusterLength += roomHeight;
				} else { // Rooms go horizontally
					roomData["type"] = r.name;
					roomData["coords"] = [c.xPos+clusterLength, c.yPos, c.xPos+clusterLength+roomWidth, c.yPos+roomHeight];
					roomsOutput[roomCount] = roomData;
					clusterLength += roomWidth;
				}

				// Add door's coords
				if (isRotated) {
					doorsOutput[roomCount] = [r.door.xCenter, r.door.yCenter-1, r.door.xCenter+1, r.door.yCenter+1];
				} else {
					doorsOutput[roomCount] = [r.door.xCenter-1, r.door.yCenter, r.door.xCenter+1, r.door.yCenter+1];
				}
				
				roomCount += 1;
			}
		}

		finalOutput[i] = {"roomCount": layouts[i].numRooms, "rooms": roomsOutput, "doors": doorsOutput};
	}

	return finalOutput;
}	





