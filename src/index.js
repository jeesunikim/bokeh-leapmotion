import { addClass } from './utils';
import * as LeapMotionDetect from "./components/LeapMotionDetect"; 

document.addEventListener("DOMContentLoaded", () => {
	addClass(document.body, "defaultScene");
	console.log("Bokeh DOM has been loaded");
});