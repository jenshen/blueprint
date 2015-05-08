var Layout = function(width, height, clusters) {
	this.width = width;
	this.height = height;
	this.clusters = clusters.slice(); // List of clusters to place
	// this.arrangements = new Object(); // All created arrangements
	this.HALLWAY_WIDTH = 5;
	this.DOOR_WIDTH = 3;
	this.OPEN_WALLS = [['right', 'bottom'], // [rotated, unrotated]; corners 1-4
		['bottom', 'left'],
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

	console.log(this.grid);

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
		var clusterWidth = cluster.width;
		var clusterHeight = cluster.height;
		// Flip dimensions if cluster is rotated
		if (cluster.rotated) {
			clusterWidth = cluster.height;
			clusterHeight = cluster.width;
		}

		// Set boundary coordinates of cluster in grid
		var minX, maxX, minY, maxY;
		var hallwayDeltas = [];
		if (corner == 1) { // Top-left
			hallwayDeltas = [0, this.HALLWAY_WIDTH, 0, this.HALLWAY_WIDTH];
			minX = 0;
			maxX = clusterWidth-1;
			minY = 0;
			maxY = clusterHeight-1;
			hallwayDeltas = 
		} else if (corner == 2) { // Top-right
			hallwayDeltas = [-this.HALLWAY_WIDTH, 0, 0, this.HALLWAY_WIDTH];
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = 0;
			maxY = clusterHeight-1;
		} else if (corner == 3) { // Bottom-right
			hallwayDeltas = [-this.HALLWAY_WIDTH, 0, this.HALLWAY_WIDTH, 0];
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		} else if (corner == 4) { // Bottom-left
			hallwayDeltas = [0, this.HALLWAY_WIDTH, this.HALLWAY_WIDTH, 0];
			minX = 0;
			maxX = clusterWidth-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		}

		if (minX == undefined) return false; // Boundaries not set from invalid corner

		
		var d_minX = hallwayDeltas[0];
		var d_maxX = hallwayDeltas[1];
		var d_minY = hallwayDeltas[2];
		var d_maxY = hallwayDeltas[3];

		// IS VALID PLACEMENT
		for (var x = minX + d_minX; x < maxX + d_maxX; x++) {
			for (var y = minY + d_minY; y < maxY + d_maxY; y++) {
				if (this.grid[y][x] == 2) return false;
			}
		}

		// MARK HALLWAY FILLED
		for (var x = minX+d_minX; x < maxX+d_maxX; x++) {
			for (var y = minY+d_minY; y < maxY+d_maxY; y++) {
				this.grid[y][x] = 1;
			}
		}

		// MARK ROOM FILLED
		for (var x = minX; x < maxX; x++) {
			for (var y = minY; y < maxY; y++) {
				this.grid[y][x] = 2;
			}
		}

		// var updatedCluster = Cluster(cluster.roomList, cluster.width, cluster.height);
		// updatedCluster.rotated = cluster.rotated;
		// updatedCluster.xPos = minX;
		// updatedCluster.yPos = minY;
		// arrangements.add(updatedCluster);

		// UPDATE X, Y POSITION
		cluster.xPos = minX;
		cluster.yPos = minY;

		// ADD DOORS
		var openWall = OPEN_WALLS[corner-1][cluster.rotated ? 0 : 1];
		var rooms = cluster.roomList;
		var totalDistance = 0;
		if (openWall == 'left' || openWall == 'right') {
			// Cluster is rotated
			for (int i = 0; i < rooms.length; i++) {
				// Must flip height + width since cluster is rotated
				var roomHeight = rooms[i].width;

				// Initially place doors on left side of cluster
				var xCenter = xMin + 0;
				var yCenter = yMin + Math.floor(roomHeight/2);

				// Move doors to right side of cluster
				if (openWall == 'right') xCenter += (cluster.Width-1); 

				// Door created with coordinates relative to entire layout + rotation included
				// Coordinates are center of door
				rooms[i].door = Door(xCenter, yCenter, cluster.rotated);
			}
		} else if (openWall == 'top' || openWall == 'bottom') {
			// Cluster NOT rotated
			for (int i = 0; i < rooms.length; i++) {
				// Must flip height + width since cluster is rotated
				var roomWidth = rooms[i].width;

				// Initially place doors on top side of cluster
				var xCenter = xMin + Math.floor(roomWidth/2);
				var yCenter = yMin + 0;

				// Move doors to bottom side of cluster
				if (openWall == 'bottom') yCenter += (cluster.Height-1); 

				// Door created with coordinates relative to entire layout + rotation included
				rooms[i].door = Door(xCenter, yCenter, cluster.rotated);
			}
		}

		return true;
	}

	// this.isValidPlacement = function(cluster, corner, isRotated) {
	// 	var clusterWidth = cluster.width;
	// 	var clusterHeight = cluster.height;
	// 	if (isRotated) {
	// 		clusterWidth = cluster.height;
	// 		clusterHeight = cluster.width;
	// 	}

	// 	// Checks the four corners of the cluster on the grid to be empty
	// 	// All squares in between should therefore be empty
	// 	// Checks cluster's corners top-left to bottom-left in clockwise order
	// 	var roomCanBePlaced 
	// 	if (corner == 1) {
	// 		return (this.grid[0][0] == 0
	// 			&& this.grid[0][clusterWidth-1] == 0
	// 			&& this.grid[clusterHeight-1][clusterWidth-1] == 0
	// 			&& this.grid[clusterHeight-1][0] == 0);
	// 	} else if (corner == 2) {
	// 		return (this.grid[0][this.width-clusterWidth] == 0
	// 			&& this.grid[0][this.width-1] == 0
	// 			&& this.grid[clusterHeight-1][this.width-1] == 0
	// 			&& this.grid[clusterHeight-1][this.width-clusterWidth] == 0);
	// 	} else if (corner == 3) {
	// 		return (this.grid[this.height-clusterHeight][this.width-clusterWidth] == 0 
	// 			&& this.grid[this.height-clusterHeight][this.width-1] == 0
	// 			&& this.grid[this.height-1][this.width-1] == 0
	// 			&& this.grid[this.height-1][this.width-clusterWidth] == 0);
	// 	} else if (corner == 4) {
	// 		return (this.grid[this.height-clusterHeight][0] == 0 
	// 			&& this.grid[this.height-clusterHeight][clusterWidth-1] == 0 
	// 			&& this.grid[clusterHeight-1][clusterWidth-1] == 0
	// 			&& this.grid[clusterHeight-1][0] == 0);
	// 	}
	// }
}

// clusters already ordered largest to smallest
// orderings: list of corner ordering lists to try from top-left, going clockwise
var shuffle = function(clusters, orderings) {
	var width = 50;
	var height = 50;
	var layout = new Layout(width, height, clusters);

	for (var i = 0; i < orderings.length; i++) {
		var ordering = orderings[i];
		layout.addFoyer(); // Add foyer first to mark space
		for (var j = 0; j < clusters.length) {
			var clusterToPlace = clusters[j];
			if (!layout.addCluster(clusterToPlace, ordering[j]) break;
		}
	}
}

// Convert layouts to parsable format for 2D-visualization generation
var layoutToJson = function(layouts) {
	var finalOutput = new Object();
	var roomCount = 0;

	for (int i = 0; i < layouts.length; i++) {
		var clusters = layout[i].clusters;
		var roomsOutput = new Object();
		var doorsOutput = new Object();

		for (int j = 0; j < clusters.length; j++) {
			var c = clusters[j];
			var isRotated = c.rotated;
			var rooms = clusters[j].roomList;
			var clusterLength = 0;

			for (int k = 0; k < rooms.length; k++) {
				var r = rooms[k];
				var roomHeight = isRotated ? r.width : r.height;
				var roomWidth = isRotated ? r.height : r.width;

				// Add room's coords
				if (isRotated) { // Rooms go vertically
					roomsOutput[roomCount] = [c.minX, c.minY+clusterLength, c.minX+roomWidth, clusterLength+roomHeight];
					clusterLength += roomHeight;
				} else { // Rooms go horizontally
					roomsOutput[roomCount] = [c.minX+clusterLength, c.minY, clusterLength+roomWidth, c.minY+roomHeight];
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

		finalOutput[i] = {"roomCount": roomCount, "rooms": roomsOutput, "doors": doorsOutput};
	}

	return finalOutput;
}

// called by main.js 
// params is a JSON of all user constraints
// returns JSON of rectangles of all layouts to draw on visualization for a given cluster
function createBlueprint(params) {
	// calls roomList = JSONtoRoomList(params)

	// calls groupList = groupRooms(roomList)

	// calls clusterList = createClusterList(groupList)

	// make orderings = getRoomPlacementOrder()

	// layoutList = shuffle(clusterList, orderings);

	// return layoutToJSON(layoutList);
}	





