const THREE = AFRAME.THREE;
import { html, css } from '../utils';

const CLAMP_VELOCITY = 0.00001;
const MAX_DELTA = 0.2;
const KEYS = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
];

const KEYCODE_TO_CODE = {
  38: "ArrowUp",
  37: "ArrowLeft",
  40: "ArrowDown",
  39: "ArrowRight",
  87: "KeyW",
  65: "KeyA",
  83: "KeyS",
  68: "KeyD",
};

const shouldCaptureKeyEvent = (event) => {
  if (event.metaKey) {
    return false;
  }
  return document.activeElement === document.body;
};

function isEmptyObject(keys) {
  let key;
  for (key in keys) {
    return false;
  }
  return true;
}

/** Touch WASD buttons UI for mobile devices */
class WASDTouchButtons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="wrapper">
        <div class="row">
          <div class="touch-button side" id="KeyA">←</div>
          <div class="vertical">
            <div class="touch-button" id="KeyW">↑</div>
            <div class="touch-button" id="KeyS">↓</div>
          </div>
          <div class="touch-button side" id="KeyD">→</div>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = css`
      .wrapper {
        display: none;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        position: absolute;
        right: 0;
        bottom: 60px;
        z-index: 999;
        user-select: none;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
      }

      .row {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        user-select: none;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
      }

      .touch-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        margin: 4px;
        border-color: black;
        border-radius: 7px;
        border-width: 1px;
        border-style: solid;
        color: rgb(0, 0, 0);
        font-family: 'Quicksand', sans-serif;
        font-size: 20px;
        -webkit-tap-highlight-color: red;
        user-select: none;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
      }

      .vertical {
        display: flex;
        flex-direction: column;
        margin-right: 15px;
      }

      .touch-button.pressed {
        background-color: #0000001c;
      }

      @media screen and (max-width: 800px) {
        .wrapper {
          display: flex;
        }
      }

      @media screen and (min-width: 800px) and (max-width: 1025px) {
        .wrapper {
          display: flex;
          align-items: flex-end;
          right: 10px;
        }
      }
    `;

    this.shadowRoot.append(style, template.content.cloneNode(true));

    this.shadowRoot.querySelectorAll(".touch-button").forEach((btn) => {
      btn.addEventListener("touchstart", (event) => {
        btn.classList.add("pressed");
        const newEvent = new CustomEvent("touchdown", {
          detail: { code: event.target.id },
        });
        window.dispatchEvent(newEvent);
      });
      btn.addEventListener("touchend", (event) => {
        btn.classList.remove("pressed");
        const newEvent = new CustomEvent("touchup", {
          detail: { code: event.target.id },
        });
        window.dispatchEvent(newEvent);
      });
    });
  }

  connectedCallback() {
    const noTurn = this.hasAttribute("no-turn");

    if (noTurn) {
      this.shadowRoot.querySelectorAll(".side").forEach((el) => {
        el.style.display = "none";
      });
    }
  }
}

customElements.define("wasd-touch-buttons", WASDTouchButtons);

/**
 * WASD component to control entities using WASD keys.
 */
export default {
  schema: {
    acceleration: { default: 65 },
    adAxis: { default: "x", oneOf: ["x", "y", "z"] },
    adEnabled: { default: true },
    adInverted: { default: false },
    enabled: { default: true },
    fly: { default: false },
    wsAxis: { default: "z", oneOf: ["x", "y", "z"] },
    wsEnabled: { default: true },
    wsInverted: { default: false },
  },

  init: function () {
    this.keys = {}; // To keep track of the pressed keys.
    this.easing = 1.1;

    this.velocity = new THREE.Vector3();

    const body = document.querySelector("body");
    this.cameraEl = document.querySelector("#camera");

    // Bind methods and add event listeners.
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);
    this.onTouchUp = this.onTouchUp.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    this.attachVisibilityEventListeners();

    const wasdTouchBtns = document.createElement("wasd-touch-buttons");

    wasdTouchBtns.setAttribute("no-turn", "");

    // Add touch buttons UI for mobile
    body.appendChild(wasdTouchBtns);
  },

  tick: function () {},

  getMoveAmt: function (time, delta) {
    const data = this.data;
    const velocity = this.velocity;

    if (
      !velocity[data.adAxis] &&
      !velocity[data.wsAxis] &&
      isEmptyObject(this.keys)
    ) {
      return false;
    }

    // Update velocity.
    delta = delta / 1000;
    this.updateVelocity(delta);

    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) {
      return false;
    }

    // Get movement vector and translate position.
    return this.getMovementVector(delta);
  },

  remove: function () {
    this.removeKeyEventListeners();
    this.removeVisibilityEventListeners();
  },

  play: function () {
    this.attachKeyEventListeners();
  },

  pause: function () {
    this.keys = {};
    this.removeKeyEventListeners();
  },

  updateVelocity: function (delta) {
    let acceleration;
    let adAxis;
    let adSign;
    const data = this.data;
    const keys = this.keys;
    const velocity = this.velocity;
    let wsAxis;
    let wsSign;

    adAxis = data.adAxis;
    wsAxis = data.wsAxis;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      return;
    }

    // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration
    const scaledEasing = Math.pow(1 / this.easing, delta * 60);
  
    // Velocity Easing.
    if (velocity[adAxis] !== 0) {
      velocity[adAxis] = velocity[adAxis] * scaledEasing;
    }
    if (velocity[wsAxis] !== 0) {
      velocity[wsAxis] = velocity[wsAxis] * scaledEasing;
    }

    // Clamp velocity easing.
    if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) {
      velocity[adAxis] = 0;
    }
    if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) {
      velocity[wsAxis] = 0;
    }

    if (!data.enabled) {
      return;
    }

    // Update velocity using keys pressed.
    acceleration = data.acceleration;
    if (data.adEnabled) {
      adSign = data.adInverted ? -1 : 1;
      if (keys.KeyA || keys.ArrowLeft) {
        velocity[adAxis] -= adSign * acceleration * delta;
      }
      if (keys.KeyD || keys.ArrowRight) {
        velocity[adAxis] += adSign * acceleration * delta;
      }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;
      if (keys.KeyW || keys.ArrowUp) {
        velocity[wsAxis] -= wsSign * acceleration * delta;
      }
      if (keys.KeyS || keys.ArrowDown) {
        velocity[wsAxis] += wsSign * acceleration * delta;
      }
    }
  },

  getMovementVector: (function () {
    const directionVector = new THREE.Vector3(0, 0, 0);
    const rotationEuler = new THREE.Euler(0, 0, 0, "YXZ");

    return function (delta) {
      const rotation = this.cameraEl.getAttribute("rotation");
      const velocity = this.velocity;
      let xRotation;

      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) {
        return directionVector;
      }

      xRotation = this.data.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(
        THREE.Math.degToRad(xRotation),
        THREE.Math.degToRad(rotation.y),
        0
      );
      directionVector.applyEuler(rotationEuler);

      return directionVector;
    };
  })(),

  attachVisibilityEventListeners: function () {
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("focus", this.onFocus);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  },

  removeVisibilityEventListeners: function () {
    window.removeEventListener("blur", this.onBlur);
    window.removeEventListener("focus", this.onFocus);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  },

  attachKeyEventListeners: function () {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("touchdown", this.onTouchDown);
    window.addEventListener("touchup", this.onTouchUp);
  },

  removeKeyEventListeners: function () {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("touchdown", this.onTouchDown);
    window.removeEventListener("touchup", this.onTouchUp);
  },

  onBlur: function () {
    this.pause();
  },

  onFocus: function () {
    this.play();
  },

  onVisibilityChange: function () {
    if (document.hidden) {
      this.onBlur();
    } else {
      this.onFocus();
    }
  },

  onKeyDown: function (event) {
    let code;
    if (!shouldCaptureKeyEvent(event)) {
      return;
    }
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    if (KEYS.indexOf(code) !== -1) {
      this.keys[code] = true;
    }
  },

  onKeyUp: function (event) {
    let code;
    code = event.code || event.detail.code || KEYCODE_TO_CODE[event.keyCode];
    delete this.keys[code];
  },

  onTouchDown: function (event) {
    this.keys[event.detail.code] = true;
  },

  onTouchUp: function (event) {
    delete this.keys[event.detail.code];
  }
};
