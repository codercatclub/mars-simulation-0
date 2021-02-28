import HeadVert from './HeadVert.glsl';
import HeadFrag from './HeadFrag.glsl';

export const Head = {
  schema: {
    timeMsec: { type: 'time', is: 'uniform' },
  },
  vertexShader: HeadVert,
  fragmentShader: HeadFrag,
};
