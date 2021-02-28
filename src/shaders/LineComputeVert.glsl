attribute vec2 uvsToFollow;
varying vec2 vUv;
varying vec2 vUv2;

void main() {
  vUv = uv;
  vUv2 = uvsToFollow;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}