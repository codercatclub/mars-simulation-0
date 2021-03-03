const THREE = AFRAME.THREE;

export default {
  schema: {
    controllerID: { type: "string", default: "rightHandController" },
    cameraID: { type: "string", default: "camera" },
    speed: { type: "number", default: 1 },
  },

  init: function () {
    const { controllerID, cameraID, speed } = this.data;

    this.isVR = false;
    this.lastAxis = new THREE.Vector2();
    this.moveAmt = 0.0;
    this.vrMovingSpeed = 0.0039 * speed;

    const controller = document.querySelector(`#${controllerID}`);

    const camera = document.querySelector(`#${cameraID}`);
    this.camera = camera.object3D;

    if ("xr" in navigator) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        if (supported) {
          this.el.sceneEl.addEventListener("enter-vr", (ent) => {
            this.isVR = true;
          });
          this.el.sceneEl.addEventListener("exit-vr", (ent) => {
            this.isVR = false;
          });
        }
      });
    }
    this.worldQuat = new THREE.Quaternion();

    /*
      Oculus remote controller events
    */
    controller.addEventListener("axismove", (evt) => {
      this.lastAxis.x = evt.detail.axis[2];
      this.lastAxis.y = evt.detail.axis[3];
    });
  },

  getMoveAmt: function (time, timeDelta) {
    if (!this.isVR) return false;

    this.deltaTimeSec = timeDelta / 1000;
    this.camera.getWorldQuaternion(this.worldQuat);
    this.tweenForward = new THREE.Vector3(
      -this.lastAxis.x,
      0,
      -this.lastAxis.y
    ).applyQuaternion(this.worldQuat.premultiply(this.camera.quaternion));

    this.tweenForward.y = 0.0;
    
    return this.handleVRMove(this.tweenForward, timeDelta);
  },

  handleVRMove: function (move, timeDelta) {
    return move.multiplyScalar(-this.vrMovingSpeed * timeDelta);
  },
};