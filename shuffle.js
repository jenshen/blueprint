var Layout = function(width, height, clusters) {
	this.width = width;
	this.height = height;
	this.clusters = clusters.slice(); // List of clusters to place
	this.arrangements = new Object(); // All created arrangements
	this.HALLWAY_WIDTH = 5;

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
		var foyerStart = roomCenterWidth - 5; 
		var foyerEnd = roomCenterWidth + 5;
		var foyerLength = 10; 

		for (i = 0; i < foyerLength; i++) {
			for (j = foyerStart; j < foyerEnd; j++) {
				this.grid[this.height-1-i][j] = 1;
			}
		}
	}

	// returns whether adding cluster was successful
	this.addCluster = function(cluster, corner) {
		// if (this.isValidPlacement(cluster, corner, isRotated)) {
			// this.markFilled(cluster, corner, isRotated);
		// }
		this.markFilled(cluster, corner);
		return false;
	}

	this.markFilled = function(cluster, corner) {
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
		if (corner == 1) {
			hallwayDeltas = [0, this.HALLWAY_WIDTH, 0, this.HALLWAY_WIDTH];
			minX = 0;
			maxX = clusterWidth-1;
			minY = 0;
			maxY = clusterHeight-1;
			hallwayDeltas = 
		} else if (corner == 2) {
			hallwayDeltas = [-this.HALLWAY_WIDTH, 0, 0, this.HALLWAY_WIDTH];
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = 0;
			maxY = clusterHeight-1;
		} else if (corner == 3) {
			hallwayDeltas = [-this.HALLWAY_WIDTH, 0, this.HALLWAY_WIDTH, 0];
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		} else if (corner == 4) {
			hallwayDeltas = [0, this.HALLWAY_WIDTH, this.HALLWAY_WIDTH, 0];
			minX = 0;
			maxX = clusterWidth-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		}

		if (minX == undefined) return; // Boundaries not set from invalid corner

		// IS VALID PLACEMENT
		// MARK HALLWAY FILLED
		var d_minX = hallwayDeltas[0];
		var d_maxX = hallwayDeltas[1];
		var d_minY = hallwayDeltas[2];
		var d_maxY = hallwayDeltas[3];
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
		cluster.xPos = minX;
		cluster.yPos = minY;
		// arrangements.add(updatedCluster);
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
		for (var j = 0; j < clusters.length) {
			var clusterToPlace = clusters[j];
			if (!layout.addCluster(clusterToPlace, ordering[j]) break;
		}
	}
}