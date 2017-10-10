import * as Leap from 'leapjs';
import * as LeapPlugin from 'leapjs-plugins';
import { getRandom, ParseToNum, checkIfExists } from '../utils';
import Circle from './Circle';

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
   for (let i = 0; i < circles.length; i++) {

      // let centerX = circles[i].options.x;
      // let centerY = circles[i].options.y;
      // let radius = circles[i].options.radius;

      drawCircleOnGesture(circles[i])
      .then(() => {
         // setTimeout(() => {
         //    circles[i].update(circles[i]);
         // }, 5000)
      })
   }

   requestAnimationFrame(animate);
}

function update() {

}

function drawCircleOnGesture(circle) {
  return new Promise((resolve, reject) => {
      circle.drawCircle(circle.options);
      resolve();
  })
}

function addCircles(isValidPosition, newCircle) {
   if(isValidPosition) {
      console.log(circles, ' circles');

      let circle = new Circle({
         x: newCircle.x,
         y: newCircle.y,
         radius: newCircle.radius,
         speed: .2 + Math.random() * 3,
         id: newCircle.id
      });

      if(circles.length > 0){
         let isExist = checkIfExists(circle.options.id, circles);
         console.log(isExist, ' isExist')   
         if(!isExist) {
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
   frame.pointables.forEach((pointable, index) => {
      const circles = ( circle[index] || (circle[index] = new Circle()));
      if(pointable.type == 1) {
         circles.setTransform(pointable.screenPosition());
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
// var touching = finger.touchZone == 'touching';

            gesture.pointableIds.forEach(function(pointableId){
                  let itsPointable = frame.pointable(pointableId);
                  if(itsPointable.type === 1) {
                     
                     itsScreenPosition = itsPointable.screenPosition();

                     newCircle.x = ParseToNum(itsScreenPosition[0], gesture.radius);
                     newCircle.y = ParseToNum(itsScreenPosition[1],gesture.radius);
                     newCircle.radius = ParseToNum(gesture.radius);
                     newCircle.id = gesture.pointableIds[0];
                  }
            });

            addCircles(itsScreenPosition, newCircle);
         }
      });
   }
}

function concatData(id, data) {
   return id + ": " + data + "<br>";
}

init();
animate();
update();