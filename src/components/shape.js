import * as THREE from 'three';
import * as Leap from 'leapjs';

let baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );

let scene,
    camera,
    renderer,
    // LeapControls,
    // CameraControls,
    controller;

let armMeshes = [],
    boneMeshes = [];

let planeGeometry,
    newPlane;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.x = -30;
  camera.position.y = 100;
  camera.position.z = 500;
  camera.lookAt(scene.position);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xEEEEEE, 1.0);
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  helpers();
  lights();
  drawNewPlane();

  // All Leap Motion related functions
  Leap.loop( {background: true}, leapAnimate ).connect();

  controller = new Leap.Controller();
  
  var geometry = new THREE.BoxGeometry( 300, 20, 300 );
  var material = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( 0, -10, 0 );
  scene.add( mesh );

  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onResize, false);
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
  mesh.position.fromArray( bone.center() );
  mesh.setRotationFromMatrix( ( new THREE.Matrix4 ).fromArray( bone.matrix() ) );
  // Without this, hand is a bunch of square
  mesh.quaternion.multiply( baseBoneRotation );
  mesh.scale.set( bone.width, bone.width, bone.length );
  scene.add( mesh );
}

function leapAnimate( frame ) {
  var countBones = 0;
  var countArms = 0;

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
    var arm = hand.arm;
    var armMesh = armMeshes [ countArms++ ] || addMesh( armMeshes );
    updateMesh( arm, armMesh );
    armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
  }
  renderer.render( scene, camera );
}

function drawNewPlane() {
  newPlane = new Plane();
  scene.add(newPlane.plane);
}

class Plane {
  constructor(){
    this.planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    this.drawPlane(); 
  }
  
  drawPlane() {
    planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    this.plane = new THREE.Mesh(planeGeometry, this.planeMaterial);
    this.plane.rotation.x = -0.5 * Math.PI;
    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 0;
  }
}

// const controls = new function() {
//   this.rotationSpeed = 0.02;

//   this.addCube = function () {
//     const cubeSize = Math.ceil((Math.random() * 3));
//     const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
//     const cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});

//     const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//     cube.castShadow = true;
//     cube.name = "cube-" + (scene.children.length - 3);
//     cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
//     cube.position.y = Math.round(Math.random() * 5);
//     cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);
    
//     scene.add(cube);
//     this.numberOfObjects = scene.children.length;
//     console.log('meow', this.numberOfObjects, ' this.numberOfObjects');
//     console.log(cube, ' cube');
//   }
  
//   this.removeCube = function() {
//     const allChildren = scene.children;
//     console.log(allChildren, ' allChildren');
//     const lastCube = allChildren[allChildren.length-1];
//     if(lastCube instanceof THREE.Mesh && lastCube != newPlane.plane) {
//       scene.remove(lastCube);
//       this.numberOfObjects = scene.children.length;
//     }
//   }
  
//   this.outputObjects = function() {
//     console.log(scene.children);
//   }
  
//   this.getAnObject = function() {
//     scene.getObjectByName('cube-3').scale.x = 5;
//   }
// }

function render() {
  scene.traverse(function (e) {
    if (e instanceof THREE.Mesh && e != newPlane.plane) {
      // if it's THREE.Mesh and is not plane, rotate them
      // e.rotation.x += controls.rotationSpeed;
      // e.rotation.y += controls.rotationSpeed;
      // e.rotation.z += controls.rotationSpeed;
    }
  });
  
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// const gui = new dat.GUI();
// gui.add(controls, 'addCube');
// gui.add(controls, 'removeCube');
// gui.add(controls, 'rotationSpeed', 0, 0.5);
// gui.add(controls, 'outputObjects');
// gui.add(controls, 'getAnObject');

init();
render();