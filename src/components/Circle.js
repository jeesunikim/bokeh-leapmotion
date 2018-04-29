import { getRandom, getFloatRandom, hsla, hasClass } from "../utils";

const TWO_PI = Math.PI * 2;

export default class Circle {
	constructor(bokehContext, options) {
		this.ctx = bokehContext;
		this.options = options;

		this.backgroundEl = document.getElementById("bg-canvas");
	}

	setTransform(position) {
		const { ctx } = this;

		ctx.beginPath();
		ctx.arc(position[0], position[1], 5, 0, TWO_PI);
		ctx.shadowBlur = 15;
		ctx.shadowColor = "#fff";
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = hsla(0, 0, 100, 1);
		ctx.fill();
		ctx.closePath();
	}

	moveCircle() {
		const { ctx } = this;

		this.options.x = parseInt(this.options.x);
		this.options.y = parseInt(this.options.y);
		this.options.velX *= 0.98;
		this.options.velY *= 0.98;
		this.options.x += this.options.velX;
		this.options.y += this.options.velY;

		ctx.beginPath();
		ctx.arc(this.options.x, this.options.y, this.options.radius, 0, TWO_PI, false);
	}

	drawCircle(options) {
		const { ctx } = this;

		this.options.x = parseInt(this.options.x);
		this.options.y = parseInt(this.options.y);
		this.options.velX *= 0.98;
		this.options.velY *= 0.98;
		this.options.x += this.options.velX;
		this.options.y += this.options.velY;

		ctx.beginPath();
		ctx.arc(this.options.x, this.options.y, this.options.radius, 0, TWO_PI, false);
		ctx.globalCompositeOperation = "lighter";

		// Circles' Color Updates
		if (hasClass(this.backgroundEl, "black-white")) {
			let hue = getRandom(0, 50);
			ctx.shadowBlur = 15;
			ctx.shadowColor = "#fff";
			ctx.fillStyle = hsla(hue, 100, 100, 0.075 + Math.cos(this.options.tick) * 0.5);
			ctx.strokeStyle = "rgba(255," + Math.floor(255 - 5) + "," + Math.floor(255 - 5) + "," + "0.3)";
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.fill();
		} else if (hasClass(this.backgroundEl, "sunset")) {
			let shadow = getFloatRandom(25, 30);
			ctx.shadowBlur = shadow;
			ctx.shadowColor = "#fff";
			ctx.fillStyle = hsla(30, 100, 50, 0.075 + this.options.tick * 0.25);
			ctx.fill();
		} else {
			ctx.fillStyle = hsla(280, 100, 50, 0.075 + this.options.tick * 0.008);
			ctx.fill();
		}

		ctx.closePath();
	}
}
