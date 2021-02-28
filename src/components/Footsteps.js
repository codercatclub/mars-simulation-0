import AFRAME from 'aframe';
const THREE = AFRAME.THREE;


const UP = new THREE.Vector3(0,1,0)
const WALK_THRESH = 0.7
const WALK_WIDTH = 0.25
export default {
  schema: {
    src: { type: "asset" },
    color: { type:"string" }
  },

  init: function () {
    this.mainCamera = document.querySelector('#camera').object3D;
    this.lastStepPos = new THREE.Vector3();
    this.curCamPos = new THREE.Vector3();
    this.footDir = new THREE.Vector3();


    let objLoader = new THREE.OBJLoader();

    objLoader.load(this.data.src, (mesh) => {
      this.footstepPool = []

      let footMesh = mesh;

      mesh.children[0].rotateY(Math.PI/2);
      mesh.children[0].material = new THREE.MeshBasicMaterial({color:new THREE.Color(this.data.color)});

      // let footGeo = new THREE.BoxGeometry(0.5,0.1,0.5);
      for(let i = 0; i < 21; i++) {
        // let mesh = new THREE.Mesh(footGeo, new THREE.MeshBasicMaterial({color:new THREE.Color("#000000")}));
        let mesh = footMesh.clone();
        mesh.position.z = -100;
        mesh.scale.multiplyScalar(2)
        this.el.object3D.add(mesh)
        this.footstepPool.push(mesh)
      }
  
      this.footIdx = 0;
      this.leftFootMult = 1;
  
      // MANUALLY POSITION A FEW 
      for(let i = 2; i < 7; i++) {
        this.curCamPos.z = i;
        this.incrementStep(this.curCamPos);
      }

    }, console.log, console.log);
  },

  incrementStep: function(newPos) {
    let curFoot = this.footstepPool[this.footIdx];    
    curFoot.position.copy(newPos);
    this.mainCamera.getWorldDirection(this.footDir)
    this.footDir.y = 0;

    //side step
    let leftDir = new THREE.Vector3().crossVectors(this.footDir, UP)
    leftDir.normalize().multiplyScalar(this.leftFootMult * WALK_WIDTH)
    curFoot.position.add(leftDir);
    curFoot.scale.x = -this.leftFootMult * 2;
    
    this.lastStepPos.copy(newPos);
    
    let mx = new THREE.Matrix4().lookAt(curFoot.position, this.footDir.multiplyScalar(-1).add(curFoot.position), UP)
    curFoot.quaternion.setFromRotationMatrix(mx);
    
    
    this.leftFootMult *= -1
    this.footIdx++;
    if(this.footIdx >= this.footstepPool.length) {
      this.footIdx = 0;
    }
  },

  tick: function (time, timeDelta) {

    if(!this.footstepPool) return;
    if(!this.el.object3D.parent.visible) return;
    // Do something on every scene tick or frame.
    this.mainCamera.getWorldPosition(this.curCamPos)
    
    this.curCamPos.y = 0;
    let dist = this.curCamPos.distanceTo(this.lastStepPos)
    if(dist > WALK_THRESH) {
      this.incrementStep(this.curCamPos);
    }
    //if camera has moved sufficiently, move a step behind 
  },
}
