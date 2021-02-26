import AFRAME from 'aframe';
require('aframe-gltf-part-component');
require('aframe-extras');
require('aframe-log-component');

import BlendMaterial from './components/BlendMaterial';
import Footsteps from './components/Footsteps';
import KeyboardControls from './components/KeyboardControls';
import VRControls from './components/VRControls';
import QuickTurn from './components/QuickTurn';
import Mover from './components/Mover';
import ExampleSystem from './systems/ExampleSystem';

const THREE = AFRAME.THREE;

// Register all shaders

// Register all systems
AFRAME.registerSystem('example-system', ExampleSystem);

// Register all components
AFRAME.registerComponent('cc-keyboard-controls', KeyboardControls);
AFRAME.registerComponent('cc-vr-controls', VRControls);
AFRAME.registerComponent('quick-turn', QuickTurn);
AFRAME.registerComponent('blend-material', BlendMaterial);
AFRAME.registerComponent('footsteps', Footsteps);
AFRAME.registerComponent('mover', Mover);
