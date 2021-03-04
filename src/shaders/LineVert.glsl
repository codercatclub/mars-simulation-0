@import ./PerlinNoise;
@import ./FogVertPars;
uniform sampler2D positionTex;
varying vec3 vUv;
void main() {
  vec4 pos = 0.25*texture2D(positionTex, uv);
  pos.z -= 15.0;
  vUv = vec3(uv, pos.w);

  vec4 worldPosition = modelMatrix * vec4(pos.xyz, 1.0);
  vec4 mvPosition = viewMatrix * worldPosition;
  @import ./FogVert;
  gl_Position = projectionMatrix * mvPosition;
}