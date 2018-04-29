import * as Leap from "leapjs";
import * as LeapPlugin from "leapjs-plugins";
import { getRandom, ParseToNum, checkIfExists } from "../utils";
import Circle from "./Circle";
import Canvas from "./Canvas";

const FINGER_RADIUS = 5;
const MAX_NUM_CIRCLES = 60;

let canvasWidth, canvasHeight;

export default class LeapMotionDetect {
   constructor() {
      this.backgroundCanvas = document.getElementById("bg-canvas");
      this.bokehCanvas = document.getElementById("bokeh-canvas");

      const backgroundContext = this.backgroundCanvas.getContext("2d");
      this.bokehContext = this.bokehCanvas.getContext("2d");

      this.totalCircles = [];

      this.onResize = this.onResize.bind(this);
      this.changeBackground = this.changeBackground.bind(this);
      this.animate = this.animate.bind(this);

      this.currentCanvas = new Canvas(backgroundContext, this.bokehContext);
      this.currentRotation;
      this.leftHandInterval;
   }

   init() {
      Leap.loop({ enableGestures: true }, (frame, leapPosition) => {
         this.bokehCanvas.width = this.bokehCanvas.width;
         this.detectGesture(frame);
         this.displayFinger(frame);
      })
         .use("screenPosition", { scale: 0.25 })
         .connect();

      const controller = new Leap.Controller();

      window.addEventListener("resize", this.onResize);
      this.onResize();
      this.animate();
   }

   onResize() {
      canvasWidth = this.backgroundCanvas.width = this.bokehCanvas.width = window.innerWidth;
      canvasHeight = this.backgroundCanvas.height = this.bokehCanvas.height = window.innerHeight;

      this.currentCanvas.drawBackgroundBubbles(canvasWidth, canvasHeight);
   }

   animate() {
      requestAnimationFrame(this.animate);

      if (this.totalCircles.length > 0) {
         this.totalCircles.forEach(circle => {
            circle.drawCircle(circle.options);
         });
      }
   }

   displayFinger(frame) {
      const circle = {};
      let handRoll;

      frame.hands.forEach(hand => {
         if (hand.type == "left") {
            hand.pointables.forEach((pointable, index) => {
               const fingerCircles =
                  circle[index] || (circle[index] = new Circle(this.bokehContext));
               if (pointable) {
                  fingerCircles.setTransform(pointable.screenPosition());
               }
            });

            handRoll = parseInt(hand.roll());

            this.leftHandInterval = setInterval(this.changeBackground(handRoll), 3000);
         }

         if (hand.type == "right") {
            hand.pointables.forEach((pointable, index) => {
               const fingerCircles =
                  circle[index] || (circle[index] = new Circle(this.bokehContext));

               if (pointable.type == 1) {
                  fingerCircles.setTransform(pointable.screenPosition());

                  const fingerPosition = pointable.screenPosition();

                  if (this.totalCircles) {
                     this.totalCircles.forEach(circle => {
                        let fingerX = fingerPosition[0];
                        let fingerY = fingerPosition[1];

                        let dx = circle.options.x - fingerX;
                        let dy = circle.options.y - fingerY;
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < circle.options.radius + FINGER_RADIUS) {
                           if (circle.options.x - fingerX > 0) {
                              circle.options.x += 10;
                           }
                           if (circle.options.x - fingerX < 0) {
                              circle.options.x -= 10;
                           }
                           if (circle.options.y - fingerY > 0) {
                              circle.options.y += 10;
                           }
                           if (circle.options.y - fingerY < 0) {
                              circle.options.y -= 10;
                           }
                        }

                        circle.moveCircle(circle.options);
                     });
                  }
               }
            });
         }
      });
   }

   changeBackground(rotation) {
      if (this.currentRotation !== rotation) {
         this.currentCanvas.changeBackgroundType(
            rotation,
            this.backgroundCanvas.width,
            this.backgroundCanvas.height
         );

         clearInterval(this.leftHandInterval);

         this.currentRotation = rotation;
      }
   }

   addCircles(isValidPosition, newCircle) {
      if (isValidPosition) {
         let circle = new Circle(this.bokehContext, {
            x: newCircle.x,
            y: newCircle.y,
            initialX: newCircle.x,
            initialY: newCircle.y,
            radius: newCircle.radius,
            velX: getRandom(-8, 8),
            velY: getRandom(-8, 8),
            tick: getRandom(0, 10),
            date: Date.now()
         });

         if (this.totalCircles.length > MAX_NUM_CIRCLES) {
            this.totalCircles.splice(0, 20);
         }

         if (this.totalCircles.length > 0) {
            let isExist = checkIfExists(circle.options.date, this.totalCircles);

            if (isExist) {
               this.totalCircles.push(circle);
            } else {
               return;
            }
         } else {
            this.totalCircles.push(circle);
         }
      }
   }

   detectGesture(frame) {
      let newCircle = {};
      let itsScreenPosition;

      if (frame.valid && frame.gestures.length > 0) {
         frame.gestures.forEach((gesture, index) => {
            if (gesture.type === "circle" && gesture.state == "stop") {
               gesture.pointableIds.forEach(pointableId => {
                  let itsPointable = frame.pointable(pointableId);
                  if (itsPointable.type === 1) {
                     itsScreenPosition = itsPointable.screenPosition();
                     newCircle.x = ParseToNum(itsScreenPosition[0], gesture.radius);
                     newCircle.y = ParseToNum(itsScreenPosition[1], gesture.radius);
                     newCircle.radius = ParseToNum(gesture.radius);
                  }
               });

               this.addCircles(itsScreenPosition, newCircle);
            }
         });
      }
   }
}
