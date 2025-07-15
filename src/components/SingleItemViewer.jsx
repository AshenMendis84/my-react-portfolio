// Save this file at: src/components/SingleItemViewer.jsx
// This component wraps Google's <model-viewer>.

import React, { useState, useEffect } from 'react';

// Import the <model-viewer> library
import '@google/model-viewer';

export default function SingleItemViewer({ furnitureData }) {
    const [selectedModel, setSelectedModel] = useState(furnitureData[0]?.url || '');

    useEffect(() => {
        // This is needed to define the custom element in the browser
        // after it has been imported.
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-700">1. Single Item AR Viewer</h2>
                <p className="text-sm text-gray-500">Uses Google &lt;model-viewer&gt; for quick placement.</p>
                <div className="mt-4">
                    <label htmlFor="furniture-select-single" className="block text-sm font-medium text-gray-700 mb-1">Select Model:</label>
                    <select 
                        id="furniture-select-single" 
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
            <div className="h-96 relative bg-gray-200">
                <model-viewer 
                    src={selectedModel}
                    alt="A 3D model"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    style={{width: '100%', height: '100%'}}
                >
                    <button slot="ar-button" style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '9999px',
                        padding: '12px 20px',
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        border: 'none'
                    }}>
                        View in AR
                    </button>
                </model-viewer>
            </div>
        </div>
    );
}
