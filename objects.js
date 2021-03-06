// Parse JSON from blueprint

// Create Room Objects from the JSON 

// Define a room object
// Room objects: attr= name, dimension, floor 
function Room(name, width, height) {
   this.name = name;
   this.width = width;
   this.height = height;
   this.door = undefined;
}

function Door(xCenter, yCenter, isRotated) {
   this.xCenter = xCenter;
   this.yCenter = yCenter;
   this.rotated = isRotated;
}

// Define a cluster
function Cluster(roomList, width, height){

   this.roomList = roomList;
   this.width = width;
   this.height = height;
   this.rotated = false;
   this.xPos = undefined; // Top-left corner
   this.yPos = undefined; 
}

// returns a list of Room objects
// use: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse 
function JSONtoRoomList(json) {

  var roomList = [];

  var fullBathCount = json['param_bathFull'];
  var param_bathFull_width = json['param_bathFull_width'];
  var param_bathFull_length = json['param_bathFull_length'];
  
  for (i = 0; i < fullBathCount; i++) {
    roomList.push(new Room("Bath-Full", parseInt(json['param_bathFull_width']), parseInt(json['param_bathFull_length']))); 
  }

  var halfBathCount = json['param_bathHalf'];
  for (i = 0; i < halfBathCount; i++) {
    roomList.push(new Room("Bath-Half", parseInt(json['param_bathHalf_width']), parseInt(json['param_bathHalf_length']))); 
  }

  var masterCount = json['param_bedMaster'];
  for (i = 0; i < masterCount; i++) {
    roomList.push(new Room("Bed-Master", parseInt(json['param_bedMaster_width']), parseInt(json['param_bedMaster_length']))); 
  }

  var standardCount= json['param_bedStandard'];
  for (i = 0; i < standardCount; i++) {
    roomList.push(new Room("Bedroom-Standard", parseInt(json['param_bedStandard_width']), parseInt(json['param_bedStandard_length']))); 
  }

  var diningCount= json['param_dining'];
  for (i = 0; i < diningCount; i++) {
    roomList.push(new Room("Dining Room", parseInt(json['param_dining_width']), parseInt(json['param_dining_length']))); 
  }

  var kitchenCount = json['param_kitchen'];
  for (i = 0; i < kitchenCount; i++) {
    roomList.push(new Room("Kitchen", parseInt(json['param_kitchen_width']), parseInt(json['param_kitchen_length']))); 
  }

  var livingCount = json['param_living'];
  for (i = 0; i < livingCount; i++) {
    roomList.push(new Room("Living Room", parseInt(json['param_living_width']), parseInt(json['param_living_length']))); 
  }
  
  return roomList;
}

// input: a list of Room objects
// output: a set of 4 clusters, where each cluster is a rectangle which holds a set of rooms
 
function shuffle(array) {
  // source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function groupRooms(roomList) {
  // shuffle array
  roomList = shuffle(roomList);

  // set up clusters:
  var groupList = [[],[],[],[]];

  // match rooms into four clusters
  for (i=0; i<roomList.length; i++) {
    var groupIndex = (i % 4); 
    groupList[groupIndex].push(roomList[i]);
  }

  return groupList;
}

// Returns a list of four clusters which include the rooms.
// Clusters are ordered by largest square footage to smallest. 
function createClusterList(groupList) {
  var clusterList = [];

  for (i=0; i<groupList.length; i++) {
    var totalWidth = 0;
    var totalHeight = 0;
    var roomList = groupList[i];
    for (roomIndex = 0; roomIndex<roomList.length; roomIndex++) {
      var room = roomList[roomIndex];
      totalWidth += room.width;
      totalHeight = Math.max(room.height, totalHeight);
    }
    var cluster = new Cluster(roomList, totalWidth, totalHeight);
    clusterList.push(cluster);
  }

  function compare(a,b) {
    return (b.width*b.height) - (a.width*a.height);
  };

  clusterList.sort(compare);

  return clusterList;
}

// gets random order of corners 1, 2, 3, 4 to place clusters in
function getRoomPlacementOrder() {
  return shuffle([1,2,3,4]);
}

// returns width and height of floor
function getFloorDimensions(json) {
  var floorDimensions = [json['param_width'], json['param_length']]; // [width, height]
  return floorDimensions;        
}