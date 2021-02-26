import AFRAME from "aframe";
const THREE = AFRAME.THREE;

import BlendVert from "../shaders/BlendVert.glsl";
import BlendFrag from "../shaders/BlendFrag.glsl";
const doRoutine = function (coroutine) {
  let r = coroutine.next();
  return r.done;
};

export default {
  schema: {
    map: { default: new THREE.Texture() },
    map2: { default: new THREE.Texture() },
    timeMsec: { default: 1 },
    transitionAmt: { default: 1 },
  },

  init: function () {
    let img1 = document.querySelector(this.data.map);
    let img2 = document.querySelector(this.data.map2);
    let tex1 = new THREE.Texture(img1);
    tex1.needsUpdate = true;
    let tex2 = new THREE.Texture(img2);
    tex2.needsUpdate = true;
    this.uniforms = this.initVariables(this.data);
    this.uniforms["map"].value = tex1;
    this.uniforms["map2"].value = tex2;
    this.blendMaterial = new THREE.ShaderMaterial({
      vertexShader: BlendVert,
      fragmentShader: BlendFrag,
      uniforms: this.uniforms,
    });

    this.mesh = this.el.object3D.getObjectByProperty("type", "Mesh");
    this.mesh.material = this.blendMaterial;

    document.addEventListener("wheel", (e) => {
      var delta = parseInt(e.deltaY);

      let lastT = this.blendMaterial.uniforms.transitionAmt.value;
      lastT -= delta / 1000;
      lastT = Math.max(Math.min(lastT, 1.0), 0.0);
      this.blendMaterial.uniforms.transitionAmt.value = lastT;
      return false;
    });
  },

  initVariables: function (data, type) {
    let key;
    let variables = {};
    for (key in data) {
      variables[key] = {
        value: data[key],
      };
    }
    return variables;
  },

  update: function (data) {
    let key;
    for (key in data) {
      if (key == "map" || key == "map2") continue;
      this.blendMaterial.uniforms[key].value = data[key];
      this.blendMaterial.uniforms[key].needsUpdate = true;
    }
  },
  
  tick: function (time, timeDelta) {
    this.timeDelta = timeDelta;
    this.blendMaterial.uniforms.timeMsec.value = time;
  },
};
