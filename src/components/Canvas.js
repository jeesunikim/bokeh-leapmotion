import { getRandom, hsla, hasClass, addClass } from "../utils";

const body = document.body;

export default class Canvas {
	constructor(backgroundContext) {
		this.backgroundContext = backgroundContext;
		this.backgroundEl = document.getElementById("bg-canvas");
		this.backgroundBubbles = [];

		this.drawBackgroundBubbles = this.drawBackgroundBubbles.bind(this);
		this.changeToScene = this.changeToScene.bind(this);
	}

	changeBackgroundType(rotation, canvasWidth, canvasHeight) {
		if (rotation === 0) {
			this.changeToScene("sunset");
		} else if (rotation > 0) {
			this.changeToScene("black-white");
		} else {
			this.changeToScene("blue-pink-bg");
		}
		this.drawBackgroundBubbles(canvasWidth, canvasHeight);
	}

	changeToScene(scene) {
		this.backgroundEl.className = "";
		addClass(this.backgroundEl, scene);
	}

	drawBackgroundBubbles(canvasWidth, canvasHeight) {
		this.backgroundContext.clearRect(0, 0, canvasWidth, canvasHeight);

		let hue,
			bubbleCount,
			minHue,
			maxHue,
			minSaturation,
			maxSaturation,
			minLightness,
			maxLightness,
			minBlur,
			maxBlur,
			compositeOperationType;

		const sizeBase = canvasWidth + canvasHeight,
			twopi = Math.PI * 2;

		if (hasClass(this.backgroundEl, "black-white")) {
			hue = 0;
			bubbleCount = Math.floor(sizeBase * 0.05);
			minSaturation = 0;
			maxSaturation = 5;
			minLightness = 90;
			maxLightness = 100;
			minBlur = 5;
			maxBlur = 10;
			compositeOperationType = "hue";
		} else if (hasClass(this.backgroundEl, "sunset")) {
			hue = getRandom(40, 60);
			minHue = 40;
			maxHue = 60;
			bubbleCount = Math.floor(sizeBase * 0.07);
			minSaturation = 45;
			maxBlur = 12;
			compositeOperationType = "lighter";
		} else {
			hue = 220;
			bubbleCount = Math.floor(sizeBase * 0.3);
			minSaturation = 10;
			compositeOperationType = "screen";
		}

		const bubbleOptions = {
			radiusMin: 1,
			radiusMax: sizeBase * 0.04,
			blurMin: minBlur ? minBlur : 10,
			blurMax: maxBlur ? maxBlur : sizeBase * 0.04,
			hueMin: minHue ? minHue : hue,
			hueMax: maxHue ? maxHue : hue + 100,
			saturationMin: minSaturation ? minSaturation : 10,
			saturationMax: maxSaturation ? maxSaturation : 70,
			lightnessMin: minLightness ? minLightness : 20,
			lightnessMax: maxLightness ? maxLightness : 50,
			alphaMin: 0.1,
			alphaMax: 0.5
		};

		this.backgroundContext.globalCompositeOperation = compositeOperationType;

		while (bubbleCount--) {
			let radius = getRandom(bubbleOptions.radiusMin, bubbleOptions.radiusMax),
				blur = getRandom(bubbleOptions.blurMin, bubbleOptions.blurMax),
				x = getRandom(0, canvasWidth),
				y = getRandom(0, canvasHeight),
				hue = getRandom(bubbleOptions.hueMin, bubbleOptions.hueMax),
				saturation = getRandom(bubbleOptions.saturationMin, bubbleOptions.saturationMax),
				lightness = getRandom(bubbleOptions.lightnessMin, bubbleOptions.lightnessMax),
				alpha = getRandom(bubbleOptions.alphaMin, bubbleOptions.alphaMax);

			this.backgroundContext.shadowColor = hsla(hue, saturation, lightness, 1);
			this.backgroundContext.shadowBlur = blur;
			this.backgroundContext.beginPath();
			this.backgroundContext.arc(x, y, radius, 0, twopi);
			this.backgroundContext.closePath();
			this.backgroundContext.fill();
		}
	}
}
