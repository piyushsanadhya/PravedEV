import React, { Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, PerspectiveCamera, Environment } from '@react-three/drei'
import VoltronScooter from './VoltronScooter'

function ResponsiveCamera() {
  const { width, height } = useThree((state) => state.size)
  const isMobile = width < 768
  const aspect = width / height

  // On narrow/portrait screen orientations, zoom out (adjust fov & z-depth) 
  // so the bike doesn't get clipped.
  let fov = 40
  let z = 4.4
  let y = -0.18

  if (isMobile) {
    fov = aspect < 0.75 ? 54 : 46
    z = aspect < 0.75 ? 5.0 : 4.5
    y = -0.12
  }

  return (
    <PerspectiveCamera makeDefault position={[0, y, z]} fov={fov} near={0.1} far={50} />
  )
}

export default function VoltronScene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, toneMapping: 3, alpha: false }}
      dpr={Math.min(window.devicePixelRatio, 1.5)} // Max out at 1.5x pixel ratio to prevent GPU lag on high-res monitors
      style={{ width: '100%', height: '100%', background: '#070708' }}
    >
      {/* Background matches site dark theme exactly */}
      <color attach="background" args={['#070708']} />

      {/* Camera automatically adjusts for mobile dimensions */}
      <ResponsiveCamera />

      {/* Ambient */}
      <ambientLight intensity={0.05} />

      {/* Key light — warm top-left */}
      <spotLight
        position={[2, 5, 3]}
        angle={0.35}
        penumbra={0.9}
        intensity={4}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[1024, 1024]} // Reduced map size to optimize performance on mobile and laptop GPUs
        shadow-bias={-0.0001}
      />

      {/* Fill — cool right */}
      <directionalLight position={[3, 2, -1]} intensity={1.2} color="#cce8ff" />

      {/* Backlight rim */}
      <directionalLight position={[-3, 1, -4]} intensity={2} color="#ffffff" />

      {/* Cyan tech glow */}
      <pointLight position={[-2.5, 0.5, 0.5]} intensity={5} distance={6} color="#00e5ff" />

      {/* Red trellis glow */}
      <pointLight position={[2.5, -0.2, 0.5]} intensity={4} distance={6} color="#ff1744" />

      {/* Underlight */}
      <pointLight position={[0, -1.5, 0]} intensity={2} distance={5} color="#0a0015" />

      {/* HDR reflections */}
      <Environment preset="studio" />

      {/* Matte dark floor to absorb all whitish studio envMap reflections */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#070708" metalness={0.0} roughness={1.0} />
      </mesh>

      {/* Futuristic neon grid helper */}
      <gridHelper 
        args={[30, 30, '#00e5ff', 'rgba(255,23,68,0.25)']} 
        position={[0, -1.045, 0]} 
      />

      {/* Concentric glowing neon rings directly under the motorcycle */}
      <mesh position={[0, -1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.35, 64]} />
        <meshBasicMaterial color="#00e5ff" toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -1.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.3, 64]} />
        <meshBasicMaterial color="#ff1744" toneMapped={false} transparent opacity={0.15} />
      </mesh>

      {/* Contact shadow under bike */}
      <ContactShadows
        position={[0, -1.035, 0]}
        opacity={0.9}
        scale={9}
        blur={2.5}
        far={2.5}
        color="#000000"
      />

      <Suspense fallback={null}>
        <VoltronScooter />
      </Suspense>
    </Canvas>
  )
}
