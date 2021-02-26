@import ./PerlinNoise;

varying vec2 vUv;
uniform sampler2D map;
uniform sampler2D map2;
varying float noise;
uniform float timeMsec;
uniform float transitionAmt;
varying vec4 vViewDir;
vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
  vec3 color1 = texture2D(map, vUv).rgb;
  vec3 color2 = texture2D(map2, vUv).rgb;

  // float blendAmt = 0.5 * ( 1.0 + sin(0.001*timeMsec) ) ;
  float blendAmt = transitionAmt;

  float noiseAmt = pnoise3(vec3(0.5*vUv.x, 0.5*vUv.y + blendAmt, length(color1)), vec3(10.0, 10.0, 10.0));

  vec2 dirToCenter = vUv - vec2(0.5,0.5);

  color1 = texture2D(map, vUv + dirToCenter*noiseAmt*blendAmt).rgb;
  color2 = texture2D(map2, vUv + dirToCenter*noiseAmt*(1.0 - blendAmt)).rgb;

  color1 += 4.0*noiseAmt * blendAmt * vec3(10.0, 0.0, 0.0);
  // color2 *= 1.0 + noiseAmt * (1.0-blendAmt);

  vec3 blendColor = mix(color1, color2, blendAmt);

  gl_FragColor = vec4( blendColor, 1.0 );
}
