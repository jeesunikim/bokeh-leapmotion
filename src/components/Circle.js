import { ParseToNum, getRandom, getFloatRandom, hsla, hasClass } from '../utils';

const body = document.body;
 export default class Circle {
	constructor(canvas, context, options) {
		this.canvas = canvas;
		this.ctx = context;
		this.options = options;
	}

	setTransform(position) {
		let {ctx} = this;
		ctx.beginPath();
		ctx.arc(position[0], position[1], 5, 0, Math.PI*2);
		ctx.shadowBlur = 15;
		ctx.shadowColor = '#fff';
		ctx.fillStyle = hsla( 0, 0, 100, 1 );
		ctx.fill();
		ctx.closePath();
	}

	moveCircle() {
		let {ctx} = this;
		let {x, y, initialX, initialY, radius, velX, velY} = this.options;
		this.options.x = parseInt(this.options.x);
		this.options.y = parseInt(this.options.y);

		this.options.velX *= .98;
		this.options.velY *= .98;

		this.options.x += this.options.velX;
		this.options.y += this.options.velY;

		ctx.beginPath();
		ctx.arc(
			this.options.x,
			this.options.y,
			radius, 
			0, 
			Math.PI*2,
			false
		);
	}	

	drawCircle() {

		let {ctx} = this;
		let {x, y, initialX, initialY, radius, velX, velY} = this.options;

		this.options.x = parseInt(this.options.x);
		this.options.y = parseInt(this.options.y);

		this.options.velX *= .98;
		this.options.velY *= .98;

		this.options.x += this.options.velX;
		this.options.y += this.options.velY;

		ctx.beginPath();
		ctx.arc(
			this.options.x,
			this.options.y,
			radius, 
			0, 
			Math.PI*2,
			false
		);

		// all about coloring below
		ctx.globalCompositeOperation = 'lighter';
		
		if(hasClass(body, "previousScene")) {
			ctx.shadowBlur = 15;
			ctx.shadowColor = '#fff';
			ctx.fillStyle = hsla( 0, 100, 50, 0.075 + Math.cos( this.options.tick * 0.02 ) * 0.05 );
			ctx.fill();
		}

		if(hasClass(body, "defaultScene")) {
			let hue = getRandom(0, 50);
			ctx.shadowBlur = 15;
			ctx.shadowColor = '#fff';
			ctx.fillStyle = hsla( hue, 100, 100, 0.075 + Math.cos( this.options.tick  ) * 0.25 );
			ctx.strokeStyle = 'rgba(255,' + Math.floor(255 - 5) + ',' + Math.floor(255 - 5) + ',' + '0.3', ')';
			ctx.lineWidth = 3;
			ctx.stroke();	
			ctx.fill();
		}

		if(hasClass(body, "nextScene")) {
			let shadow = getFloatRandom(5, 20);

			ctx.shadowBlur = shadow;
			ctx.shadowColor = '#fff';
			ctx.fillStyle = hsla( 30, 100, 50, 0.075 + (this.options.tick * 0.25));
			ctx.fill();
		}

		ctx.closePath();
	}
}