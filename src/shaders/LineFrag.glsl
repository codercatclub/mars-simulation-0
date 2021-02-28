@import ./FogFragPars;
varying vec3 vUv;
varying vec3 vPos;

void main() {
  // float col = mod(ceil(20.0*vUv.y),2.0);
  gl_FragColor= vec4(1.0,1.0,1.0,1.0);
  @import ./FogFrag;
}
