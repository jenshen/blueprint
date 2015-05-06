var Floor = function(width, height, clusters) {
	this.width = width;
	this.height = height;
	this.clusters = clusters.slice(); // List of clusters to place
	this.arrangements = new Object(); // All created arrangements

	// grid is a 2D array marking which squares have been filled by room(s)
	this.grid = new Array(this.height);
	for (var i = 0; i < this.width; i++) {
		this.grid[i] = [];
	}

	// returns whether adding cluster was successful
	this.addCluster = function(cluster, corner, isRotated) {
		if (this.isValidPlacement(cluster, corner, isRotated)) {
			this.markFilled(cluster, corner, isRotated);
		}
		return false;
	}

	this.markFilled = function(cluster, corner, isRotated) {
		// this.clusterWidth = (cluster.orientation % 2 == 0) ? same : flipped;
		// this.clusterHeight = (cluster.orientation % 2 == 0) ? same : flipped;
		

		
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
			return !(this.grid[0][0] == 0
				&& this.grid[0][clusterWidth-1] == 0
				&& this.grid[clusterHeight-1][clusterWidth-1] == 0
				&& this.grid[clusterHeight-1][0] == 0)
		} else if (corner == 2) {
			return !(this.grid[0][this.width-1] == 0 && this.grid[clusterHeight-1][this.width-clusterWidth] == 0)
		} else if (corner == 3) {
			return !(this.grid[0][0] == 0 && this.grid[clusterHeight-1][clusterWidth-1] == 0)
		} else if (corner == 4) {
			return !(this.grid[0][0] == 0 && this.grid[clusterHeight-1][clusterWidth-1] == 0)
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