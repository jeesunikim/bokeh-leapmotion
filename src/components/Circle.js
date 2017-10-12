import { ParseToNum, getRandom, getFloatRandom, hsla, hasClass } from '../utils';

const body = document.body;
 export default class Circle {
	constructor(canvas, context, options) {
		this.canvas = canvas;
		this.ctx = context;
		this.options = options;
		this.drawCircle = this.drawCircle.bind(this);
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

	drawCircle() {

		let {ctx} = this;
		let {x, y, initialX, initialY, radius, velX, velY, angle} = this.options;
		// console.log(velX, ' velX');

		this.options.x = parseInt(this.options.x);
		this.options.y = parseInt(this.options.y);

		// all about reversing the coordinate if it hits the edges of canvas
		if(this.options.x + this.options.radius > this.canvas.width || this.options.x - this.options.radius < 0){
			console.log("X and Radius are > Canvas' left side of width", this.options.velX);
			// this.options.velX *= -1;
		}

		if(this.options.y - this.options.radius < 0 || this.options.y + this.options.radius > this.canvas.height){
			console.log("X and Radius are > Canvas' width", this.options.velY);
			// this.options.velY *= -1;
		}

		// this.options.x += Math.cos( this.options.angle ) * this.options.velX * .08;
		// this.options.y += Math.sin( this.options.angle ) * this.options.velY * .08;
		// console.log(this.options.velX, ' this.options.velX');
		// console.log(this.options.velY, ' this.options.velY');

		this.options.velX *= .98;
		this.options.velY *= .98;

		// let angleX = Math.cos( this.options.angle );
		// let angleY = Math.sin( this.options.angle );

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