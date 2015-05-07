var Floor = function(width, height, clusters) {
	this.width = width;
	this.height = height;
	this.clusters = clusters.slice(); // List of clusters to place
	this.arrangements = new Object(); // All created arrangements

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

	// returns whether adding cluster was successful
	this.addCluster = function(cluster, corner, isRotated) {
		if (this.isValidPlacement(cluster, corner, isRotated)) {
			this.markFilled(cluster, corner, isRotated);
		}
		return false;
	}

	this.markFilled = function(cluster, corner, isRotated) {
		var clusterWidth = cluster.width;
		var clusterHeight = cluster.height;
		// Flip dimensions if cluster is rotated
		if (isRotated) {
			clusterWidth = cluster.height;
			clusterHeight = cluster.width;
		}

		// Set boundary coordinates of cluster in grid
		var minX, maxX, minY, maxY;
		if (corner == 1) {
			minX = 0;
			maxX = clusterWidth-1;
			minY = 0;
			maxY = clusterHeight-1;
		} else if (corner == 2) {
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = 0;
			maxY = clusterHeight-1;
		} else if (corner == 3) {
			minX = this.width-clusterWidth;
			maxX = this.width-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		} else if (corner == 4) {
			minX = 0;
			maxX = clusterWidth-1;
			minY = this.height-clusterHeight;
			maxY = this.height-1;
		}

		// Fill in cluster's boundaries to mark filled
		if (minX != undefined) { // Boundaries were set
			for (var x = minX; x < maxX; x++) {
				for (var y = minY; y < maxY; y++) {
					this.grid[y][x] = 2;
				}
			}
		}
	}

	this.isValidPlacement = function(cluster, corner, isRotated) {
		var clusterWidth = cluster.width;
		var clusterHeight = cluster.height;
		if (isRotated) {
			clusterWidth = cluster.height;
			clusterHeight = cluster.width;
		}

		// Checks the four corners of the cluster on the grid to be empty
		// All squares in between should therefore be empty
		// Checks cluster's corners top-left to bottom-left in clockwise order
		if (corner == 1) {
			return (this.grid[0][0] == 0
				&& this.grid[0][clusterWidth-1] == 0
				&& this.grid[clusterHeight-1][clusterWidth-1] == 0
				&& this.grid[clusterHeight-1][0] == 0);
		} else if (corner == 2) {
			return (this.grid[0][this.width-clusterWidth] == 0
				&& this.grid[0][this.width-1] == 0
				&& this.grid[clusterHeight-1][this.width-1] == 0
				&& this.grid[clusterHeight-1][this.width-clusterWidth] == 0);
		} else if (corner == 3) {
			return (this.grid[this.height-clusterHeight][this.width-clusterWidth] == 0 
				&& this.grid[this.height-clusterHeight][this.width-1] == 0
				&& this.grid[this.height-1][this.width-1] == 0
				&& this.grid[this.height-1][this.width-clusterWidth] == 0);
		} else if (corner == 4) {
			return (this.grid[this.height-clusterHeight][0] == 0 
				&& this.grid[this.height-clusterHeight][clusterWidth-1] == 0 
				&& this.grid[clusterHeight-1][clusterWidth-1] == 0
				&& this.grid[clusterHeight-1][0] == 0);
		}
	}

	this.addHallway = function(cluster, corner) {

	}
}

// clusters already ordered largest to smallest
// orderings: list of corner ordering lists to try from top-left, going clockwise
var shuffle = function(clusters, orderings) {
	var width = 50;
	var height = 50;
	var floor = new Floor(width, height, clusters);

	for (var i = 0; i < orderings.length; i++) {
		var ordering = orderings[i];
		for (var j = 0; j < clusters.length) {
			var clusterToPlace = clusters[j];
			if (!floor.addCluster(clusterToPlace, ordering[j]) break;
		}
	}
}