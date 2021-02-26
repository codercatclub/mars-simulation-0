import AFRAME from 'aframe';
require('aframe-gltf-part-component');
require('aframe-extras');

import BlendMaterial from './components/BlendMaterial';
import Footsteps from './components/Footsteps';
import KeyboardControls from './components/KeyboardControls';
import ExampleSystem from './systems/ExampleSystem';

const THREE = AFRAME.THREE;

// Register all shaders

// Register all systems
AFRAME.registerSystem('example-system', ExampleSystem);

// Register all components
AFRAME.registerComponent('cc-keyboard-controls', KeyboardControls);
AFRAME.registerComponent('blend-material', BlendMaterial);
AFRAME.registerComponent('footsteps', Footsteps);
