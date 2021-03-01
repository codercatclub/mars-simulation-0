@import ./PerlinNoise;
@import ./FogVertPars;
varying vec2 vUv;

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
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPosition;
  @import ./FogVert;
  gl_Position = projectionMatrix * mvPosition;
}
