@import ./PerlinNoise;

varying vec2 vUv;
uniform sampler2D map;
uniform sampler2D map2;
varying float noise;
uniform float timeMsec;
uniform float transitionAmt;
varying vec4 vViewDir;
void main() {
  gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
}
