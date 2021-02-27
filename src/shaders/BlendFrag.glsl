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
  // vec3 randImgCol = texture2D(map2, vec2(0.5,0.5)).rgb;

  vec3 randImgCol = vec3(1.0, 1.0, 1.0);

  vec3 color1 = texture2D(map, vUv).rgb;
  vec3 color2 = texture2D(map2, vUv).rgb;

  float blendAmt = transitionAmt;

  // noise is based on uv coords, transition amount, and brightness
  float noiseAmt = pnoise3(vec3(1.0*vUv.x + color1.r, 1.0*vUv.y + 0.5*blendAmt + color1.g, length(color1)), vec3(10.0, 10.0, 10.0));
  vec2 dirToCenter = vUv - vec2(0.5,0.5);
  // offset colors with the noise
  vec3 offsetColor1 = texture2D(map, vUv - dirToCenter*noiseAmt*blendAmt).rgb;
  vec3 offsetColor2 = texture2D(map2, vUv + dirToCenter*noiseAmt*(1.0 - blendAmt)).rgb;


  randImgCol.r = 0.5*sin(0.002*timeMsec);
  // randImgCol.g = (offsetColor1.g-color1.g) + 0.5*sin(0.002*timeMsec);
  // randImgCol.b = (offsetColor2.g-color2.g) + 0.5*sin(0.002*timeMsec);

  //random add
  // offsetColor1 = mix(offsetColor1,10.0*randImgCol, noiseAmt * blendAmt );
  offsetColor1 += 2.0*randImgCol * max(noiseAmt,0.0) * blendAmt;
  offsetColor2 += 2.0*randImgCol * max(noiseAmt,0.0) * (1.0-blendAmt);
  // color2 *= 1.0 + noiseAmt * (1.0-blendAmt);

  //blend the two
  vec3 blendColor = mix(offsetColor1, offsetColor2, blendAmt);

  gl_FragColor = vec4( blendColor, 1.0 );
}
