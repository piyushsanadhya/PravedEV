import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'

useGLTF.preload('/MODEL.glb')

export default function VoltronScooter() {
  const groupRef = useRef()
  const modelRef = useRef()
  const rotY = useRef(Math.PI * 0.5)

  const { scene } = useGLTF('/MODEL.glb')

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(mat => {
          mat.roughness = Math.min((mat.roughness ?? 0.5) * 0.65, 0.75)
          mat.metalness = Math.min((mat.metalness ?? 0) + 0.2, 1.0)
          if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
            mat.envMapIntensity = 2.4
          }
          mat.needsUpdate = true
        })
      }
    })
  }, [scene])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Slow continuous auto-rotation
    rotY.current += delta * 0.25

    // Mouse parallax layered on top
    const mouseX = state.pointer.x * 0.12
    const mouseY = state.pointer.y * 0.06

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, rotY.current + mouseX, 0.04
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, mouseY, 0.04
    )

    // Float: always upward only (sin mapped 0→1 range) so bike never clips the floor
    groupRef.current.position.y = (Math.sin(t * 0.7) * 0.5 + 0.5) * 0.09
  })

  return (
    <group ref={groupRef} rotation={[0, Math.PI * 0.5, 0]}>
      <primitive
        ref={modelRef}
        object={scene}
        scale={[0.62, 0.62, 0.62]}
        position={[0, -0.36, 0]}
      />
    </group>
  )
}
