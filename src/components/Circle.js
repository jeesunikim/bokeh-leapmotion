import { ParseToNum, getRandom } from '../utils';

export default class Circle {
	constructor(canvas, context, options) {
		this.canvas = canvas;
		this.ctx = context;
		this.options = options;
		
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

		this.drawCircle = this.drawCircle.bind(this);
	}

	setTransform(position) {
		let {ctx} = this;

		ctx.beginPath();
		ctx.arc(position[0], position[1], 10, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}

	drawCircle() {

		let {ctx} = this;
		let {x,y,initialX,initialY,radius,speed,id} = this.options;

		console.log(ctx, ' this.x')

		this.counter += this.sign * speed;

		ctx.beginPath();
		ctx.arc(
			x,
			y,
			radius, 
			0, 
			Math.PI*2,
			true
		);

		ctx.globalCompositeOperation = 'lighter';
		ctx.fillStyle = "hsla(" + this.hue + ", " + this.sat + "%, 88%" + ", " + this.opacity + ")";
		ctx.fill();
		ctx.save();
		ctx.closePath();

		this.options.x = parseFloat(initialX) + parseFloat(Math.cos(this.counter / 10)) ;
		this.options.y = parseFloat(initialY) + parseFloat(Math.sin(this.counter / 10)) ;
	}
}