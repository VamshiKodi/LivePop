import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Load a realistic Earth texture (blue marble)
    const colorMap = useLoader(
        THREE.TextureLoader,
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
    );

    useFrame(({ clock }) => {
        if (meshRef.current) {
            // Slow continuous rotation
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float
            speed={2} // Animation speed
            rotationIntensity={0.2} // Tiny random rotations
            floatIntensity={0.8} // Up/down float intensity
            floatingRange={[-0.08, 0.08]}
        >
            <mesh ref={meshRef}>
                {/* 32 segments is good enough for a small icon, keeps it lightweight */}
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshStandardMaterial
                    map={colorMap}
                    roughness={0.6}
                    metalness={0.1}
                />
            </mesh>
            {/* Subtle atmospheric blue glow effect (premium SaaS vibe) */}
            <mesh>
                <sphereGeometry args={[1.9, 32, 32]} />
                <meshBasicMaterial 
                    color="#00c6ff" 
                    transparent 
                    opacity={0.12} 
                    blending={THREE.AdditiveBlending} 
                    side={THREE.BackSide} 
                />
            </mesh>
        </Float>
    );
};

const EarthGlobe: React.FC = () => {
    return (
        <div className="w-12 h-12 flex items-center justify-center relative cursor-pointer">
            {/* Soft CSS backdrop shadow that pulses slightly on hover */}
            <div className="absolute inset-0 bg-[#00c6ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-300 rounded-full" />
            <Canvas
                shadows={false}
                camera={{ position: [0, 0, 5], fov: 45 }}
                className="w-full h-full relative z-10 block"
                style={{ background: 'transparent' }}
            >
                {/* Clean lighting setup */}
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 3, 5]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#00c6ff" />
                
                {/* Suspense is required for useLoader */}
                <React.Suspense fallback={null}>
                    <Earth />
                </React.Suspense>
            </Canvas>
        </div>
    );
};

export default EarthGlobe;
