import AFRAME from 'aframe';

require('aframe-extras');
require('aframe-log-component');

import BlendMaterial from './components/BlendMaterial';
import Footsteps from './components/Footsteps';
import KeyboardControls from './components/KeyboardControls';
import VRControls from './components/VRControls';
import QuickTurn from './components/QuickTurn';
import Mover from './components/Mover';
import CustomVRController from './components/CustomVRController';
import VectorFields from './components/VectorFields';
import SceneTransition from './components/SceneTransition';
import VRButton from './components/VRButton';
import ChromeMaterial from './components/ChromeMaterial';
import SideArrows from './components/SideArrows';

import ExampleSystem from './systems/ExampleSystem';
import SoundSystem from './systems/SoundSystem';
import GLTFPart from './components/GLTFPart';

import { Head } from './shaders';

// Register all shaders
AFRAME.registerShader('head', Head);

// Register all systems
AFRAME.registerSystem('example-system', ExampleSystem);
AFRAME.registerSystem('sound-system', SoundSystem);

// Register all components
AFRAME.registerComponent('cc-keyboard-controls', KeyboardControls);
AFRAME.registerComponent('cc-vr-controls', VRControls);
AFRAME.registerComponent('quick-turn', QuickTurn);
AFRAME.registerComponent('blend-material', BlendMaterial);
AFRAME.registerComponent('footsteps', Footsteps);
AFRAME.registerComponent('mover', Mover);
AFRAME.registerComponent('custom-vr-controller', CustomVRController);
AFRAME.registerComponent('vector-fields', VectorFields);
AFRAME.registerComponent('scene-transition', SceneTransition);
AFRAME.registerComponent('vr-button', VRButton);
AFRAME.registerComponent('chrome-material', ChromeMaterial);
AFRAME.registerComponent('gltf-part', GLTFPart);
AFRAME.registerComponent('side-arrows', SideArrows);
