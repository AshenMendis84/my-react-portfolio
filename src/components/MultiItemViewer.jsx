// Save this file at: src/components/MultiItemViewer.jsx
// This component handles the complex three.js and WebXR scene.

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function MultiItemViewer({ furnitureData }) {
    const canvasRef = useRef(null);
    const [selectedModel, setSelectedModel] = useState(furnitureData[0]?.url || '');

    useEffect(() => {
        // This effect sets up the entire three.js scene.
        // It runs only once when the component mounts.
        
        const container = document.getElementById('multi-ar-container');
        if (!container || !canvasRef.current) return;

        // Scene, Camera, and Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.xr.enabled = true;

        // Lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
        light.position.set(0.5, 1, 0.25);
        scene.add(light);

        // Reticle (placement marker)
        const reticle = new THREE.Mesh(
            new THREE.RingGeometry(0.05, 0.07, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial()
        );
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);

        // AR Button
        const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
        arButton.style.position = 'absolute';
        arButton.style.bottom = '20px';
        arButton.style.left = '50%';
        arButton.style.transform = 'translateX(-50%)';
        arButton.textContent = 'Start Multi-Item AR';
        container.appendChild(arButton);
        
        // GLTF Loader
        const loader = new GLTFLoader();

        // Controller for tap-to-place
        const controller = renderer.xr.getController(0);
        controller.addEventListener('select', onSelect);
        scene.add(controller);

        let hitTestSource = null;
        let hitTestSourceRequested = false;

        function onSelect() {
            if (reticle.visible) {
                loader.load(selectedModel, (gltf) => {
                    const model = gltf.scene;
                    model.position.setFromMatrixPosition(reticle.matrix);
                    if (selectedModel.includes('Astronaut')) {
                         model.scale.set(0.2, 0.2, 0.2);
                    } else {
                         model.scale.set(0.5, 0.5, 0.5);
                    }
                    scene.add(model);
                }, undefined, (error) => {
                    console.error('An error happened while loading the model:', error);
                });
            }
        }

        function render(timestamp, frame) {
            if (frame) {
                const referenceSpace = renderer.xr.getReferenceSpace();
                const session = renderer.xr.getSession();

                if (hitTestSourceRequested === false) {
                    session.requestReferenceSpace('viewer').then((refSpace) => {
                        session.requestHitTestSource({ space: refSpace }).then((source) => {
                            hitTestSource = source;
                        });
                    });
                    session.addEventListener('end', () => {
                        hitTestSourceRequested = false;
                        hitTestSource = null;
                    });
                    hitTestSourceRequested = true;
                }

                if (hitTestSource) {
                    const hitTestResults = frame.getHitTestResults(hitTestSource);
                    if (hitTestResults.length) {
                        const hit = hitTestResults[0];
                        reticle.visible = true;
                        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
                    } else {
                        reticle.visible = false;
                    }
                }
            }
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(render);

        // Cleanup function
        return () => {
            renderer.setAnimationLoop(null);
            container.removeChild(arButton);
        };

    }, [selectedModel]); // Rerun effect if selectedModel changes (though setup is mostly once)

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-700">2. Multi-Item AR Scene Builder</h2>
                <p className="text-sm text-gray-500">Uses three.js & WebXR to place multiple items.</p>
                <div className="mt-4">
                    <label htmlFor="furniture-select-multi" className="block text-sm font-medium text-gray-700 mb-1">Select Model to Place:</label>
                    <select 
                        id="furniture-select-multi" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                    >
                        {furnitureData.map(item => (
                            <option key={item.name} value={item.url}>{item.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div id="multi-ar-container" className="h-96 relative bg-gray-800">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
}
