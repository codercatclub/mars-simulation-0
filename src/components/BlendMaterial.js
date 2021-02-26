import AFRAME from "aframe";
const THREE = AFRAME.THREE;

import BlendVert from "../shaders/BlendVert.glsl";
import BlendFrag from "../shaders/BlendFrag.glsl";
import { active } from "promise-inflight";

const doRoutine = function (coroutine) {
  const r = coroutine.next();
  return r.done;
};

export default {
  schema: {
    timeMsec: { default: 1 },
    transitionAmt: { default: 1 },
  },

  init: function () {


    //list of img names
    const imgList = ["assets/textures/img_1.jpg", "assets/textures/img_2.jpg", "assets/textures/img_3.jpg",  "assets/textures/img_4.jpg"]
    const texList = []
    this.meshList = []

    imgList.forEach((img) => {
      const tex = new THREE.TextureLoader().load(img);
      texList.push(tex);
    })

    let planeGeo = new THREE.PlaneGeometry()

    for(let i = 0; i < texList.length-1; i++) {

      let uniforms = {
        "map": {value: texList[i]},
        "map2": {value: texList[i+1]},
        "timeMsec": {value: 0},
        "transitionAmt": {value: 0}
      }

      let blendMaterial = new THREE.ShaderMaterial({
        vertexShader: BlendVert,
        fragmentShader: BlendFrag,
        uniforms: uniforms,
      });

      let mesh = new THREE.Mesh(planeGeo, blendMaterial)
      mesh.visible = false;
      this.meshList.push(mesh)
      this.el.object3D.add(mesh)
    }

    this.meshList[0].visible = true;

    this.curWheel = 0


    document.addEventListener("wheel", (e) => {
      const delta = parseInt(e.deltaY);
      this.curWheel += delta/2000;
      
      this.curWheel = Math.max(Math.min(this.curWheel, this.meshList.length-0.00001), 0.0);

      let activeIdx = Math.floor(this.curWheel);

      this.meshList.forEach((mesh, idx) => {
        if(idx == activeIdx) {
          mesh.visible = true;
          mesh.material.uniforms.transitionAmt.value = this.curWheel - activeIdx;
        } else {
          mesh.visible = false;
        }
      })
      return false;
    });

    //TODO: add event listener for oculus scroll event
  },

  tick: function (time, timeDelta) {
    this.meshList.forEach((mesh) => {
      mesh.material.uniforms.timeMsec.value = time;
    })
  },
};
