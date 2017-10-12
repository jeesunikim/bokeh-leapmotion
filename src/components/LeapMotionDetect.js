import * as Leap from 'leapjs';
import * as LeapPlugin from 'leapjs-plugins';
import { getRandom, ParseToNum, checkIfExists, concatData } from '../utils';
import Circle from './Circle';
import Canvas from './Canvas';

const 
   circle = {},
   circles = [];

let 
   canvas,
   context;

let 
   controller,
   screenPosition;

function init() {
   canvas = document.getElementById('bokeh-canvas'),  
   context = canvas.getContext("2d");

   context.canvas.width = window.innerWidth;
   context.canvas.height = window.innerHeight;
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);

   window.addEventListener('resize', onResize, false);

   initLeap();
}

function onResize(){
   
}

function initLeap() {
   Leap.loop( {enableGestures: true}, function (frame, leapPosition) {
      canvas.width = canvas.width
      detectGesture(frame);
      displayFinger(frame);
   }).use('screenPosition', {scale: 0.25}).connect();

   controller = new Leap.Controller();
}

function animate() {
   // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
   circles.forEach((circle) => {
      circle.drawCircle(circle.options);
   })
   
   requestAnimationFrame(animate);
}

function addCircles(isValidPosition, newCircle) {
   if(isValidPosition) {
      console.log(circles, ' circles');

      let circle = new Circle(canvas, context, {
         x: newCircle.x,
         y: newCircle.y,
         initialX: newCircle.x,
         initialY: newCircle.y,
         radius: newCircle.radius,
         angle: getRandom( 0, Math.PI * 2 ),
         velX: getRandom(-8, 8),
         velY: getRandom(-8, 8),
         tick: getRandom( 0, 10 ),
         date: Date.now()
      });

      if(circles.length > 50) {
         circles.splice(0, 20);
      }

      if(circles.length > 0){
         console.log(circle.options, ' circle.options')
         let isExist = checkIfExists(circle.options.date, circles);
         if(isExist) {
            circles.push(circle);
         }else{
            return;
         }
      } else {
         circles.push(circle);
      }
   }
}

function displayFinger(frame) {
   frame.hands.forEach((hand) => {
      if(hand.type == "left") {
         hand.pointables.forEach((pointable, index) => {
            const circles = ( circle[index] || (circle[index] = new Circle(canvas, context)));
             if(pointable) {
               circles.setTransform(pointable.screenPosition());
            }
         });
         const MinorityReport = new Canvas(canvas, context);
         MinorityReport.rotateToChange(hand.roll());
      }
      if(hand.type == "right") {
         hand.pointables.forEach((pointable, index) => {
            const circles = ( circle[index] || (circle[index] = new Circle(canvas, context)));
             if(pointable.type == 1) {
               circles.setTransform(pointable.screenPosition());
            }
         });
      }
   });
}

function detectGesture(frame) {

   let 
      newCircle = {},
      itsScreenPosition;

   if(frame.valid && frame.gestures.length > 0){
      
      frame.gestures.forEach((gesture, index) => {
         if(gesture.type === "circle" && gesture.state == "stop") {
            gesture.pointableIds.forEach(function(pointableId){
                  let itsPointable = frame.pointable(pointableId);
                  if(itsPointable.type === 1) {
                     
                     itsScreenPosition = itsPointable.screenPosition();

                     newCircle.x = ParseToNum(itsScreenPosition[0], gesture.radius);
                     newCircle.y = ParseToNum(itsScreenPosition[1],gesture.radius);
                     newCircle.radius = ParseToNum(gesture.radius);
                     console.log(gesture.pointableIds, ' gesture.pointableIds')
                     newCircle.id = gesture.pointableIds[0];
                  }
            });

            addCircles(itsScreenPosition, newCircle);
         }
      });
   }
}

init();
animate();