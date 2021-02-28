@import ./PerlinNoise;
uniform sampler2D positionTex;
uniform float time;
varying vec2 vUv;
varying vec2 vUv2;
uniform vec3 playerPos;

void main() {
  vec3 prevPos;
  float alpha = 1.0;

  vec4 mainPos2 = texture2D(positionTex, vec2(0., vUv.y));

  if (vUv.x < 0.01) {
    prevPos = mainPos2.xyz;
    float angle = time / 5.0;
    vec3 offset = vec3(0.03 * time, 0.03 * time, 0.0);
    // velocity at desired pos
    float noise0 = cnoise(0.04 * prevPos.xyz + offset + vec3(0.0, 0.0, 0.0));
    float noisex = cnoise(0.04 * prevPos.xyz + offset + vec3(0.01, 0.0, 0.0));
    float noisey = cnoise(0.04 * prevPos.xyz + offset + vec3(0., 0.01, 0.0));
    float noisez = cnoise(0.04 * prevPos.xyz + offset + vec3(0., 0.0, 0.01));
    // float noise2 = cnoise(prevPos);
    float dx = noisex - noise0;
    float dy = noisey - noise0;
    float dz = noisez - noise0;

    float dxRot = cos(angle) * dx - sin(angle) * dy;
    float dyRot = sin(angle) * dx + cos(angle) * dy;

    if (length(prevPos - playerPos) > 20.0 || abs(dxRot + dyRot + dz) < 0.00001) {
      prevPos = 20.0 * normalize(prevPos - playerPos) + playerPos;
      prevPos.x += 0.3 * sin(time + 20.0*vUv.y);
      prevPos.z += 0.3 * cos(time + 20.0*vUv.y);
    }
    else{
      prevPos.x += 90.0 * dxRot;
      prevPos.y += 90.0 * dyRot;
      prevPos.z += 90.0 * dz;
    }

  } else if (vUv.x < 0.02) {
    prevPos = mainPos2.xyz;
    prevPos.x += 0.5;
  } else {
    vec2 m = vUv;
    m.x -= 2. / 99.;
    vec3 mPos = texture2D(positionTex, vUv).xyz;
    prevPos = 0.2 * texture2D(positionTex, m).xyz + 0.8 * mPos;
  }

  gl_FragColor = vec4(prevPos, alpha);
}
