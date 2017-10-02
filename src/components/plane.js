import * as THREE from 'three';

class Plane {
   constructor(width, height){
      this.planeGeometry;
      this.planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
      this.drawPlane(width, height); 
   }

   drawPlane(width, height) {
      this.planeGeometry = new THREE.PlaneGeometry(width, height,1,1);

      console.log(this.planeGeometry.parameters.width, ' this.planeGeometry.parameters.width');
      console.log(this.planeGeometry.parameters.height, ' this.planeGeometry.parameters.height');

      this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.x = 0;
      this.plane.position.y = 0;
      this.plane.position.z = 0;
   }
}

export default Plane;