#ifdef USE_FOG
  fogDepth =- mvPosition.z;
  // fogDepth -= 40.0 * (1.0 + noise) * (1.0 + pow(min(worldPos.y/40.0,1.0),2.0));
  // float noise = cnoise( 0.007 * (worldPos.xy + vec2(worldPos.z  + timeMsec/100.0, timeMsec/100.0)));
  // fogDepth -= fogDepth * noise;
  vWorldPos = worldPosition;
#endif