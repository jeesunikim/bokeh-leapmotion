const leapJS = require("leapjs");

function concatData(id, data) {
	return id + ": " + data + "<br>";
}

const output = document.getElementById('output');
let frameString = "", 
	handString = "", 
	fingerString = "",
	hand,
	finger;

// Leap.loop uses browser's requestAnimationFrame

const options = {enableGestures: true};

// Main Leap Loop

Leap.loop(options, function(frame) {
	frameString = concatData("frame_id", frame.id);
	frameString += concatData("num_hands", frame
		.hands.length);
	frameString += concatData("num_fingers", frame.fingers.length);
	frameString += "<br>";

	output.innerHTML = frameSring;
})