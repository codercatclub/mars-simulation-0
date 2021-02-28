@import ./PerlinNoise;

varying float noise;
varying vec2 vUv;
uniform float timeMsec;
uniform float noiseMag;
uniform float offset;
varying vec4 vViewDir;

void main() {
  vUv = uv;
  float time = timeMsec / 1000.0;
  noise = pnoise3(100.0*position + vec3(time, offset, 0.0), vec3(100.0));
  vec3 newPosition = position;
  newPosition.y += 0.01 * smoothstep(0.4,0.5,noise);
  vViewDir = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * vViewDir;
}
