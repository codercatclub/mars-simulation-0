import AFRAME from "aframe";
const THREE = AFRAME.THREE;

export default {
  init: function () {
    this.el.setAttribute("vr-mode-ui", "enabled: false");

    if ("xr" in navigator) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        if (supported) {
          // Only show VR button if VR mode is supported
          this.el.setAttribute("vr-mode-ui", "enabled: true");
        }
      });
    }
  },
};
