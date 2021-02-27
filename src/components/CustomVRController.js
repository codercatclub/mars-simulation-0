import AFRAME from "aframe";
const THREE = AFRAME.THREE;

export default {
  schema: {
    hand: { default: "" },
    model: { default: "#hand" },
  },

  init: function () {
    this.el.setAttribute("visible", false);

    // Add controllers in VR
    this.el.sceneEl.addEventListener("enter-vr", (ent) => {
      this.el.setAttribute("visible", true);
    });

    // Remove controllers
    this.el.sceneEl.addEventListener("exit-vr", (ent) => {
      this.el.setAttribute("visible", false);
    });
  },

  update: function () {
    const hand = this.data.hand;

    const el = this.el;
    const controlConfiguration = {
      hand: hand,
      model: false,
      orientationOffset: { x: 0, y: 0, z: hand === "left" ? 90 : -90 },
    };

    // Build on top of controller components.
    el.setAttribute("vive-controls", controlConfiguration);
    el.setAttribute("oculus-touch-controls", controlConfiguration);
    el.setAttribute("daydream-controls", controlConfiguration);
    el.setAttribute("gearvr-controls", controlConfiguration);
    el.setAttribute("windows-motion-controls", controlConfiguration);

    if (!this.data.model) {
      console.log(
        "[-] No model specified! Model is required for custom VR controller."
      );
    }

    // Set a model.
    el.setAttribute("gltf-model", this.data.model);
  },
};
