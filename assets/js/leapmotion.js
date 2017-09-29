!function (global) {

	function concatData(id, data) {
		return id + ": " + data + "<br>";
	}

	function concatJointPosition(id, position) {
		return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";
	}

	function getFingerName(fingerType) {
		switch(fingerType) {
			case 0:
			return 'Thumb';
			break;

			case 1:
			return 'Index';
			break;

			case 2:
			return 'Middle';
			break;

			case 3:
			return 'Ring';
			break;

			case 4:
			return 'Pinky';
			break;
		}
	}

	const output = document.getElementById("output");
	const options = { enableGestures: true };

	let frameString = "", handString = "", fingerString = "";

	Leap.loop(options, function(frame) {
		frameString = concatData("frame_id", frame.id);
		frameString += concatData("num_hands", frame.hands.length);
		frameString += concatData("num_fingers", frame.fingers.length);
		frameString += "<br>";

		for (var i = 0, len = frame.hands.length; i < len; i++) {
			hand = frame.hands[i];
			handString = concatData("hand_type", hand.type);
			handString += concatData("confidence", hand.confidence);
			handString += concatData("pinch_strength", hand.pinchStrength);
			handString += concatData("grab_strength", hand.grabStrength);

			handString += '<br>';

			fingerString = concatJointPosition("finger_thumb_dip", hand.thumb.dipPosition);

			if(hand.type == "right"){
				const indexTip = hand.indexFinger.tipPosition;
				handString = concatData("hand_indexFinger indexTip", indexTip);
			}

			for (var j = 0, len2 = hand.fingers.length; j < len2; j++) {
				finger = hand.fingers[j];

				fingerString += concatData("finger_type", finger.type) + " (" + getFingerName(finger.type) + ") <br>";


				// fingerString += concatJointPosition("finger_dip", finger.dipPosition);
				// fingerString += concatJointPosition("finger_pip", finger.pipPosition);
				// fingerString += concatJointPosition("finger_mcp", finger.mcpPosition);
				// fingerString += "<br>";
			}

			frameString += handString;
			frameString += fingerString;
		}

		output.innerHTML = frameString;
	});

}(window);