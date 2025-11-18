// src/components/AdvancedNeuralVisualizer.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { 
  getLayerInfo, 
  getNeuronConnections,
  type NeuralNetworkData 
} from '../utils/neuralNetworkParser';

interface AdvancedNeuralVisualizerProps {
  networkData: NeuralNetworkData;
  position?: 'left' | 'right' | 'center';
  activationMode: 'color' | 'thickness';
  label: string;
  comparisonData?: NeuralNetworkData | null;
  showDifferences?: boolean;
}

const AdvancedNeuralVisualizer: React.FC<AdvancedNeuralVisualizerProps> = ({ 
  networkData, 
  position = 'center',
  activationMode,
  label,
  comparisonData = null,
  showDifferences = false
}) => {
  const { isDark } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [hoveredConnection, setHoveredConnection] = useState<{ from: number; to: number; weight: number; diff?: number } | null>(null);

  // Memoize layer info to avoid recalculation
  const layerInfo = useMemo(() => getLayerInfo(networkData), [networkData]);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0a0a : 0xf5f5f5);

    // Camera setup
    const cameraAspect = currentMount.clientWidth / currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, cameraAspect, 0.1, 1000);

    // Renderer setup with optimization
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    currentMount.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Simplified lighting for performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Layout parameters
    const layerSpacing = 6;
    const neuronSpacing = 2;

    // Store data
    const neuronPositions = new Map<number, THREE.Vector3>();
    const connectionData: Array<{
      mesh: THREE.Mesh;
      from: number;
      to: number;
      weight: number;
      diff?: number;
    }> = [];

    // Calculate bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    // Reuse geometries for performance
    const neuronGeometry = new THREE.SphereGeometry(0.4, 16, 16);

    // Create neurons
    layerInfo.forEach((layer, layerIndex) => {
      const xPosition = (layerIndex - layerInfo.length / 2) * layerSpacing;
      const yStart = -(layer.neuronCount - 1) * neuronSpacing / 2;

      minX = Math.min(minX, xPosition);
      maxX = Math.max(maxX, xPosition);

      for (let i = 0; i < layer.neuronCount; i++) {
        const neuronIndex = layer.startNeuron + i;
        const yPosition = yStart + i * neuronSpacing;

        minY = Math.min(minY, yPosition);
        maxY = Math.max(maxY, yPosition);

        const material = new THREE.MeshBasicMaterial({
          color: isDark ? 0xffffff : 0x222222
        });
        
        const neuron = new THREE.Mesh(neuronGeometry, material);
        neuron.position.set(xPosition, yPosition, 0);
        scene.add(neuron);
        
        neuronPositions.set(neuronIndex, new THREE.Vector3(xPosition, yPosition, 0));

        // Simplified label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 64;
        canvas.height = 32;
        context.fillStyle = isDark ? '#ffffff' : '#000000';
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(`${neuronIndex}`, 32, 24);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(xPosition, yPosition + 0.8, 0);
        sprite.scale.set(0.6, 0.3, 1);
        scene.add(sprite);
      }
    });

    // Position camera to center view and ensure full network is visible
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    
    // Calculate distance based on FOV to fit the entire network
    const fov = camera.fov * (Math.PI / 180);
    const distanceX = (rangeX / 2) / Math.tan(fov / 2) / cameraAspect;
    const distanceY = (rangeY / 2) / Math.tan(fov / 2);
    const distance = Math.max(distanceX, distanceY) * 1.5; // Add padding

    // Optional horizontal offset when showing side-by-side visualizations
    const xOffset = position === 'left' ? -3 : position === 'right' ? 3 : 0;
    camera.position.set(centerX + xOffset, centerY, Math.max(distance, 10));
    camera.lookAt(centerX, centerY, 0);
    controls.target.set(centerX, centerY, 0);
    
    // Set zoom limits based on calculated distance
    controls.minDistance = Math.max(2, distance * 0.3);
    controls.maxDistance = distance * 3;
    controls.update();

    // Create connections
    layerInfo.forEach((layer, layerIndex) => {
      if (layerIndex < layerInfo.length - 1) {
        const nextLayer = layerInfo[layerIndex + 1];
        
        for (let i = 0; i < layer.neuronCount; i++) {
          const fromNeuron = layer.startNeuron + i;
          const connections = getNeuronConnections(networkData, fromNeuron);
          
          connections.forEach(({ to: toNeuron, weight }) => {
            if (toNeuron >= nextLayer.startNeuron && toNeuron <= nextLayer.endNeuron) {
              const fromPos = neuronPositions.get(fromNeuron);
              const toPos = neuronPositions.get(toNeuron);
              
              if (fromPos && toPos) {
                const direction = new THREE.Vector3().subVectors(toPos, fromPos);
                const length = direction.length();
                
                const normalizedWeight = Math.abs(weight);
                const clampedWeight = Math.min(Math.max(normalizedWeight, 0), 1);
                
                // Calculate difference if comparison data exists
                let difference = 0;
                if (showDifferences && comparisonData) {
                  const compWeight = comparisonData.weightsMatrix[fromNeuron]?.[toNeuron] || 0;
                  difference = Math.abs(weight - compWeight);
                }
                
                // Determine radius
                let radius = activationMode === 'thickness' 
                  ? 0.03 + clampedWeight * 0.1 
                  : 0.04;
                
                const geometry = new THREE.CylinderGeometry(radius, radius, length, 6);
                
                // Determine color
                let color;
                if (showDifferences && comparisonData) {
                  // Show differences: red = different, green = same
                  const diffNormalized = Math.min(difference * 3, 1);
                  const colorObj = new THREE.Color();
                  colorObj.setHSL((1 - diffNormalized) * 0.33, 1.0, 0.5);
                  color = colorObj.getHex();
                } else if (activationMode === 'color') {
                  const colorObj = new THREE.Color();
                  if (weight >= 0) {
                    colorObj.setHSL(0.3 + clampedWeight * 0.2, 1.0, 0.5);
                  } else {
                    colorObj.setHSL(0, 1.0, 0.3 + clampedWeight * 0.2);
                  }
                  color = colorObj.getHex();
                } else {
                  color = isDark ? 0xffffff : 0x333333;
                }
                
                const material = new THREE.MeshBasicMaterial({
                  color: color,
                  opacity: 0.5 + clampedWeight * 0.3,
                  transparent: true
                });
                
                const cylinder = new THREE.Mesh(geometry, material);
                
                cylinder.position.copy(fromPos).add(direction.multiplyScalar(0.5));
                cylinder.quaternion.setFromUnitVectors(
                  new THREE.Vector3(0, 1, 0),
                  direction.normalize()
                );
                
                scene.add(cylinder);
                
                // Store diff in userData for easy access
                if (showDifferences && difference !== undefined) {
                  cylinder.userData.diff = difference;
                }
                
                connectionData.push({
                  mesh: cylinder,
                  from: fromNeuron,
                  to: toNeuron,
                  weight,
                  diff: showDifferences ? difference : undefined
                });
              }
            }
          });
        }
      }
    });

    // Optimized raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastHoverTime = 0;
    const hoverThrottle = 100; // ms

    const onMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastHoverTime < hoverThrottle) return;
      lastHoverTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const connectionMeshes = connectionData.map(c => c.mesh);
      const intersects = raycaster.intersectObjects(connectionMeshes);

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        const connection = connectionData.find(c => c.mesh === hoveredMesh);
        
        if (connection) {
          setHoveredConnection({
            from: connection.from,
            to: connection.to,
            weight: connection.weight,
            diff: connection.diff
          });
          
          (hoveredMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffff00);
          (hoveredMesh.material as THREE.MeshBasicMaterial).opacity = 1;
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredConnection(null);
        renderer.domElement.style.cursor = 'default';
        
        // Reset colors
        connectionData.forEach(({ mesh, weight, diff }) => {
          const normalizedWeight = Math.abs(weight);
          const clampedWeight = Math.min(Math.max(normalizedWeight, 0), 1);
          
          let color;
          if (showDifferences && comparisonData && diff !== undefined) {
            const diffNormalized = Math.min(diff * 3, 1);
            const colorObj = new THREE.Color();
            colorObj.setHSL((1 - diffNormalized) * 0.33, 1.0, 0.5);
            color = colorObj.getHex();
          } else if (activationMode === 'color') {
            const colorObj = new THREE.Color();
            if (weight >= 0) {
              colorObj.setHSL(0.3 + clampedWeight * 0.2, 1.0, 0.5);
            } else {
              colorObj.setHSL(0, 1.0, 0.3 + clampedWeight * 0.2);
            }
            color = colorObj.getHex();
          } else {
            color = isDark ? 0xffffff : 0x333333;
          }
          
          (mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
          (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + clampedWeight * 0.3;
        });
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Optimized animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      const newAspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [networkData, comparisonData, isDark, activationMode, showDifferences, layerInfo, position]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Label */}
      <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-xl font-semibold text-sm ${
        isDark ? 'bg-white/10 border border-white/20 text-white' : 'bg-black/10 border border-black/20 text-black'
      }`}>
        {label}
      </div>

      {/* Mode indicator */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg backdrop-blur-xl text-xs ${
        isDark ? 'bg-white/10 border border-white/20 text-white' : 'bg-black/10 border border-black/20 text-black'
      }`}>
        {showDifferences ? '🔍 Differences' : activationMode === 'color' ? '🎨 Color' : '➖ Thickness'}
      </div>

      {/* Connection info */}
      {hoveredConnection && (
        <div className={`absolute top-16 right-4 p-3 rounded-xl backdrop-blur-xl text-xs ${
          isDark ? 'bg-white/10 border border-white/20' : 'bg-black/10 border border-black/20'
        }`}>
          <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
            🔗 Connection
          </p>
          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            {hoveredConnection.from} → {hoveredConnection.to}
          </p>
          <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Weight: {hoveredConnection.weight.toFixed(4)}
          </p>
          {hoveredConnection.diff !== undefined && (
            <p className={`font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Diff: {hoveredConnection.diff.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {/* Network info */}
      <div className={`absolute bottom-4 left-4 p-2 rounded-lg backdrop-blur-xl text-xs ${
        isDark ? 'bg-white/10 border border-white/20 text-gray-300' : 'bg-black/10 border border-black/20 text-gray-700'
      }`}>
        <p>Neurons: {networkData.totalNeurons}</p>
        <p>Layers: {networkData.layers.join('-')}</p>
      </div>

      {/* Controls */}
      <div className={`absolute bottom-4 right-4 p-2 rounded-lg backdrop-blur-xl text-xs ${
        isDark ? 'bg-white/10 border border-white/20 text-gray-300' : 'bg-black/10 border border-black/20 text-gray-700'
      }`}>
        <p>🖱️ Drag to rotate</p>
        <p>🔍 Scroll to zoom</p>
      </div>
    </div>
  );
};

export default AdvancedNeuralVisualizer;