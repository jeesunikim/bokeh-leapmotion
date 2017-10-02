import * as THREE from 'three';

class Sphere {
   constructor(radius, width, height){
      this.sphereGeometry;
      this.sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      this.drawSphere(radius, width, height); 
   }

   drawSphere(radius, width, height) {
      this.sphereGeometry = new THREE.SphereGeometry(radius, width, height);

      this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
      this.sphere.castShadow = true;
      this.sphere.position.x = 100;
      this.sphere.position.y = 100;
      this.sphere.position.z = 0;
      // this.plane.rotation.x = -0.5 * Math.PI;
      // this.plane.position.x = 0;
      // this.plane.position.y = 0;
      // this.plane.position.z = 0;
   }
}

export default Sphere;