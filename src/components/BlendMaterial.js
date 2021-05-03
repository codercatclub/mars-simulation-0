import AFRAME from "aframe";
const THREE = AFRAME.THREE;

import BlendVert from "../shaders/BlendVert.glsl";
import BlendFrag from "../shaders/BlendFrag.glsl";

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
    // list of img names
    let imgList = [];
    let path = "assets/textures/img_";
    for (let i = 1; i <= 21; i++) {
      let iPath = path + parseInt(i) + ".jpg";
      imgList.push(iPath);
    }

    const texList = [];
    this.meshList = [];

    imgList.forEach((img, idx) => {
      const tex = new THREE.TextureLoader().load(img, (fTex) => {
        if (idx < this.meshList.length) {
          this.meshList[idx].shader.uniforms.map1.value = fTex;
        }
        if (idx - 1 >= 0) {
          this.meshList[idx - 1].shader.uniforms.map2.value = fTex;
        }
      });
      texList.push(tex);
    });

    let planeGeo = new THREE.PlaneGeometry();

    for (let i = 0; i < texList.length - 1; i++) {
      const blendMaterial = new THREE.MeshBasicMaterial();

      const mesh = new THREE.Mesh(planeGeo, blendMaterial);
      this.meshList.push(mesh);

      blendMaterial.onBeforeCompile = (shader) => {
        const uniforms = {
          map1: { value: texList[i] },
          map2: { value: texList[i + 1] },
          timeMsec: { value: 0 },
          transitionAmt: { value: 0 },
        };
        shader.uniforms = THREE.UniformsUtils.merge([
          uniforms,
          shader.uniforms,
        ]);
        shader.vertexShader = BlendVert;
        shader.fragmentShader = BlendFrag;
        mesh.shader = shader;
        if (i !== 0) {
          mesh.visible = false;
        }
      };

      this.el.object3D.add(mesh);
    }

    this.curWheel = 0;

    document.addEventListener("wheel", (e) => {
      const delta = parseInt(e.deltaY);
      this.handleScroll(delta / 2000);
      return false;
    });

    //VR SUPPORT
    const controller = document.querySelector("#leftHandController");
    controller.addEventListener("axismove", (evt) => {
      const axisY = evt.detail.axis[3];
      if (axisY > 0.9) {
        this.handleScroll(this.timeDeltaSec);
      } else {
        this.handleScroll(-this.timeDeltaSec);
      }
    });

    //MOBILE SUPPORT
    const sideArrows = document.querySelector("#photo-frame");
    this.el.sceneEl.addEventListener('loaded', () => {
      this.sideArrowComponent = sideArrows.components['side-arrows'];
    });
  },

  handleScroll: function (scrollDelta) {
    this.curWheel += scrollDelta;

    this.curWheel = Math.max(
      Math.min(this.curWheel, this.meshList.length - 0.00001),
      0.0
    );

    let activeIdx = Math.floor(this.curWheel);
    
    if (this.curWheel - activeIdx < 0.15 && Math.abs(scrollDelta) < 0.005) {
      this.curWheel = 0.2 * activeIdx + 0.8 * this.curWheel;
    }

    if (this.curWheel - activeIdx > 0.85 && Math.abs(scrollDelta) < 0.005) {
      this.curWheel = 0.2 * (activeIdx + 1) + 0.8 * this.curWheel;
    }

    this.meshList.forEach((mesh, idx) => {
      if (idx == activeIdx) {
        mesh.visible = true;
        if (mesh.shader) {
          mesh.shader.uniforms.transitionAmt.value = this.curWheel - activeIdx;
        }
      } else {
        mesh.visible = false;
      }
    });
  },

  handleMobileScroll: function () {
    if (!this.sideArrowComponent) return;

    if (this.sideArrowComponent.isLeftPressed) {
      this.handleScroll(-this.timeDeltaSec);
    } else if (this.sideArrowComponent.isRightPressed) {
      this.handleScroll(this.timeDeltaSec);
    }
  },

  tick: function (time, timeDelta) {
    this.handleMobileScroll();
    this.timeDeltaSec = timeDelta / 1000;
    this.meshList.forEach((mesh) => {
      if (mesh.shader) {
        mesh.shader.uniforms.timeMsec.value = time;
      }
    });
  },
};


// if(this.autoScroll) {
//   let dif = this.curWheel - this.activeIdx;
//   if(dif < 0.15) {
//     this.handleScroll(0.003 + 0.02*(dif))
//   } else if(dif  > 0.85) {
//     this.handleScroll(0.003 + 0.02*(1.0 - dif))
//   } else {
//     this.handleScroll(0.006)
//   }

// }