import AFRAME from "aframe";

const THREE = AFRAME.THREE;

const noSoundSVG = `
  <svg width="50" viewBox="-50.00 -50.00 966.95 796.93">
    <path d="M153.105 470.641 L485.545 690.721 L491.795 694.354 L497.212 696.425 L501.795 696.934 L505.546 695.882 L508.462 693.268 L510.546 689.092 L511.796 683.355 L512.212 676.056 L512.212 20.878 L511.796 13.579 L510.546 7.842 L508.462 3.666 L505.546 1.052 L501.795 0.0 L497.212 0.509 L491.795 2.58 L485.545 6.213 L153.105 226.293 L31.836 226.293 L24.375 226.798 L17.908 228.313 L12.436 230.838 L7.959 234.373 L4.477 238.918 L1.99 244.473 L0.497 251.037 L0.0 258.612 L0.0 438.322 L0.497 445.897 L1.99 452.461 L4.477 458.016 L7.959 462.561 L12.436 466.096 L17.908 468.621 L24.375 470.136 L31.836 470.641 Z" stroke="rgb(0, 0, 0)" stroke-width="10.0px" fill="none"/>
    <path d="M625.555 478.17 L740.623 361.357 L855.692 478.17 L866.947 466.743 L751.879 349.931 L866.947 233.118 L855.692 221.692 L740.623 338.504 L625.555 221.692 L614.299 233.118 L729.367 349.931 L614.299 466.743 Z" stroke="rgb(0, 0, 0)" stroke-width="none" fill="black"/>
  </svg>
`;

const soundSVG = `
  <svg width="50" viewBox="-50.00 -50.00 957.91 796.93">
    <path d="M153.204 470.641 L485.859 690.721 L492.113 694.354 L497.533 696.425 L502.119 696.934 L505.872 695.882 L508.79 693.268 L510.875 689.092 L512.126 683.355 L512.543 676.056 L512.543 20.878 L512.126 13.579 L510.875 7.842 L508.79 3.666 L505.872 1.052 L502.119 0.0 L497.533 0.509 L492.113 2.58 L485.859 6.213 L153.204 226.293 L31.857 226.293 L24.39 226.798 L17.919 228.313 L12.444 230.838 L7.964 234.373 L4.48 238.918 L1.991 244.473 L0.498 251.037 L0.0 258.612 L0.0 438.322 L0.498 445.897 L1.991 452.461 L4.48 458.016 L7.964 462.561 L12.444 466.096 L17.919 468.621 L24.39 470.136 L31.857 470.641 Z" stroke="rgb(0, 0, 0)" stroke-width="10.0px" fill="none"/>
    <path d="M857.913 358.01 L857.913 341.851 L695.329 341.851 L695.329 358.01 Z" stroke="rgb(0, 0, 0)" stroke-width="none" fill="black"/>
    <path d="M792.867 95.576 L784.903 81.582 L644.101 164.053 L652.065 178.047 Z" stroke="rgb(0, 0, 0)" stroke-width="none" fill="black"/>
    <path d="M784.903 618.28 L792.867 604.286 L652.065 521.815 L644.101 535.809 Z" stroke="rgb(0, 0, 0)" stroke-width="none" fill="black"/>
  </svg>
`;

const ingectCSS = (css) => {
  var style = document.createElement("style");

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName("head")[0].appendChild(style);
};

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

export default {
  init: function () {
    const ascene = document.querySelector("a-scene");

    if (ascene) {
      ascene.addEventListener('enter-vr', () => {
        // turn sound on 
        this.setSound(true);
      });
    }

    this.soundEntities = document.querySelectorAll("a-entity[sound]");
    this.videoEntities = document.querySelectorAll("video");

    this.muted = true;
    this.sounds = {};

    // Store volume for all audio
    this.soundEntities.forEach((el) => {
      el.addEventListener("object3dset", (event) => {
        const sound = event.target.components["sound"];
        const id = el.getAttribute("id");

        // Store sounds properties
        this.sounds[id] = {
          volume: sound.data.volume,
        };

        // Mute all sounds on start
        el.setAttribute("sound", { volume: 0 });

        const numEntities =
          this.soundEntities.length + this.videoEntities.length;

        if (numEntities === Object.size(this.sounds)) {
          console.log("[+] All sounds are loaded!");
          this.addSoundButton();
        }
      });
    });

    // Store volume for all videos
    this.videoEntities.forEach((vid) => {
      const id = vid.getAttribute("id");

      this.sounds[id] = {
        volume: vid.volume,
      };

      vid.volume = 0.0;
    });
  },

  addSoundButton: function () {
    // Add sound button
    var css = `
    .soundBtn {
      position: absolute;
      bottom: 15px;
      left: 20px;
      z-index: 999;
      cursor: pointer;
    };
    `;

    ingectCSS(css);

    const body = document.querySelector("body");
    const div = document.createElement("div");

    div.setAttribute("class", "soundBtn");

    div.innerHTML = noSoundSVG;
    div.addEventListener("click", () => {
      this.setSound(false);
    });

    body.appendChild(div);
  },

  setSound: function (overrideOn) {
    if (!this.iconDiv) {
      this.iconDiv = document.querySelector(".soundBtn");
    }
    if (this.muted || overrideOn) {
      this.iconDiv.innerHTML = soundSVG;

      // Unmute and play all sounds
      this.soundEntities.forEach((el) => {
        const id = el.getAttribute("id");
        const sound = el.components.sound;

        if (sound.data.autoplay) {
          sound.playSound();
        }

        // Restore sound volume
        el.setAttribute("sound", { volume: this.sounds[id].volume });
      });

      // Restore volume on all videos
      this.videoEntities.forEach((vid) => {
        const id = vid.getAttribute("id");
        vid.volume = this.sounds[id].volume;
      });

      this.muted = false;
    } else {
      this.iconDiv.innerHTML = noSoundSVG;

      // Mute all sounds
      this.soundEntities.forEach((el) => {
        el.setAttribute("sound", { volume: 0 });
      });

      // Mute all videos
      this.videoEntities.forEach((vid) => {
        vid.volume = 0.0;
      });

      this.muted = true;
    }
  },

  registerMe: function (el) {
    this.soundEntities.push(el);
  },

  unregisterMe: function (el) {
    const index = this.soundEntities.indexOf(el);
    this.soundEntities.splice(index, 1);
  },
};
