#ifdef USE_FOG
  //float noise = cnoise( 0.007 * (vWorldPos.xy + vec2(vWorldPos.z, 0.0)));
//   float vFogDepth = fogDepth - 2.0* fogDepth;
	float scale = 0.04;
	vec3 scaledPos = scale * (vWorldPos.xyz + vec3(200.0 * sin(timeMsec/20000.0), 0.0, 200.0 * cos(timeMsec/20000.0)));
	float val = scaledPos.z * sin(scaledPos.x) - scaledPos.x * cos(scaledPos.z);
	float normDist = clamp(vWorldPos.y - 3.0*val, 0.0, 100.0)/100.0;
	float noise = normDist;

	float vFogDepth = fogDepth - 0.5 * fogDepth * noise;
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	// gl_FragColor.rgb = mix( gl_FragColor.rgb, mix(fogColor, vec3(1.0, 1.0, 1.0), clamp(vWorldPos.y-50.0,0.0,40.0)/40.0), fogFactor );
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
	//gl_FragColor.rgb = vec3(noise, noise, noise);
#endif