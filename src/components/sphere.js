import * as THREE from 'three';

class Sphere {
   constructor(radius, width, height, positionX, positionY){
      this.sphereGeometry;
      this.sphereMaterial = new THREE.MeshPhongMaterial({color: 0xBD9779, flatShading: THREE.FlatShading});
      this.drawSphere(radius, width, height, positionX, positionY); 
   }

   drawSphere(radius, width, height, positionX, positionY) {
      this.sphereGeometry = new THREE.SphereGeometry(radius, width, height);

      this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
      this.sphere.castShadow = true;
      this.sphere.position.x = positionX;
      this.sphere.position.y = positionY;
      this.sphere.position.z = -30;

      console.log(this.sphere, ' this.sphere')
      
   }
}

export default Sphere;