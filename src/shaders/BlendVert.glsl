@import ./PerlinNoise;

varying float noise;
varying vec2 vUv;
uniform float timeMsec;
uniform float noiseMag;
uniform float offset;
varying vec4 vViewDir;

float turbulence(vec3 p) {

  float w = 100.0;
  float t = -.5;

  for (float f = 1.0; f <= 10.0; f++) {
    float power = pow(2.0, f);
    t += abs(pnoise3(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
  }

  return t;
}

void main() {
  vUv = uv;
  float time = timeMsec / 1000.0;
  noise = 5.0 * pnoise3((position) + vec3(time, offset, 0.0), vec3(100.0));
  vec3 newPosition = position + noiseMag * noise;
  vViewDir = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * vViewDir;
}
