var mqtt = require('mqtt');
var settings = require('./config/settings');

var iot_server = settings.iot_deviceOrg + ".messaging.internetofthings.ibmcloud.com";
var iot_username = "use-token-auth";
var iot_clientid = "d:" + settings.iot_deviceOrg + ":" + settings.iot_deviceType + ":" ;

var tot_boxes = settings.iot_deviceSet.length;
var TELEMETRY_RATE =2;

console.log("Simulating " + tot_boxes + " boxes");

var clients = new Array();
for(var i=1; i<=tot_boxes;i++){
	var client = mqtt.createClient(1883, iot_server, { clientId: iot_clientid+i, username: iot_username, password: settings.iot_deviceSet[i-1].token });
	clients.push(client);
}
// subscribe
var propertyTopic = "iot-2/cmd/setProperty/fmt/json";
// publish
var telemetryTopic = "iot-2/evt/telemetry/fmt/json";

//initializing boxes
var boxes = Array();
for (var i = 1; i < 3; i++) {
	boxes.push(new DeliveryBox(i,"available", "Centraal",52.3782623,4.8973583));
}
for (var i = 3; i < 5; i++) {
	boxes.push(new DeliveryBox(i,"available", "West",52.372861, 4.858998));
}
for (var i =5; i <= 7; i++) {
	boxes.push(new DeliveryBox(i,"available", "Zuid",52.337345, 4.873607));
}
for (var i =7; i <= tot_boxes; i++) {
	boxes.push(new DeliveryBox(i,"available", "Oost",52.354536, 4.929004));
}

mapLoaded();

function DeliveryBox(id,state,parking,lat,lng) {
	
	this.id = id;
	this.state = state;
	this.spot = spot;
	this.lat = lat;
	this.lng = lng;
	
}

function mapLoaded() {
	console.log("entered mapLoaded");
	subscribeToProperties();
	setInterval(function() {
		publishData();
		}, 1000 / TELEMETRY_RATE);
}

DeliveryBox.prototype.getPublishPayload = function() {
	return {
		id: this.id,
		state: this.state,
		pos: this.pos,
		lat: this.lat,
		lng: this.lng
	};
}

function publishData() {
	for (var i in boxes) {
		if(boxes[i].getPublishPayload().state=="empty"&& Math.random()<0.05){
			boxes[i].state = "available";
			console.log("from empty to available "+boxes[i].getPublishPayload().id);
		}
		if(boxes[i].getPublishPayload().state=="reserved"&& Math.random()<0.05){
			boxes[i].state = "empty";
			console.log("from reserved to empty "+boxes[i].getPublishPayload().id);
		}
		clients[i].publish(telemetryTopic, JSON.stringify(boxes[i].getPublishPayload()));
	}
}

function subscribeToProperties() {
	for (var i in boxes) {
	clients[i].subscribe(propertyTopic);
	console.log("subscribed to: " +i+ propertyTopic );


	clients[i].on('message', function(topic,message) {
		
		console.log("command to reserved received for: " +message);
		try {
			var data = JSON.parse(message);
			var id = data.id;

			var v = getSpot(id);
			v.state="reserved";
			
		} catch (e) { console.error(e); }
	});}
}

function getSpot(id) {
	for (var i in boxes) {
		if (boxes[i].id == id) {
			return boxes[i];
		}
	}
	return null;
}