import * as THREE from 'three';
import * as Leap from 'leapjs';
import Plane from './plane';
import Sphere from './sphere';

let 
   scene,
   camera,
   renderer,
   controller;

let 
   armMeshes = [],
   boneMeshes = [];

let 
   planet,
   planeGeometry,
   newPlane,
   newSphere;

function init() {
   scene = new THREE.Scene();
   // scene.background = new THREE.Color( 0x000000 );

   camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

   // camera.position.x = -30;
   camera.position.y = 200;
   camera.position.z = 400;
   camera.lookAt(scene.position);

   renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
   });

   renderer.shadowMap.enabled = true;
   renderer.setSize(window.innerWidth, window.innerHeight);

   planet = new THREE.Object3D();
   scene.add(planet);
   planet.position.y = -400;

   var geom = new THREE.IcosahedronGeometry(15, 2);
   var mat = new THREE.MeshPhongMaterial({
      color: 0xBD9779,
      shading: THREE.FlatShading
   });

  var mesh = new THREE.Mesh(geom, mat);
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 18;
  planet.add(mesh);

  var ambientLight = new THREE.AmbientLight(0xBD9779);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 0, 0).normalize();
  scene.add(directionalLight);

   helpers();
   lights();
   // drawNewPlane(600, 400);
   // drawNewSphere(100, 80 ,80, 30, 50);
   initLeap();

   // var geometry = new THREE.BoxGeometry( 300, 20, 300 );
   // var material = new THREE.MeshNormalMaterial();
   // var mesh = new THREE.Mesh( geometry, material );
   // mesh.position.set( 0, -10, 0 );
   // scene.add( mesh );

   renderer.render(scene, camera);
   document.getElementById("leap-canvas").appendChild(renderer.domElement);
   window.addEventListener('resize', onResize, false);
}

function initLeap() {
   Leap.loop( {enableGestures: true}, function (frame, leapPosition) {
      leapToScene(frame);
      leapAnimate(frame);
   }).connect(); 
   controller = new Leap.Controller();
}

function animate() {
   requestAnimationFrame(animate);

   planet.rotation.z += .001;
   planet.rotation.y = 0;
   planet.rotation.x = 0;
   renderer.clear();

   renderer.render(scene, camera);

}

function onResize(){
   camera.aspect = window.innerWidth/window.innerHeight;
   camera.updateProjectionMatrix();

   renderer.setSize(window.innerWidth, window.innerHeight);
}

function helpers() {
   const axes = new THREE.AxisHelper(20);
   const gridHelper = new THREE.GridHelper(150, 10);
   const axisHelper = new THREE.AxisHelper(150);
   scene.add(axes);
   scene.add(gridHelper);
   scene.add(axisHelper);
}

function lights() {
   const ambientLight = new THREE.AmbientLight(0x0c0c0c);
   const spotLight = new THREE.SpotLight(0xffffff);
   spotLight.position.set(-40, 60, -10);
   spotLight.castShadow = true;
   scene.add(ambientLight);
   scene.add(spotLight);  
}

function addMesh( meshes ) {
   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
   var material = new THREE.MeshNormalMaterial();
   var mesh = new THREE.Mesh( geometry, material );
   meshes.push( mesh );
   return mesh;
}

function updateMesh( bone, mesh ) {
   const baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );
   mesh.position.fromArray( bone.center() );

   // Without this, hand is a bunch of square
   mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
   mesh.quaternion.multiply( baseBoneRotation );
   mesh.scale.set( bone.width, bone.width, bone.length );
   scene.add( mesh );
}

function leapToScene(frame) {
   let 
      coordinateString = "",
      canvasElement = document.getElementById("leap-canvas").getElementsByTagName("canvas")[0];

   let 
      x,
      y,
      z;

   if(frame.pointables.length > 0) {
      canvasElement.width = canvasElement.width; //clear
      
      // Get a pointable and normalize the tip position
      // https://community.leapmotion.com/t/translate-leap-coordinates-to-use-for-threejs/607/7
      var pointable = frame.pointables[0];
      var iBox = frame.interactionBox;
      var normalizedPosition = iBox.normalizePoint(pointable.tipPosition, true);

      x = normalizedPosition[0]/iBox.size[0];
      y = normalizedPosition[1]/iBox.size[1];
      z = normalizedPosition[2]/iBox.size[2];

      var canvasX = canvasElement.width * normalizedPosition[0];
      var canvasY = canvasElement.height * (1 - normalizedPosition[1]);
      
      coordinateString = concatData("normalizedPosition", normalizedPosition);
      // coordinateString += "<br/>";
      // coordinateString += concatData("normalizedPosition[1]/iBox.size[1]", y);
      // coordinateString += "<br/>";
      // coordinateString += concatData("normalizedPosition[2]/iBox.size[2]", z);
      // coordinateString += "<br/>";
      coordinateString += concatData("iBox", iBox);
      coordinateString += concatData("iBox.depth", iBox.depth);
      coordinateString += concatData("iBox.size", iBox.size[0]);

      // iBox: InteractionBox [ width:235.247 | height:235.247 | depth:147.751 ]

      output.innerHTML = coordinateString;
    }
}

function leapAnimate(frame) {

   let 
      frameString ="",
      handString = "",
      fingerString = "",
      gestureString = "";

   let 
      hands = frame.hands.length;

   let
      circleRadius;

   if(frame.pointables.length > 0)
   {
        var pointable = frame.pointables;

        frameString = concatData("pointable", pointable);
   }

   for (var i = 0; i < hands; i++) {
      let hand = frame.hands[i]

      handString += concatData("hand.type", hand.type);
      handString += "<br/>"

      if(hand.type == "right"){
         for(var f = 0; f < frame.fingers.length; f++){
            var finger = frame.fingers[f];
            // fingerString += concatData("finger ", finger);
         }
      }

      frameString += handString;
      frameString += fingerString;
   }


   for(var g = 0; g < frame.gestures.length; g++){
      if(frame.valid && frame.gestures.length > 0){
         let executed = false;
         if(frame.pointables.length > 0) {
            frame.gestures.forEach(function(gesture){
               var gestureState = gesture.state;
               console.log(gestureState, ' gestureState');
               
               if(gesture.type === "circle" && gestureState == "stop") {

                  var pointable = frame.pointables[0];
                  var stabilizedPosition = pointable.stabilizedTipPosition;

                  console.log(stabilizedPosition, ' stabilizedPosition');
                  
                  circleRadius= gesture.radius;
                  if(circleRadius && !executed) {
                     executed = true;
                     console.log('circle is there');
                     drawNewSphere(circleRadius, 32 ,32, frame.pointables[0].carpPosition[0], frame.pointables[0].carpPosition[1]);
                     // console.log(circleRadius, ' circleRadius')
                  }
               }
            });
         }
      }
   };

   // output.innerHTML = frameString;

   let countBones = 0, countArms = 0;

   armMeshes.forEach( function( item ) { scene.remove( item ) } );
   boneMeshes.forEach( function( item ) { scene.remove( item ) } );

   for ( var hand of frame.hands ) {
      for ( var finger of hand.fingers ) {
         for ( var bone of finger.bones ) {
            if ( countBones++ === 0 ) { continue; }
            var boneMesh = boneMeshes [ countBones ] || addMesh( boneMeshes );
            updateMesh( bone, boneMesh );
         }
      }
      let 
         arm = hand.arm,
         armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
      
      updateMesh( arm, armMesh );
      armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
   }
   renderer.render( scene, camera );
}

function drawNewPlane(width, height) {
   newPlane = new Plane(width, height);
   scene.add(newPlane.plane);
}

function drawNewSphere(radius, width, height, positionX, positionY) {
   newSphere = new Sphere(radius, width, height, positionX, positionY);
   scene.add(newSphere.sphere);
   console.log(scene.length, ' scene.length');
}

function concatData(id, data) {
   return id + ": " + data + "<br>";
}

init();
animate();