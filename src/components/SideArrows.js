const THREE = AFRAME.THREE;
import { html, css } from "../utils";

class SideArrowsButtons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="wrapper">
        <div id="left" class="btn">
          <svg
            x="0px"
            y="0px"
            viewBox="0 0 197.402 197.402"
            style="enable-background:new 0 0 197.402 197.402;"
            xml:space="preserve"
          >
            <g>
              <polygon
                style="fill:#010002;"
                points="146.883,197.402 45.255,98.698 146.883,0 152.148,5.418 56.109,98.698 152.148,191.98"
              />
            </g>
          </svg>
        </div>
        <div id="right" class="btn">
          <svg
            x="0px"
            y="0px"
            viewBox="0 0 223.413 223.413"
            style="enable-background:new 0 0 223.413 223.413;"
            xml:space="preserve"
          >
            <polygon
              style="fill:#010002;"
              points="57.179,223.413 51.224,217.276 159.925,111.71 51.224,6.127 57.179,0 172.189,111.71"
            />
          </svg>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = css`
      .wrapper {
        display: none;
        position: absolute;
        height: 100%;
        z-index: 100;
        width: 100%;
        top: 0;
        pointer-events: none;
      }

      svg {
        pointer-events: none;
      }

      .btn {
        justify-content: center;
        align-items: center;
        height: 50px;
        width: 50px;
        position: absolute;
        z-index: 200;
        top: 45%;
        pointer-events: all;
        margin: 10px;
        padding: 5px;
        cursor: pointer;
      }

      #right {
        right: 0;
      }

      @media screen and (max-width: 800px) {
        .wrapper {
          display: block;
        }
      }
    `;

    this.shadowRoot.append(style, template.content.cloneNode(true));

    const root = this.shadowRoot;
    const btns = root.querySelectorAll(".btn");
    const eventOptions = {
      bubbles: true,
      composed: true,
    };

    btns.forEach(b => {
      b.addEventListener("touchstart", (event) => {
        const newEvent = new Event(`${event.target.id}-touch-start`, eventOptions);
        event.target.dispatchEvent(newEvent);
      });
  
      b.addEventListener("touchend", (e) => {
        const newEvent = new Event(`${e.target.id}-touch-end`, eventOptions);
        e.target.dispatchEvent(newEvent);
      });
    });
  }

  connectedCallback() {}
}

customElements.define("side-arrows-buttons", SideArrowsButtons);

export default {
  schema: {},

  init: function () {
    this.isLeftPressed = false;
    this.isRightPressed = false;

    const body = document.querySelector("body");
    const sideArrowBtns = document.createElement("side-arrows-buttons");

    body.appendChild(sideArrowBtns);

    sideArrowBtns.addEventListener("left-touch-start", () => {
      this.isLeftPressed = true;
    });

    sideArrowBtns.addEventListener("left-touch-end", () => {
      this.isLeftPressed = false;
    });

    sideArrowBtns.addEventListener("right-touch-start", () => {
      this.isRightPressed = true;
    });

    sideArrowBtns.addEventListener("right-touch-end", () => {
      this.isRightPressed = false;
    });
  },
};
