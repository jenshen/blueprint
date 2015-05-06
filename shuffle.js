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
	this.addCluster = function(cluster, corner) {
		if (this.isValidPlacement(cluster, corner)) {
			this.markFilled(cluster, corner);
		}
		return false;
	}

	this.markFilled = function(cluster, corner, isHorizontal) {
		// this.clusterWidth = (cluster.orientation % 2 == 0) ? same : flipped;
		// this.clusterHeight = (cluster.orientation % 2 == 0) ? same : flipped;
		for 
	}

	this.isValidPlacement = function(cluster, corner, isHorizontal) {

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