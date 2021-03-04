const THREE = AFRAME.THREE;

export default {
  schema: {
    envMap: { type: 'map' },
    envMapIntensity: { default: 1 },
    roughness: { default: 0 },
    metalness: { default: 1 },
    reflectivity: { default: 1 },
    color: { type: 'color', default: '#ffffff' }
  },

  init: function () {
    this.scene = this.el.sceneEl;
    this.renderer = document.querySelector("a-scene").renderer;

    this.mat = new THREE.MeshPhysicalMaterial();

    this.el.addEventListener("object3dset", () => {
      const scene = this.el.getObject3D("mesh");
      scene.material = this.mat;
      scene.material.vertexColors = false;
    });
  },

  update: function () {
    const texture = new THREE.Texture(this.data.envMap);

    texture.needsUpdate = true;
    texture.mapping = THREE.EquirectangularReflectionMapping;

    this.mat.color = new THREE.Color(this.data.color);
    this.mat.envMap = texture;
    this.mat.roughness = this.data.roughness;
    this.mat.metalness = this.data.metalness;
    this.mat.reflectivity = this.data.reflectivity;
    this.mat.envMapIntensity = this.data.envMapIntensity;
  },
};
