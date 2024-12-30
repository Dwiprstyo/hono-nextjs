'use client'
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DonutSceneProps {
  name: string; // Define the type of the prop
}

const DonutScene: React.FC<DonutSceneProps> = ({ name }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Donut geometry and material
    const geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100); // Adjusted size for responsiveness
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // White for glass-like transparency
      metalness: 0.2, // Subtle metallic look
      roughness: 0.1, // Smooth surface
      transmission: 1.0, // Fully transparent
      ior: 1.5, // Index of refraction for glass
      clearcoat: 1.0, // Add a glossy top layer
      clearcoatRoughness: 0.0, // Perfectly smooth clearcoat
      reflectivity: 0.8, // Reflective surface
    });
    const donut = new THREE.Mesh(geometry, material);
    scene.add(donut);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5); // Bright point light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      donut.rotation.x += 0.01;
      donut.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-10"
      />
      <div 
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white">
          {name}
        </h1>
      </div>
    </div>
  );
};

export default DonutScene;