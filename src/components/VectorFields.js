import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import LineFrag from '../shaders/LineFrag.glsl';
import LineVert from '../shaders/LineVert.glsl';
import LineComputeFrag from '../shaders/LineComputeFrag.glsl';
import LineComputeVert from '../shaders/LineComputeVert.glsl';
const width = 100;
const height = 600;

const numSegments = 49
const numLines = 599;


export default {
    schema: {
    },

    init: function () {
        this.makeLineGeo();
        this.initCompute();
        const camera = document.querySelector("#camera");
        this.camera = camera.object3D;
        this.cameraWorldPos = new THREE.Vector3();
    },
    makeLineGeo: function () {
        var geometry = new THREE.BufferGeometry();
        var vertices = new Float32Array(3 * 2 * numSegments*numLines)
        for (let l = 0; l < numLines; l++) {
            let lidx = numSegments * 6 * l;  
            for (let j = 0; j < numSegments; j++) {
                vertices[lidx + j * 6] = 1 + l
                vertices[lidx + j * 6 + 1] = j
                vertices[lidx + j * 6 + 2] = 0

                vertices[lidx + j * 6 + 3] = -1 + l
                vertices[lidx + j * 6 + 4] = j
                vertices[lidx + j * 6 + 5] = 0
            }
        }
        var index = new Uint32Array(3 * 2 * (numSegments - 1)*numLines)
        for (let l = 0; l < numLines; l++) {
            let lidx = (numSegments - 1) * 6 * l;  
            let sidx = 2 * numSegments * l;  
            for (let j = 0; j < numSegments - 1; j++) {
                //first triangle 
                index[lidx + 6 * j + 0] = sidx + 2 * j + 0;
                index[lidx + 6 * j + 1] = sidx + 2 * j + 1;
                index[lidx + 6 * j + 2] = sidx + 2 * j + 3;
                //second triangle
                index[lidx + 6 * j + 3] = sidx + 2 * j + 3;
                index[lidx + 6 * j + 4] = sidx + 2 * j + 2;
                index[lidx + 6 * j + 5] = sidx + 2 * j + 0;
            }
        }
        // assign an attribute which corresponds to MY position
        var uv = new Float32Array(2 * 2 * numSegments*numLines)
        for (let l = 0; l < numLines; l++) {
            for (let j = 0; j < 2 * numSegments; j++) {
                //first segment 
                uv[2*(l*2*numSegments + j)] = j / width;
                uv[2*(l*2*numSegments + j) + 1] = l / height;
            }
        }
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE.BufferAttribute(index, 1))
        let lineShader = new THREE.MeshBasicMaterial({
            side : THREE.DoubleSide,
            depthWrite: false
        });
        let myUniforms = {
            positionTex: { value: 0.0 },
            timeMsec: {value: 0.0}
        };
        lineShader.onBeforeCompile = (shader) => {
            shader.uniforms = THREE.UniformsUtils.merge([myUniforms, shader.uniforms]);
            shader.uniforms.positionTex.value = this.positionDataTex;
            shader.vertexShader = LineVert;
            shader.fragmentShader = LineFrag;
            this.lineMaterial = shader;
        };
        this.lineMesh = new THREE.Mesh(geometry, lineShader);
        this.lineMesh.frustumCulled = false;
        this.el.object3D.add(this.lineMesh)
    },

    initCompute: function () {
        this.computeRenderer = new THREE.WebGLRenderer();
        this.computePosScene = new THREE.Scene();
        this.computePosCamera = new THREE.Camera();
        this.computePosCamera.position.z = 1;
        this.computePosShader = new THREE.ShaderMaterial({
            depthWrite: false,
            uniforms: {
                positionTex: { value: 0.0 },
                time: { value: 0.0 },
                playerPos: { value: 0.0 },
            },
            vertexShader: LineComputeVert,
            fragmentShader: LineComputeFrag
        });
        //initialize early positions
        this.positionBuffer = new Float32Array(width * height * 4);
        for (var i = 0; i < this.lineMesh.geometry.attributes.uv.count; i++) {

            var newPos = new THREE.Vector3(this.lineMesh.geometry.attributes.position.array[3 * i],
                this.lineMesh.geometry.attributes.position.array[3 * i + 1],
                this.lineMesh.geometry.attributes.position.array[3 * i + 2]);

            this.positionBuffer[4 * i] =
                newPos.x;
            this.positionBuffer[4 * i + 1] =
                newPos.y;
            this.positionBuffer[4 * i + 2] =
                newPos.z;
            this.positionBuffer[4 * i + 3] = 1;
        }

        //SET UP GEO
        this.computePosMesh = this.InitComputeMesh(this.computePosShader);
        this.computePosScene.add(this.computePosMesh);

        //SET UP RENDER TARGET
        let res = this.InitComputeTexture(this.positionBuffer, true);
        this.positionBufferTarget = res[0];
        this.positionDataTex = res[1];

        //UPDATE MATERIALS ON COMPUTE + PARTICLE MESH
        this.computePosMesh.material.uniforms.positionTex.value = this.positionDataTex;
        
    },

    render: function () {
        this.computeRenderer.clear();
        this.computeRenderer.setRenderTarget(this.positionBufferTarget);
        this.computeRenderer.render(this.computePosScene, this.computePosCamera);
        this.computeRenderer.readRenderTargetPixels(
            this.positionBufferTarget,
            0,
            0,
            width,
            height,
            this.positionBuffer
        );
        this.positionDataTex.image.data = this.positionBuffer;
        this.positionDataTex.needsUpdate = true;
        // render normal mesh normally.
    },

    InitComputeMesh: function (shader) {
        let geo = new THREE.PlaneBufferGeometry(2, 2, (width-1), (height-1));
        let mesh = new THREE.Mesh(geo, shader);
        return mesh;
    },

    InitComputeTexture: function (buffer, withTarget) {
        let target, dataTexture;
        if (withTarget) {
            target = new THREE.WebGLRenderTarget(width, height, {
                format: THREE.RGBAFormat,
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                type: THREE.FloatType,
            });
        }

        dataTexture = new THREE.DataTexture(
            buffer,
            width,
            height,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        dataTexture.magFilter = THREE.NearestFilter;
        dataTexture.minFilter = THREE.NearestFilter;
        dataTexture.needsUpdate = true;
        return [target, dataTexture];
    },
    tick: function (time, timeDelta) {
        if(!this.el.object3D.parent.visible) return;
        this.computePosMesh.material.uniforms.time.value = time/1000;
        if(this.lineMaterial){
            this.lineMaterial.uniforms.timeMsec.value = time/1000;
        }
        this.camera.getWorldPosition(this.cameraWorldPos);
        this.cameraWorldPos.y -= 3;
        this.computePosMesh.material.uniforms.playerPos.value = this.cameraWorldPos;
        this.render();
    },
};

