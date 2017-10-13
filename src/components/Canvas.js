import { ParseToNum, getRandom } from '../utils';
import { addClass, concatData } from '../utils';

const body = document.body;

export default class Canvas {
	constructor(canvas, context) {
		this.canvas = canvas;
		this.context = context;

		this.changeToScene = this.changeToScene.bind(this);
	}

	rotateToChange(rotation) {
		let 
			defaultScene = rotation < .8 && rotation > 0 ? true : false, // less than .5
			nextScene = rotation < -.5,
			previousScene = rotation > .8;

		if(defaultScene) {
			this.changeToScene("defaultScene");	
		}
		if(nextScene){
			this.changeToScene("nextScene")	
		}
		if(previousScene){
			this.changeToScene("previousScene")
		}
	}

	changeToScene(scene) {
		body.className="";
		addClass(body, scene);
	}
}