// loading.tsx
import React from 'react';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-64 h-1.5 bg-gray-200 relative overflow-hidden">
                <div className="absolute top-0 h-full bg-black animate-[progress_1.5s_ease-in-out_infinite]" />
            </div>
        </div>
    );
}