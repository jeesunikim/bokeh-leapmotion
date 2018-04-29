import LeapMotionDetect from "./components/LeapMotionDetect";

document.addEventListener("DOMContentLoaded", () => {
	const Bokeh = new LeapMotionDetect();

	Bokeh.init();

	console.log("Bokeh DOM has been loaded");
});
