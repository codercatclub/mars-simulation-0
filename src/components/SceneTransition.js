const THREE = AFRAME.THREE;

export default {
  schema: {},

  init: function () {
    let camera = document.querySelector("#camera");
    this.camera = camera.object3D;
    this.cameraWorldPos = new THREE.Vector3();

    this.cameraRigEl = document.querySelector("#camera-rig");


    this.cityScene = document.querySelector("#city-scene");
    this.voidScene = document.querySelector("#void-scene");


    const door = document.querySelector("#vectorFieldDoor")

    door.addEventListener('object3dset', (event) => {
        let doorMesh = event.target.object3D.getObjectByProperty('type', 'Mesh');
        this.doorWorldPos = new THREE.Vector3();
        doorMesh.getWorldPosition(this.doorWorldPos);
        this.doorWorldPos.y = 0
    });
  },

  tick: function (time, timeDelta) {
    //check if we are near the door 
    if(this.doorWorldPos && !this.enteredDoor) {
        this.camera.getWorldPosition(this.cameraWorldPos);
        this.cameraWorldPos.y = 0
        const dist = this.cameraWorldPos.distanceTo(this.doorWorldPos)
        if(dist < 0.5 && (this.cameraWorldPos.z < this.doorWorldPos.z)) {
            this.enteredDoor = true;
            this.voidScene.setAttribute("visible", "true")
            this.cityScene.setAttribute("visible", "false")
            this.cameraRigEl.components["mover"].TeleportToZero();
            this.el.sceneEl.object3D.background = new THREE.Color( 0x000000 );
            this.el.sceneEl.object3D.fog.color = new THREE.Color( 0x000000 );
        }
    }
  },
};


