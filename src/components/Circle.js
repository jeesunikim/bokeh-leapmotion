import { ParseToNum, getRandom, getFloatRandom, hsla, hasClass } from '../utils';

const body = document.body;

export default class Circle {
	constructor(canvas, context, options) {
		this.canvas = canvas;
		this.ctx = context;
		this.options = options;
		
		let signHelper = Math.floor(Math.random() * 2);

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
		ctx.arc(position[0], position[1], 5, 0, Math.PI*2);
		ctx.fillStyle = hsla( 0, 0, 100, 0.075 + .25 + Math.random() * .5 );
		ctx.fill();
		ctx.closePath();
	}

	drawCircle() {

		let {ctx} = this;
		let {x,y,initialX,initialY,radius,vel,angle,id} = this.options;

		this.options.x = parseInt(this.options.x);
		this.options.y = parseInt(this.options.y);

		this.options.x += Math.cos( this.options.angle ) * this.options.vel;
		this.options.y += Math.sin( this.options.angle ) * this.options.vel;

		this.options.angle += getRandom( -0.05, 0.05 );

		ctx.beginPath();
		ctx.arc(
			this.options.x,
			this.options.y,
			radius, 
			0, 
			Math.PI*2,
			false
		);

		ctx.globalCompositeOperation = 'source-over';
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
			let hue = getFloatRandom(0, 50);
			ctx.shadowBlur = 15;
			ctx.shadowColor = '#fff';
			ctx.fillStyle = hsla( 30, 100, 50, 0.075 + Math.cos( this.options.tick) * 0.5 );
			ctx.fill();
		}

		
	}
}