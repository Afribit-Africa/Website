/* Adapted from Kokonut UI Beams, Background Paths and Flow Field (MIT).
 * Copyright (c) 2025 kokonutUI. Full notice: docs/education/kokonut-LICENSE.txt. */
import { backgroundFrame, type studioScenes } from '@/lib/studio-background'

type Scene = (typeof studioScenes)[number]
const colors = ['166,217,189', '227,232,226', '255,171,72', '131,183,201']

function seed(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

function fieldAngle(x: number, y: number, time: number) {
  const scale = .0025
  return Math.sin(x * scale + time * .0007) * Math.PI +
    Math.cos(y * scale + time * .0005) * Math.PI +
    Math.sin((x + y) * scale * .6 + time * .0009) * Math.PI * .6 +
    Math.cos((x - y) * scale * .4 + time * .0006) * Math.PI * .4
}

export function drawStudioBackground(context: CanvasRenderingContext2D, width: number, height: number,
  seconds: number, offset = 0, pointer = { x: 0, y: 0 }) {
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#080d0c'
  context.fillRect(0, 0, width, height)
  const frame = backgroundFrame(seconds, offset)
  const drawScene = (scene: Scene, opacity: number) => {
    if (opacity <= 0) return
    context.save()
    context.globalAlpha = opacity
    context.translate(pointer.x * 9, pointer.y * 6)
    if (scene === 'beams') {
      for (let index = 0; index < 24; index++) {
        const beamWidth = 22 + seed(index + 3) * 110
        const drift = Math.sin(seconds * .06 + index) * 70
        context.save()
        context.translate(seed(index) * width * 1.5 - width * .25 + drift, -height * .6)
        context.rotate((-34 + seed(index + 4) * 13) * Math.PI / 180)
        const gradient = context.createLinearGradient(-beamWidth / 2, 0, beamWidth / 2, 0)
        const color = colors[index % colors.length]
        const alpha = (.13 + seed(index + 5) * .17) * (.8 + Math.sin(seconds * .12 + index) * .2)
        gradient.addColorStop(0, `rgba(${color},0)`)
        gradient.addColorStop(.5, `rgba(${color},${alpha})`)
        gradient.addColorStop(1, `rgba(${color},0)`)
        context.fillStyle = gradient
        context.fillRect(-beamWidth / 2, 0, beamWidth, height * 3)
        context.restore()
      }
    } else if (scene === 'paths') {
      context.scale(width / 1600, height / 700)
      for (let index = 0; index < 36; index++) {
        const phase = index * .2 + seconds * .035
        context.beginPath()
        let previous = { x: -200, y: 0 }
        for (let step = 0; step <= 10; step++) {
          const progress = step / 10
          const point = { x: -200 + progress * 2000, y: 80 + index * 17 +
            Math.sin(progress * Math.PI * 3 + phase) * 125 + Math.cos(progress * Math.PI * 4 + phase) * 45 }
          if (!step) context.moveTo(point.x, point.y)
          else context.bezierCurveTo(previous.x + (point.x - previous.x) * .4, previous.y,
            previous.x + (point.x - previous.x) * .6, point.y, point.x, point.y)
          previous = point
        }
        context.strokeStyle = `rgba(${colors[index % colors.length]},${index % 6 === 0 ? .60 : .27})`
        context.lineWidth = index % 6 === 0 ? 2 : .95
        context.stroke()
      }
    } else {
      context.scale(width / 1600, height / 700)
      for (let index = 0; index < 82; index++) {
        let x = seed(index + 12) * 1800 - 100
        let y = seed(index + 19) * 900 - 100
        context.beginPath()
        context.moveTo(x, y)
        for (let step = 0; step < 62; step++) {
          const angle = fieldAngle(x, y, seconds * 12)
          x += Math.cos(angle) * 8
          y += Math.sin(angle) * 8
          context.lineTo(x, y)
        }
        context.strokeStyle = `rgba(${colors[index % colors.length]},${.22 + seed(index + 8) * .34})`
        context.lineWidth = index % 5 === 0 ? 1.6 : 1
        context.stroke()
      }
    }
    context.restore()
  }
  drawScene(frame.scene, 1 - frame.blend)
  drawScene(frame.next, frame.blend)
  return frame
}

export interface BackgroundRuntime {
  update: (moving: boolean, sceneOffset: number) => void
  dispose: () => void
}

export function createStudioBackground(root: HTMLDivElement): BackgroundRuntime | null {
  const canvas = root.querySelector('canvas')
  const context = canvas?.getContext('2d', { alpha: false })
  if (!canvas || !context) { root.dataset.background = 'fallback'; return null }
  let width = 0, height = 0, seconds = 0, offset = 0
  let animation = 0, lastFrame = 0, moving = false, visible = true
  let pointer = { x: 0, y: 0 }
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const paint = () => {
    const frame = drawStudioBackground(context, width, height, seconds, offset, pointer)
    root.dataset.scene = frame.scene
    root.dataset.nextScene = frame.next
    root.dataset.blend = frame.blend.toFixed(3)
    root.dataset.elapsed = seconds.toFixed(2)
    root.dataset.background = 'ready'
  }
  const isActive = () => moving && visible && !document.hidden && !motionQuery.matches
  const tick = (now: number) => {
    if (!isActive()) { animation = 0; return }
    if (!lastFrame) lastFrame = now
    const delta = (now - lastFrame) / 1000
    if (delta >= 1 / 30) {
      seconds += Math.min(delta, .2)
      lastFrame = now
      paint()
    }
    animation = requestAnimationFrame(tick)
  }
  const sync = () => {
    cancelAnimationFrame(animation)
    animation = 0
    lastFrame = 0
    root.dataset.running = String(isActive())
    if (isActive()) animation = requestAnimationFrame(tick)
  }
  const resize = () => {
    const rect = root.getBoundingClientRect()
    width = rect.width
    height = rect.height
    const density = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.25 : 1.5)
    canvas.width = Math.max(1, Math.round(width * density))
    canvas.height = Math.max(1, Math.round(height * density))
    context.setTransform(density, 0, 0, density, 0, 0)
    paint()
  }
  const stage = root.parentElement
  const movePointer = (event: PointerEvent) => {
    if (!isActive()) return
    const bounds = root.getBoundingClientRect()
    pointer = { x: (event.clientX - bounds.x) / bounds.width - .5, y: (event.clientY - bounds.y) / bounds.height - .5 }
  }
  const resetPointer = () => { if (isActive()) pointer = { x: 0, y: 0 } }
  const resizeObserver = new ResizeObserver(resize)
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
  resizeObserver.observe(root)
  intersection.observe(root)
  document.addEventListener('visibilitychange', sync)
  motionQuery.addEventListener('change', sync)
  stage?.addEventListener('pointermove', movePointer, { passive: true })
  stage?.addEventListener('pointerleave', resetPointer)
  resize()
  return {
    update(nextMoving, nextOffset) {
      moving = nextMoving
      if (offset !== nextOffset) { offset = nextOffset; seconds = 0; paint() }
      sync()
    },
    dispose() {
      cancelAnimationFrame(animation)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', sync)
      stage?.removeEventListener('pointermove', movePointer)
      stage?.removeEventListener('pointerleave', resetPointer)
    },
  }
}
