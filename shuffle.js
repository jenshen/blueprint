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

	this.addCluster = function(cluster, corner) {

	}

	this.markFilled = function(cluster) {
		// this.clusterWidth = (cluster.orientation % 2 == 0) ? same : flipped;
		// this.clusterHeight = (cluster.orientation % 2 == 0) ? same : flipped;
		for 
	}

	this.isValidPlacement = function(cluster) {

	}

	this.findEmptySquare = function() {

	}
}

// clusters already ordered largest to smallest
// orderings: list of corner ordering lists to try from top-left, going clockwise
var shuffle = function(clusters, orderings) {
	var width = 50;
	var height = 40;
	var floor = new Floor(width, height, clusters);

	for (var i = 0; i < orderings.length; i++) {
		var ordering = orderings[i];
		for (var j = 0; j < clusters.length) {
			var clusterToPlace = clusters[j];
			floor.addCluster(clusterToPlace, ordering[j]);
		}
	}
}