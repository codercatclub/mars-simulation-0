var LOADING_MODELS = {};
var MODELS = {};

const GLTFPart = {
  schema: {
    buffer: { default: true },
    part: { type: "string" },
    src: { type: "asset" },
  },

  update: function () {
    var el = this.el;
    if (!this.data.part && this.data.src) {
      return;
    }
    this.getModel(function (modelPart) {
      if (!modelPart) {
        return;
      }
      el.setObject3D("mesh", modelPart);
    });
  },

  /**
   * Fetch, cache, and select from GLTF.
   *
   * @returns {object} Selected subset of model.
   */
  getModel: function (cb) {
    var self = this;

    // Already parsed, grab it.
    if (MODELS[this.data.src]) {
      cb(this.selectFromModel(MODELS[this.data.src]));
      return;
    }

    // Currently loading, wait for it.
    if (LOADING_MODELS[this.data.src]) {
      return LOADING_MODELS[this.data.src].then(function (model) {
        cb(self.selectFromModel(model));
      });
    }

    // Not yet fetching, fetch it.
    LOADING_MODELS[this.data.src] = new Promise(function (resolve) {
      const loader = new THREE.GLTFLoader();

      const dracoLoader = new THREE.DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

      loader.setDRACOLoader(dracoLoader);

      loader.load(
        self.data.src,
        function (gltfModel) {
          var model = gltfModel.scene || gltfModel.scenes[0];
          MODELS[self.data.src] = model;
          delete LOADING_MODELS[self.data.src];
          cb(self.selectFromModel(model));
          resolve(model);
        },
        function () {},
        console.error
      );
    });
  },

  /**
   * Search for the part name and look for a mesh.
   */
  selectFromModel: function (model) {
    var mesh;
    var part;

    part = model.getObjectByName(this.data.part);
    if (!part) {
      console.error("[gltf-part] `" + this.data.part + "` not found in model.");
      return;
    }

    var root = part.clone(true);
    //mesh = part.getObjectByProperty('type', 'Mesh').clone(true);

    return root;
  },
};

export default GLTFPart;
