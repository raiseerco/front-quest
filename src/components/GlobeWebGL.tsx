"use client"

import React, { useRef, useEffect, useMemo, useState } from "react"
import * as THREE from "three"

interface GlobeProps {
  totalParticles?: number
  orbSize?: number
  particleSize?: number
  animationDuration?: number
  baseHue?: number
  className?: string
  backgroundColor?: string
  trailLength?: number
}

const Globe: React.FC<GlobeProps> = ({
  totalParticles = 500,
  orbSize = 2.2,
  particleSize = 0.05,
  animationDuration = 15,
  baseHue = 350, // 20 yellow, 50 green, 100 blue, red 300
  className = "",
  backgroundColor = "transparent",
  trailLength = 10,
}) => {
  // Simplified animation phases
  const PHASES = {
    SPIRAL: 0.15, // 15%spiral formation
    SPHERE: 0.35, // 35% transform to sphere
    ROTATION: 0.35, // 35% rotation
    SUPERNOVA: 0.1, // 10% simplified supernova
    FADE: 0.05, // 5%  fade out
  } as const

  // Calculate phase boundaries
  const getPhaseEnd = (phase: keyof typeof PHASES) => {
    const keys = Object.keys(PHASES) as (keyof typeof PHASES)[]
    const index = keys.indexOf(phase)
    return keys.slice(0, index + 1).reduce((sum, key) => sum + PHASES[key], 0)
  }

  const PHASE_BOUNDARIES = {
    SPIRAL: getPhaseEnd("SPIRAL"),
    SPHERE: getPhaseEnd("SPHERE"),
    ROTATION: getPhaseEnd("ROTATION"),
    SUPERNOVA: getPhaseEnd("SUPERNOVA"),
    FADE: getPhaseEnd("FADE"),
  }

  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const particleSystemRef = useRef<THREE.Points>()
  const trailSystemRef = useRef<THREE.LineSegments>()
  const animationIdRef = useRef<number>()
  const startTimeRef = useRef<number>(Date.now())
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Generate particle data
  const particleData = useMemo(() => {
    const data = {
      positions: new Float32Array(totalParticles * 3),
      colors: new Float32Array(totalParticles * 3),
      originalColors: new Float32Array(totalParticles * 3),
      rotationZ: new Float32Array(totalParticles),
      rotationY: new Float32Array(totalParticles),
      delays: new Float32Array(totalParticles),
      spiralParams: new Float32Array(totalParticles * 2), // [angle, radius]
      trailPositions: Array.from({ length: totalParticles }, () =>
        Array.from({ length: trailLength }, () => new THREE.Vector3())
      ),
      trailIndices: new Array(totalParticles).fill(0),
    }

    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3

      // Rotations and delays
      data.rotationZ[i] = Math.random() * Math.PI * 2
      data.rotationY[i] = Math.random() * Math.PI * 2
      data.delays[i] = i * 0.01

      // Spiral parameters
      data.spiralParams[i * 2] = (i / totalParticles) * 4 * Math.PI + Math.random() * 0.5
      data.spiralParams[i * 2 + 1] = (i / totalParticles) * orbSize * 1.5

      // Colors
      const hue = ((40 / totalParticles) * i + baseHue) % 360
      const color = new THREE.Color().setHSL(hue / 360, 1, 0.5)

      data.originalColors[i3] = color.r
      data.originalColors[i3 + 1] = color.g
      data.originalColors[i3 + 2] = color.b

      // Initialize at origin
      data.positions[i3] = data.positions[i3 + 1] = data.positions[i3 + 2] = 0
      data.colors[i3] = data.colors[i3 + 1] = data.colors[i3 + 2] = 0
    }

    return data
  }, [totalParticles, baseHue, orbSize, trailLength])

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const { innerWidth: vw, innerHeight: vh } = window
      const isLarge = vw >= 1024

      setDimensions({
        width: isLarge ? Math.min(vw * 0.5, vw * 0.66) : vw * 0.9,
        height: isLarge ? vh * 0.9 : vh * 0.4,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Animation helpers
  const getSpherePosition = (i: number) => {
    const rotZ = particleData.rotationZ[i]
    const rotY = particleData.rotationY[i]

    const pos = new THREE.Vector3(orbSize, 0, 0)
    pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotZ)
    pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY)
    pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), -rotZ)

    return pos
  }

  const getSpiralPosition = (i: number, progress: number) => {
    const angle = particleData.spiralParams[i * 2] * progress
    const radius = particleData.spiralParams[i * 2 + 1] * progress

    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.3,
      Math.sin(angle * 2) * radius * 0.2
    )
  }

  const updateTrails = (i: number, position: THREE.Vector3, opacity: number) => {
    if (trailLength === 0 || !trailSystemRef.current) return

    const trailIndex = particleData.trailIndices[i]
    const trail = particleData.trailPositions[i]

    trail[trailIndex].copy(position)
    particleData.trailIndices[i] = (trailIndex + 1) % trailLength

    const trailGeometry = trailSystemRef.current.geometry
    const trailPositions = trailGeometry.attributes.position.array as Float32Array
    const trailColors = trailGeometry.attributes.color.array as Float32Array

    for (let t = 0; t < trailLength - 1; t++) {
      const segmentIndex = i * (trailLength - 1) + t
      const current = trail[(trailIndex - t - 1 + trailLength) % trailLength]
      const next = trail[(trailIndex - t - 2 + trailLength) % trailLength]

      // Positions
      const posIndex = segmentIndex * 6
      trailPositions[posIndex] = current.x
      trailPositions[posIndex + 1] = current.y
      trailPositions[posIndex + 2] = current.z
      trailPositions[posIndex + 3] = next.x
      trailPositions[posIndex + 4] = next.y
      trailPositions[posIndex + 5] = next.z

      // Colors with fade
      const trailOpacity = opacity * (1 - t / trailLength) * 0.3
      const colorIndex = segmentIndex * 6

      for (let c = 0; c < 3; c++) {
        trailColors[colorIndex + c] = particleData.originalColors[i * 3 + c] * trailOpacity
        trailColors[colorIndex + c + 3] =
          particleData.originalColors[i * 3 + c] * trailOpacity * 0.5
      }
    }
  }

  // main setup and animation
  useEffect(() => {
    if (!mountRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const mountElement = mountRef.current // Capture ref value

    // sc setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(dimensions.width, dimensions.height)
    renderer.setClearColor(0x000000, 0)
    mountElement.appendChild(renderer.domElement)

    // dust system
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(particleData.positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(particleData.colors, 3))

    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // trail system
    let trailSystem: THREE.LineSegments | null = null
    if (trailLength > 0) {
      const trailGeometry = new THREE.BufferGeometry()
      const trailPositions = new Float32Array(totalParticles * trailLength * 6)
      const trailColors = new Float32Array(totalParticles * trailLength * 6)

      trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3))
      trailGeometry.setAttribute("color", new THREE.BufferAttribute(trailColors, 3))

      const trailMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      })

      trailSystem = new THREE.LineSegments(trailGeometry, trailMaterial)
      scene.add(trailSystem)
    }

    // camera pos
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    // store references
    sceneRef.current = scene
    rendererRef.current = renderer
    particleSystemRef.current = particleSystem
    trailSystemRef.current = trailSystem

    // anim loop
    const animate = () => {
      const globalTime = (Date.now() - startTimeRef.current) / 1000

      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position
          .array as Float32Array
        const colors = particleSystemRef.current.geometry.attributes.color.array as Float32Array

        for (let i = 0; i < totalParticles; i++) {
          const particleTime = globalTime - particleData.delays[i]
          const cycleTime = particleTime % animationDuration
          const progress = Math.max(0, cycleTime / animationDuration)

          let position = new THREE.Vector3()
          let opacity = 0

          // phase logic
          if (progress <= PHASE_BOUNDARIES.SPIRAL) {
            // spiral formation
            const spiralProgress = progress / PHASE_BOUNDARIES.SPIRAL
            opacity = Math.min(1, spiralProgress * 2)
            position = getSpiralPosition(i, spiralProgress)
          } else if (progress <= PHASE_BOUNDARIES.SPHERE) {
            // transition to sphere
            opacity = 1
            const transitionProgress = (progress - PHASE_BOUNDARIES.SPIRAL) / PHASES.SPHERE
            const spiralPos = getSpiralPosition(i, 1)
            const spherePos = getSpherePosition(i)
            position.lerpVectors(spiralPos, spherePos, transitionProgress)
          } else if (progress <= PHASE_BOUNDARIES.ROTATION) {
            // rotation
            opacity = 1
            const rotationProgress = (progress - PHASE_BOUNDARIES.SPHERE) / PHASES.ROTATION
            position = getSpherePosition(i)
            position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationProgress * Math.PI * 2)
          } else if (progress <= PHASE_BOUNDARIES.SUPERNOVA) {
            // simp supernova - dust goes to center
            const supernovaProgress = (progress - PHASE_BOUNDARIES.ROTATION) / PHASES.SUPERNOVA
            const currentSpherePos = getSpherePosition(i)
            currentSpherePos.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2)

            // to center with small random offset
            const randomOffset = new THREE.Vector3(
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1
            )

            position.lerpVectors(currentSpherePos, randomOffset, supernovaProgress)
            opacity = 1 + supernovaProgress * 2 // Intense glow
          } else {
            // fade out
            const fadeProgress = (progress - PHASE_BOUNDARIES.SUPERNOVA) / PHASES.FADE
            position.set(0, 0, 0)
            opacity = Math.max(0, 1 - fadeProgress * 2)
          }

          // new position
          const i3 = i * 3
          positions[i3] = position.x
          positions[i3 + 1] = position.y
          positions[i3 + 2] = position.z

          colors[i3] = particleData.originalColors[i3] * opacity
          colors[i3 + 1] = particleData.originalColors[i3 + 1] * opacity
          colors[i3 + 2] = particleData.originalColors[i3 + 2] * opacity
          updateTrails(i, position, opacity)
        }

        // update geometry
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true
        particleSystemRef.current.geometry.attributes.color.needsUpdate = true

        if (trailSystemRef.current) {
          trailSystemRef.current.geometry.attributes.position.needsUpdate = true
          trailSystemRef.current.geometry.attributes.color.needsUpdate = true
        }

        // full sys rotation
        const rotationSpeed = (2 * Math.PI) / animationDuration
        particleSystemRef.current.rotation.y = globalTime * rotationSpeed * 0.3
        particleSystemRef.current.rotation.x = globalTime * rotationSpeed * 0.1
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera)
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountElement && rendererRef.current) {
        mountElement.removeChild(rendererRef.current.domElement)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleData, dimensions, totalParticles, orbSize, particleSize, animationDuration])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        background: backgroundColor,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        pointerEvents: "auto",
      }}
    />
  )
}

export default Globe
