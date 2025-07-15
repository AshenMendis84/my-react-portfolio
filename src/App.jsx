// Save this file at: src/App.jsx
// This is the main component that controls the application's state.

import React, { useState } from 'react';
import Header from './components/Header';
import ModeSwitcher from './components/ModeSwitcher';
import SingleItemViewer from './components/SingleItemViewer';
import MultiItemViewer from './components/MultiItemViewer';

// The same data we used before
const furnitureData = [
    { name: 'Astronaut', url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' },
    { name: 'Horse', url: 'https://modelviewer.dev/shared-assets/models/Horse.glb' },
    { name: 'Shiba Inu', url: 'https://modelviewer.dev/shared-assets/models/shiba.glb' },
    { name: 'Neil Armstrong', url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb' }
];

export default function App() {
    // State to manage which mode is currently active ('single' or 'multi')
    const [mode, setMode] = useState('single');

    return (
        <div className="max-w-4xl mx-auto p-4 font-sans">
            <Header />
            <ModeSwitcher activeMode={mode} setMode={setMode} />

            {/* Conditionally render the correct viewer based on the active mode */}
            {mode === 'single' && <SingleItemViewer furnitureData={furnitureData} />}
            {mode === 'multi' && <MultiItemViewer furnitureData={furnitureData} />}
        </div>
    );
}
