// Save this file at: src/components/ModeSwitcher.jsx
// This component contains the buttons to toggle between modes.

import React from 'react';

export default function ModeSwitcher({ activeMode, setMode }) {
    const baseClasses = "px-6 py-2 font-semibold rounded-full shadow-md transition-transform transform hover:scale-105";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "bg-white text-gray-700";

    return (
        <div className="flex justify-center gap-4 mb-6">
            <button 
                onClick={() => setMode('single')}
                className={`${baseClasses} ${activeMode === 'single' ? activeClasses : inactiveClasses}`}
            >
                Single Item AR
            </button>
            <button 
                onClick={() => setMode('multi')}
                className={`${baseClasses} ${activeMode === 'multi' ? activeClasses : inactiveClasses}`}
            >
                Multi-Item AR
            </button>
        </div>
    );
}
