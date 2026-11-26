import { chromeShade, coinPlacement, sampleRibbon } from './coinRibbon'
import type { CoinState, RibbonEdge, RibbonShape } from './coinRibbon'

/**
 * Canvas 2D cannot read CSS custom properties, so the scene's colours are
 * listed here in hex — the Kora tokens (`--kora-lime-*`, `--kora-canvas`,
 * `--kora-text`) plus the in-between shades the chrome needs.
 */
const SCENE_COLORS = {
  ink: '#ecf2ea',
  lime200: '#d6fa8e',
  lime400: '#b8f24b',
  limeBorder: '#4a6320',
  limeShine: '#f2ffd6',
  limeFace: '#a8de3f',
  limeMid: '#9fd13a',
  limeShade: '#5f8a22',
} as const

type ColorStop = readonly [offset: number, hex: string]

/** Graphite chrome with a lime reflection band, dark to light. */
const DARK_CHROME_STOPS: ReadonlyArray<ColorStop> = [
  [0, '#0a0c0a'],
  [0.16, '#1c211c'],
  [0.3, '#4b534a'],
  [0.4, '#c9d1c6'],
  [0.46, '#f6f9f3'],
  [0.52, '#8e968c'],
  [0.62, '#262c26'],
  [0.74, '#2a3a14'],
  [0.86, SCENE_COLORS.limeMid],
  [0.93, SCENE_COLORS.lime200],
  [1, SCENE_COLORS.limeShine],
]

/** Silver chrome for a pale ground, lime picked up in the reflections. */
const LIGHT_CHROME_STOPS: ReadonlyArray<ColorStop> = [
  [0, '#7a8277'],
  [0.14, '#959d92'],
  [0.28, '#b7bfb3'],
  [0.4, '#e6ebe1'],
  [0.46, '#ffffff'],
  [0.53, '#c8d2c1'],
  [0.63, '#a3ab9f'],
  [0.74, '#d7e5c2'],
  [0.86, '#b8d97a'],
  [0.93, SCENE_COLORS.lime200],
  [1, '#ffffff'],
]

const RAMP_SIZE = 256
const RIBBON_SEGMENTS = 280

/** Kora mark proportions, taken from public/favicon.svg. */
const MARK_INNER_RATIO = 0.607
const MARK_DOT_RATIO = 0.148

/** Whether the scene sits on a dark or a light ground. */
export type SceneTone = 'dark' | 'light'

export type SceneFrame = {
  shape: RibbonShape
  coin: CoinState
  radius: number
  tone: SceneTone
}

type ScenePalette = {
  ramp: Array<string>
  /** [outline, highlight] for each rim. */
  backRim: readonly [string, string]
  frontRim: readonly [string, string]
  frontRimWidth: number
}

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

/** Interpolates colour stops into `size` CSS `rgb()` strings. */
export function buildColorRamp(
  stops: ReadonlyArray<ColorStop>,
  size: number,
): Array<string> {
  const ramp: Array<string> = []
  for (let i = 0; i < size; i++) {
    const offset = size === 1 ? 0 : i / (size - 1)
    const upperIndex = Math.max(
      1,
      stops.findIndex(([stop]) => stop >= offset),
    )
    const [fromOffset, fromHex] = stops[upperIndex - 1]
    const [toOffset, toHex] = stops[upperIndex]
    const span = toOffset - fromOffset || 1
    const mix = Math.min(1, Math.max(0, (offset - fromOffset) / span))
    const from = hexToRgb(fromHex)
    const to = hexToRgb(toHex)
    const channels = from.map((channel, index) =>
      Math.round(channel + (to[index] - channel) * mix),
    )
    ramp.push(`rgb(${channels.join(',')})`)
  }
  return ramp
}

const SCENE_PALETTES: Record<SceneTone, ScenePalette> = {
  dark: {
    ramp: buildColorRamp(DARK_CHROME_STOPS, RAMP_SIZE),
    backRim: ['rgba(8, 9, 8, 0.9)', 'rgba(236, 242, 234, 0.45)'],
    frontRim: ['#050605', 'rgba(242, 255, 214, 0.6)'],
    frontRimWidth: 2.5,
  },
  light: {
    ramp: buildColorRamp(LIGHT_CHROME_STOPS, RAMP_SIZE),
    backRim: ['rgba(107, 115, 112, 0.45)', 'rgba(255, 255, 255, 0.85)'],
    frontRim: ['#a9b2a5', 'rgba(255, 255, 255, 0.9)'],
    frontRimWidth: 1.5,
  },
}

/** Static film grain, painted once per resize on its own overlay canvas. */
export function paintGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  random = Math.random,
) {
  const image = ctx.createImageData(width, height)
  for (let i = 0; i < image.data.length; i += 4) {
    const value = random() * 255
    image.data[i] = value
    image.data[i + 1] = value
    image.data[i + 2] = value
    image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
}

export function paintScene(ctx: CanvasRenderingContext2D, frame: SceneFrame) {
  const { shape, coin, radius } = frame
  const palette = SCENE_PALETTES[frame.tone]
  ctx.clearRect(0, 0, shape.width, shape.height)

  const edges = sampleRibbon(shape, RIBBON_SEGMENTS)
  paintRibbonSurface(ctx, edges, shape.phase, palette.ramp)
  paintRibbonRims(ctx, edges, palette)

  const placement = coinPlacement(coin.x, shape, radius)
  paintCoin(ctx, {
    x: placement.center.x,
    y: placement.center.y,
    radius,
    roll: coin.roll,
    tilt: placement.angle * 0.35,
  })
}

function paintRibbonSurface(
  ctx: CanvasRenderingContext2D,
  edges: Array<RibbonEdge>,
  phase: number,
  ramp: Array<string>,
) {
  ctx.lineWidth = 0.8
  for (let i = 0; i < edges.length - 1; i++) {
    const from = edges[i]
    const to = edges[i + 1]
    const slope = (to.frontY - from.frontY) / (to.frontX - from.frontX)
    const shade = chromeShade(slope, from.twist, from.frontX, phase)
    const color = ramp[Math.floor(shade * RAMP_SIZE)]

    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(from.frontX, from.frontY)
    ctx.lineTo(to.frontX, to.frontY)
    ctx.lineTo(to.backX, to.backY)
    ctx.lineTo(from.backX, from.backY)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}

function strokeEdge(
  ctx: CanvasRenderingContext2D,
  edges: Array<RibbonEdge>,
  side: 'front' | 'back',
  offsetY: number,
) {
  ctx.beginPath()
  edges.forEach((edge, index) => {
    const x = side === 'front' ? edge.frontX : edge.backX
    const y = (side === 'front' ? edge.frontY : edge.backY) + offsetY
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}

function paintRibbonRims(
  ctx: CanvasRenderingContext2D,
  edges: Array<RibbonEdge>,
  palette: ScenePalette,
) {
  const [backOutline, backHighlight] = palette.backRim
  const [frontOutline, frontHighlight] = palette.frontRim
  ctx.lineJoin = 'round'

  ctx.strokeStyle = backOutline
  ctx.lineWidth = 2
  strokeEdge(ctx, edges, 'back', 0)
  ctx.strokeStyle = backHighlight
  ctx.lineWidth = 1
  strokeEdge(ctx, edges, 'back', -1)

  ctx.strokeStyle = frontOutline
  ctx.lineWidth = palette.frontRimWidth
  strokeEdge(ctx, edges, 'front', 0)
  ctx.strokeStyle = frontHighlight
  ctx.lineWidth = 1.2
  strokeEdge(ctx, edges, 'front', -1.6)
}

type CoinPose = {
  x: number
  y: number
  radius: number
  roll: number
  tilt: number
}

/** The coin face is seen slightly from the side. */
const FACE_SQUASH = 0.86

function paintCoin(ctx: CanvasRenderingContext2D, pose: CoinPose) {
  const { radius } = pose
  const rx = radius * FACE_SQUASH

  ctx.save()
  ctx.translate(pose.x, pose.y)
  ctx.rotate(pose.tilt)

  paintCoinEdge(ctx, radius, rx)
  paintCoinFace(ctx, radius, rx, pose.roll)

  ctx.scale(FACE_SQUASH, 1)
  ctx.rotate(pose.roll)
  paintEmbossedMark(ctx, radius * 0.5)

  ctx.restore()
}

/**
 * The coin's thickness: a short metallic band behind the face, lit from the
 * top so it reads as the rim of the coin rather than a shadow.
 */
function paintCoinEdge(
  ctx: CanvasRenderingContext2D,
  radius: number,
  rx: number,
) {
  const depth = radius * 0.12
  const band = ctx.createLinearGradient(0, -radius, 0, radius)
  band.addColorStop(0, SCENE_COLORS.lime200)
  band.addColorStop(0.5, SCENE_COLORS.limeMid)
  band.addColorStop(1, SCENE_COLORS.limeShade)
  ctx.fillStyle = band
  for (let layer = 6; layer >= 1; layer--) {
    const k = layer / 6
    ctx.beginPath()
    ctx.ellipse(-depth * k, depth * 0.12 * k, rx, radius, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function paintCoinFace(
  ctx: CanvasRenderingContext2D,
  radius: number,
  rx: number,
  roll: number,
) {
  const sweep = roll * 0.5
  const gx = Math.cos(sweep) * radius
  const gy = Math.sin(sweep) * radius
  const face = ctx.createLinearGradient(-gx, -gy, gx, gy)
  face.addColorStop(0, SCENE_COLORS.limeBorder)
  face.addColorStop(0.28, SCENE_COLORS.lime400)
  face.addColorStop(0.45, SCENE_COLORS.limeShine)
  face.addColorStop(0.6, SCENE_COLORS.limeMid)
  face.addColorStop(0.85, SCENE_COLORS.limeShade)
  face.addColorStop(1, SCENE_COLORS.lime200)
  ctx.fillStyle = face
  ctx.beginPath()
  ctx.ellipse(0, 0, rx, radius, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.lineWidth = radius * 0.06
  ctx.strokeStyle = 'rgba(31, 51, 8, 0.45)'
  ctx.beginPath()
  ctx.ellipse(0.8, 0.8, rx * 0.9, radius * 0.9, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(242, 255, 214, 0.55)'
  ctx.beginPath()
  ctx.ellipse(-0.8, -0.8, rx * 0.9, radius * 0.9, 0, 0, Math.PI * 2)
  ctx.stroke()
}

function traceHexagon(ctx: CanvasRenderingContext2D, radius: number) {
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function fillMark(
  ctx: CanvasRenderingContext2D,
  radius: number,
  bandColor: string,
  dotColor: string,
) {
  ctx.beginPath()
  traceHexagon(ctx, radius)
  traceHexagon(ctx, radius * MARK_INNER_RATIO)
  ctx.fillStyle = bandColor
  ctx.fill('evenodd')
  ctx.beginPath()
  ctx.arc(0, 0, radius * MARK_DOT_RATIO, 0, Math.PI * 2)
  ctx.fillStyle = dotColor
  ctx.fill()
}

/** The Kora mark stamped into the coin: shadow, highlight, then the relief. */
function paintEmbossedMark(ctx: CanvasRenderingContext2D, radius: number) {
  const shadow = 'rgba(31, 51, 8, 0.55)'
  const highlight = 'rgba(242, 255, 214, 0.75)'

  ctx.save()
  ctx.translate(1.6, 1.6)
  fillMark(ctx, radius, shadow, shadow)
  ctx.restore()

  ctx.save()
  ctx.translate(-1.2, -1.2)
  fillMark(ctx, radius, highlight, highlight)
  ctx.restore()

  fillMark(ctx, radius, SCENE_COLORS.limeFace, SCENE_COLORS.ink)
}
