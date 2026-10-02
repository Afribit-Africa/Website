export const studioScenes = ['beams', 'paths', 'flow'] as const
export const SCENE_SECONDS = 45
export const SCENE_FADE_SECONDS = 5

export function backgroundFrame(seconds: number, offset = 0) {
  const elapsed = Math.max(0, seconds)
  const index = (Math.floor(elapsed / SCENE_SECONDS) + offset) % studioScenes.length
  const progress = elapsed % SCENE_SECONDS
  const blend = Math.max(0, (progress - SCENE_SECONDS + SCENE_FADE_SECONDS) / SCENE_FADE_SECONDS)
  return { scene: studioScenes[index], next: studioScenes[(index + 1) % studioScenes.length], blend: blend * blend * (3 - 2 * blend) }
}
