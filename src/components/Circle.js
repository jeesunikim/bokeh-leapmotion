import { ParseToNum, getRandom } from '../utils';

export default class Circle {
	constructor(options) {
		this.canvas = document.getElementById('bokeh-canvas');
		this.context = this.canvas.getContext("2d");
		
		this.opacity = .25 + Math.random() * .5;
		this.counter = 0;

		let signHelper = Math.floor(Math.random() * 2);


		this.colorrange = [0, 120, 240],
		this.hue = this.colorrange[getRandom(0, this.colorrange.length - 1)],
		this.sat = getRandom(50, 100);

		if (signHelper == 1) {
			this.sign = -1;
		} else {
			this.sign = 1;
		}

		// options is from Leap Motion Detection
		this.options = options;

		this.drawCircle = this.drawCircle.bind(this);
		// this.update = this.update.bind(this);
	}

	setTransform(position) {
		this.context.beginPath();
		this.context.arc(position[0], position[1], 10, 0, Math.PI*2);
		this.context.fill();
		this.context.closePath();
	}

	drawCircle() {

		this.counter += this.sign * this.options.speed;

		// console.log(this.hue, this.sat, ' this.hue, sat')
		this.context.beginPath();
		this.context.arc(
			// this.options.x,
			// this.options.y,
			parseFloat(this.options.x) + parseFloat(Math.cos(this.counter / 100)) * parseFloat(this.options.radius), 
			parseFloat(this.options.y) + parseFloat(Math.sin(this.counter / 100)) * parseFloat(this.options.radius),
			this.options.radius, 
			0, 
			Math.PI*2
		);
		this.context.globalCompositeOperation = 'lighter';
		this.context.fillStyle = "hsla(" + this.hue + ", " + this.sat + "%, 88%" + ", " + this.opacity + ")";
		this.context.fill();
		this.context.closePath();

	}

	// update(currentCircle) {
		
	// 	this.counter += this.sign * this.options.speed;

	// 	this.context.save();
	// 	currentCircle.beginPath();
	// 	currentCircle.arc(
	// 		parseFloat(this.options.x) + parseFloat(Math.cos(this.counter / 100)) * parseFloat(this.options.radius), 
	// 		parseFloat(this.options.y) + parseFloat(Math.sin(this.counter / 100)) * parseFloat(this.options.radius),
	// 		this.options.radius,
	// 		0,
	// 		Math.PI*2
	// 	)
	// 	currentCircle.fill();
	// 	currentCircle.fillStyle = 'rgba(185, 211, 238,' + this.opacity + ')';
	// 	currentCircle.closePath();
	// }
}