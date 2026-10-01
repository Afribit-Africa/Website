import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { bitcoinLesson } from '@/lib/education'

export interface GlobeRuntime {
  update: (moving: boolean, interactive: boolean) => void
  dispose: () => void
}

export function createGlobe(container: HTMLDivElement): GlobeRuntime | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' })
  } catch { container.dataset.globe = 'fallback'; return null }

  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)
  renderer.setClearColor('#070b0c')
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100)
  const controls = new OrbitControls(camera, canvas)
  controls.enablePan = false
  controls.enableZoom = false
  controls.enableDamping = false
  controls.enabled = false
  controls.rotateSpeed = .65
  controls.minPolarAngle = Math.PI * .2
  controls.maxPolarAngle = Math.PI * .8

  const world = new THREE.Group()
  world.rotation.z = .12
  scene.add(world)
  const geometry = new THREE.SphereGeometry(1, 64, 48)
  const material = new THREE.MeshPhongMaterial({ color: '#ffffff', shininess: 8, specular: '#193544' })
  const earth = new THREE.Mesh(geometry, material)
  earth.rotation.y = -1.9
  world.add(earth)
  scene.add(new THREE.AmbientLight('#adc7d6', 1.15))
  const sunlight = new THREE.DirectionalLight('#fff6e5', 2.5)
  sunlight.position.set(-3, 2, 4)
  scene.add(sunlight)

  const atmosphereGeometry = new THREE.SphereGeometry(1.018, 64, 48)
  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 normalView; varying vec3 positionView;
      void main() { vec4 p = modelViewMatrix * vec4(position, 1.0);
        normalView = normalize(normalMatrix * normal); positionView = p.xyz;
        gl_Position = projectionMatrix * p; }`,
    fragmentShader: `varying vec3 normalView; varying vec3 positionView;
      void main() { float rim = pow(1.0 - max(0.0, dot(normalize(normalView), normalize(-positionView))), 4.0);
        gl_FragColor = vec4(0.25, 0.65, 0.9, rim * 0.55); }`,
  })
  world.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial))

  // Seeded, stationary stars keep remounts and paused frames stable.
  const positions = new Float32Array(420 * 3)
  let seed = 101
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let index = 0; index < positions.length; index += 3) {
    positions[index] = (random() - .5) * 26
    positions[index + 1] = (random() - .5) * 18
    positions[index + 2] = -8 - random() * 10
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const starMaterial = new THREE.PointsMaterial({ color: '#bdcfd4', size: .024, transparent: true, opacity: .65 })
  scene.add(new THREE.Points(starGeometry, starMaterial))

  let disposed = false, moving = false, visible = true, loaded = false, failed = false
  let frame = 0, previous = 0, lastPaint = 0
  const render = () => { if (!disposed && !failed) renderer.render(scene, camera) }
  const tick = (now: number) => {
    frame = 0
    if (disposed || failed || !loaded || !moving || !visible || document.hidden) return
    const delta = previous ? Math.min((now - previous) / 1000, .1) : 0
    previous = now
    earth.rotation.y += delta * .045
    if (now - lastPaint >= 1000 / 30) { render(); lastPaint = now }
    frame = requestAnimationFrame(tick)
  }
  const sync = () => {
    cancelAnimationFrame(frame); frame = 0; previous = 0
    if (moving && visible && loaded && !document.hidden && !failed) frame = requestAnimationFrame(tick)
  }
  const resize = () => {
    if (disposed || !container.clientWidth || !container.clientHeight) return
    const width = container.clientWidth, height = container.clientHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 1.75))
    renderer.setSize(width, height)
    camera.aspect = width / height
    // Fit the entire sphere to the shorter dimension, including mobile focus mode.
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
    const distance = Math.max(1 / Math.sin(halfFov), 1 / Math.sin(Math.atan(Math.tan(halfFov) * camera.aspect))) * 1.15
    camera.position.copy(camera.position.length() ? camera.position.normalize().multiplyScalar(distance) : new THREE.Vector3(0, .15, distance))
    camera.updateProjectionMatrix(); controls.update(); render()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
  intersectionObserver.observe(container)
  document.addEventListener('visibilitychange', sync)
  controls.addEventListener('change', render)
  const onKey = (event: KeyboardEvent) => {
    if (!controls.enabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    earth.rotation.y += event.key === 'ArrowLeft' ? -.15 : event.key === 'ArrowRight' ? .15 : 0
    world.rotation.z += event.key === 'ArrowUp' ? .08 : event.key === 'ArrowDown' ? -.08 : 0
    render()
  }
  canvas.addEventListener('keydown', onKey)
  const onLost = (event: Event) => { event.preventDefault(); failed = true; container.dataset.globe = 'fallback'; sync() }
  const onRestored = () => { failed = false; container.dataset.globe = loaded ? 'ready' : 'loading'; render(); sync() }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  resize()

  const texture = new THREE.TextureLoader().load(bitcoinLesson.globeTexture, (map) => {
    if (disposed) { map.dispose(); return }
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
    material.map = map; material.needsUpdate = true
    loaded = true; render(); container.dataset.globe = 'ready'; sync()
  }, undefined, () => { failed = true; container.dataset.globe = 'fallback'; sync() })

  return {
    update(nextMoving, interactive) {
      moving = nextMoving
      controls.enabled = interactive
      canvas.tabIndex = interactive ? 0 : -1
      canvas.setAttribute('aria-hidden', String(!interactive))
      canvas.setAttribute('aria-label', 'Earth globe')
      canvas.setAttribute('role', 'img')
      sync()
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame)
      resizeObserver.disconnect(); intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('keydown', onKey)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      controls.dispose(); texture.dispose(); geometry.dispose(); material.dispose()
      atmosphereGeometry.dispose(); atmosphereMaterial.dispose(); starGeometry.dispose(); starMaterial.dispose()
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove()
    },
  }
}
