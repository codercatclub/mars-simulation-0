import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

export default {
  schema: {
    controllerID: { type: 'string', default: 'leftHandController' },
  },

  init: function () {
    const {controllerID } = this.data;
    const scene = this.el.sceneEl;

    this.isVR = false;
    this.allowedToQuickturn = false;
    this.quickTurnTarget = 0;
    this.lastAxis = new THREE.Vector2();

    this.cameraRig = this.el.object3D;

    const controller = document.querySelector(`#${controllerID}`);

    // Only enable quick turn in VR mode and on a headset
    scene.addEventListener('enter-vr', () => {
      if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
          if (supported) {
            this.isVR = true;
          };
        });
      }
    });

    scene.addEventListener('exit-vr', () => {
      this.isVR = false;
    });

    /*
      Oculus touch controller events
    */
    controller.addEventListener('thumbsticktouchstart', () => {
      this.allowedToQuickturn = true;
    });

    controller.addEventListener('axismove', (evt) => {
      this.lastAxis.x = evt.detail.axis[2];
      this.lastAxis.y = evt.detail.axis[3];

      if (Math.abs(this.lastAxis.x) < 0.2) {
        this.allowedToQuickturn = true;
      }

      if (!this.allowedToQuickturn) {
        return;
      }

      if (this.lastAxis.x > 0.7) {
        this.quickTurnTarget -= 45;
        this.allowedToQuickturn = false;
      } else if (this.lastAxis.x < -0.7) {
        this.quickTurnTarget += 45;
        this.allowedToQuickturn = false;
      }
      
      if (this.isVR) {
        this.cameraRig.rotation.y = this.quickTurnTarget;
      }
    });
  },

  tick: function (time, timeDelta) {
  },
};
