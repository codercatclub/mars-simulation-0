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
    const galleryDoor = document.querySelector("#galleryDoor")

    door.addEventListener('object3dset', (event) => {
        let doorMesh = event.target.object3D.getObjectByProperty('type', 'Mesh');
        this.doorWorldPos = new THREE.Vector3();
        doorMesh.getWorldPosition(this.doorWorldPos);
        this.doorWorldPos.y = 0
    });

    galleryDoor.addEventListener('object3dset', (event) => {
        let doorMesh = event.target.object3D.getObjectByProperty('type', 'Mesh');
        this.galleryDoorPos = new THREE.Vector3();
        doorMesh.getWorldPosition(this.galleryDoorPos);
        this.galleryDoorPos.y = 0
    });
  },

  tick: function (time, timeDelta) {
    //check if we are near the door 
    this.camera.getWorldPosition(this.cameraWorldPos);
    this.cameraWorldPos.y = 0


    //distance to the door 
    if(!this.doorWorldPos) return;

    let distToDoor =  this.cameraWorldPos.distanceTo(this.doorWorldPos);

    if(!this.canTransition && distToDoor > 1) {
        this.canTransition = true
    }

    if(!this.canTransition) return;

    if(distToDoor < 0.5) {
        if(this.enteredDoor) {
            this.voidScene.setAttribute("visible", "false")
            this.cityScene.setAttribute("visible", "true")
            this.enteredDoor = false;
            console.log("Sw")
            this.el.sceneEl.object3D.background = new THREE.Color( 0xffffff );
            this.el.sceneEl.object3D.fog.color = new THREE.Color( 0xffffff )
        } else {
            this.voidScene.setAttribute("visible", "true")
            this.cityScene.setAttribute("visible", "false")
            this.enteredDoor = true;
            console.log("Hi")
            this.el.sceneEl.object3D.background = new THREE.Color( 0x000000 );
            this.el.sceneEl.object3D.fog.color = new THREE.Color( 0x000000 ); 
        }
        this.canTransition = false;
    }
  },
};


