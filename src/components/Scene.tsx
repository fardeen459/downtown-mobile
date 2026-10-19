import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, RoundedBox, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

type Props = { progress: MotionValue<number>; active: boolean; reduced: boolean }

function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 1024
    const g = c.getContext('2d')!
    const bg = g.createLinearGradient(0, 0, 512, 1024)
    bg.addColorStop(0, '#1a1410'); bg.addColorStop(0.45, '#0a0a0c'); bg.addColorStop(1, '#101317')
    g.fillStyle = bg; g.fillRect(0, 0, 512, 1024)
    const glow = g.createRadialGradient(330, 380, 10, 330, 380, 420)
    glow.addColorStop(0, 'rgba(216,185,138,0.55)'); glow.addColorStop(1, 'rgba(216,185,138,0)')
    g.fillStyle = glow; g.fillRect(0, 0, 512, 1024)
    g.strokeStyle = 'rgba(216,185,138,0.35)'; g.lineWidth = 2
    for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(256, 600, 120 + i * 46, 0, Math.PI * 2); g.stroke() }
    g.fillStyle = '#f3ece2'; g.textAlign = 'center'
    g.font = '300 150px Georgia, serif'; g.fillText('10:09', 256, 300)
    g.font = '500 26px Helvetica, Arial, sans-serif'; g.fillStyle = 'rgba(243,236,226,0.6)'
    g.fillText('REPAIRED  ·  LIKE NEW', 256, 350)
    g.fillStyle = 'rgba(243,236,226,0.8)'; g.beginPath(); g.roundRect(196, 970, 120, 8, 4); g.fill()
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
    return t
  }, [])
}

function Phone({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const screen = useScreenTexture()
  useFrame((state, dt) => {
    const p = reduced ? 0 : progress.get()
    const g = group.current
    const tx = reduced ? 0 : state.pointer.y * -0.18
    const ty = reduced ? -0.5 : state.pointer.x * 0.35 - 0.5 + p * Math.PI * 1.1
    const k = 1 - Math.pow(0.002, dt)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tx + p * 0.35, k)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, ty, k)
    g.position.y = THREE.MathUtils.lerp(g.position.y, p * 1.6, k)
    const base = Math.min(1, state.viewport.aspect / 0.85) * 0.82
    const s = base * (1 - p * 0.25)
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, k))
  })
  const metal = { color: '#2a2a2e', metalness: 1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 }
  return (
    <group ref={group} rotation={[0, -0.5, 0]}>
      <RoundedBox args={[1.6, 3.3, 0.18]} radius={0.085} smoothness={6}>
        <meshPhysicalMaterial {...metal} />
      </RoundedBox>
      {/* champagne frame band */}
      <RoundedBox args={[1.62, 3.32, 0.1]} radius={0.05} smoothness={4}>
        <meshPhysicalMaterial color="#c9a876" metalness={1} roughness={0.22} />
      </RoundedBox>
      {/* glass front */}
      <mesh position={[0, 0, 0.092]}>
        <planeGeometry args={[1.48, 3.16]} />
        <meshPhysicalMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.05} clearcoat={1} clearcoatRoughness={0} metalness={0} />
      </mesh>
      <mesh position={[0, 1.44, 0.094]}>
        <capsuleGeometry args={[0.045, 0.22, 4, 12]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* camera island */}
      <RoundedBox args={[0.68, 0.68, 0.06]} radius={0.14} position={[-0.37, 1.18, -0.11]}>
        <meshPhysicalMaterial color="#1c1c1f" metalness={0.6} roughness={0.15} clearcoat={1} />
      </RoundedBox>
      {[[-0.52, 1.33], [-0.22, 1.33], [-0.52, 1.03]].map(([x, y], i) => (
        <group key={i} position={[x, y, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh><cylinderGeometry args={[0.11, 0.11, 0.05, 32]} /><meshPhysicalMaterial color="#c9a876" metalness={1} roughness={0.2} /></mesh>
          <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.075, 0.075, 0.02, 32]} /><meshPhysicalMaterial color="#05060a" roughness={0} clearcoat={1} metalness={0.2} /></mesh>
        </group>
      ))}
    </group>
  )
}

function Ring({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, dt) => { if (!reduced) ref.current.rotation.z += dt * 0.08 })
  return (
    <group position={[0, 0, -1.6]}>
      <mesh ref={ref} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[2.35, 0.012, 16, 200]} />
        <meshBasicMaterial color="#e7c99a" toneMapped={false} />
      </mesh>
      <mesh rotation={[0.25, 0, 0]}>
        <torusGeometry args={[2.35, 0.09, 16, 200]} />
        <meshBasicMaterial color="#d8b98a" transparent opacity={0.07} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function Scene({ progress, active, reduced }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 7.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 6, 5]} angle={0.4} penumbra={1} intensity={60} color="#fff1dc" />
      <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#9fb4ff" />
      <Float enabled={!reduced} speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <Phone progress={progress} reduced={reduced} />
      </Float>
      <Ring reduced={reduced} />
      {!reduced && <Sparkles count={60} scale={[8, 6, 4]} size={2} speed={0.25} opacity={0.5} color="#e7c99a" />}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[8, 1.2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} color="#ffe2b8" position={[-5, 1, 1]} scale={[1.5, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} color="#b9c8ff" position={[5, 0, 1]} scale={[1.5, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={4} />
      </Environment>
    </Canvas>
  )
}
