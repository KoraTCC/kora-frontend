/**
 * Geometry and physics of the login scene: a twisting chrome ribbon with a
 * Kora coin rolling on it. Pure functions — painting lives in coinRibbonPaint.
 *
 * Coordinates are CSS pixels of the scene, y grows downward.
 */

export type RibbonEdge = {
  /** Front edge (the thick rim, closest to the viewer). */
  frontX: number
  frontY: number
  /** Back edge, after the ribbon's twist is projected. */
  backX: number
  backY: number
  /** Twist angle in radians: 0 = lying flat, π/2 = facing the viewer. */
  twist: number
}

export type RibbonShape = {
  width: number
  height: number
  /** Animation phase; grows with time and moves the wave to the right. */
  phase: number
  /** Wave height multiplier (1 = default). */
  amplitude: number
}

export type CoinState = {
  x: number
  velocity: number
  /** Accumulated roll angle in radians. */
  roll: number
}

export type Point = { x: number; y: number }

const PRIMARY_FREQUENCY = 0.0058
const SECONDARY_FREQUENCY = 0.013
const TWIST_FREQUENCY = 0.0042

/** Ribbon band width, relative to the scene height. */
export function ribbonBandWidth(height: number) {
  return height * 0.17
}

/** Coin radius for a scene size; `scale` 1 = default. */
export function coinRadius(width: number, height: number, scale = 1) {
  return Math.min(width, height) * 0.1 * scale
}

/** Front-edge height and twist of the ribbon at `x`. */
export function ribbonAt(x: number, shape: RibbonShape) {
  const { height, phase, amplitude } = shape
  const wave =
    height * 0.11 * Math.sin(x * PRIMARY_FREQUENCY - phase) +
    height * 0.045 * Math.sin(x * SECONDARY_FREQUENCY - phase * 0.7)
  const y = height * 0.42 + amplitude * wave
  const twist = 0.95 + 0.75 * Math.sin(x * TWIST_FREQUENCY - phase * 0.45 + 1.2)
  return { y, twist }
}

/** Both edges of the ribbon at `x`, with the twist projected to the screen. */
export function ribbonEdgeAt(x: number, shape: RibbonShape): RibbonEdge {
  const { y, twist } = ribbonAt(x, shape)
  const band = ribbonBandWidth(shape.height)
  const cos = Math.cos(twist)
  const sin = Math.sin(twist)
  return {
    frontX: x,
    frontY: y,
    backX: x + band * cos * 0.55,
    backY: y - band * sin - band * cos * 0.22,
    twist,
  }
}

/** Samples the ribbon a little past both sides so its ends never show. */
export function sampleRibbon(shape: RibbonShape, segments: number) {
  const start = -shape.width * 0.15
  const end = shape.width * 1.15
  const edges: Array<RibbonEdge> = []
  for (let i = 0; i <= segments; i++) {
    edges.push(ribbonEdgeAt(start + (end - start) * (i / segments), shape))
  }
  return edges
}

/** Midline of the band at `x` — where the coin touches the ribbon. */
export function ribbonMidpoint(x: number, shape: RibbonShape): Point {
  const edge = ribbonEdgeAt(x, shape)
  return {
    x: (edge.frontX + edge.backX) / 2,
    y: (edge.frontY + edge.backY) / 2,
  }
}

/**
 * Position in the chrome ramp (0–1) for a ribbon segment: how much the
 * surface faces the light, plus a slow sweep so the reflection travels.
 */
export function chromeShade(
  slope: number,
  twist: number,
  x: number,
  phase: number,
) {
  const cos = Math.cos(twist)
  const normalX = slope * cos
  const normalY = -cos
  const normalZ = Math.sin(twist)
  const length = Math.hypot(normalX, normalY, normalZ) || 1
  const light = (-0.25 * normalX - 0.62 * normalY + 0.74 * normalZ) / length
  const sweep = 0.16 * Math.sin(x * 0.0065 - phase * 1.4)
  return clamp(0.5 + 0.42 * light + sweep, 0, 0.999)
}

const GRAVITY = 450
const FRICTION = 0.45
const PUSH = 170

/** Coin that is about to enter from the left edge. */
export function enteringCoin(radius: number, random = Math.random): CoinState {
  return { x: -radius * 2.5, velocity: 220 + random() * 80, roll: 0 }
}

/**
 * Advances the coin by `dt` seconds. It speeds up downhill, slows uphill and
 * gets a steady push to the right; once it leaves either side it re-enters
 * from the left.
 */
export function stepCoin(
  coin: CoinState,
  shape: RibbonShape,
  radius: number,
  dt: number,
  random = Math.random,
): CoinState {
  const isOffStage = coin.x < -radius * 6 || coin.x > shape.width + radius * 3
  if (isOffStage) return enteringCoin(radius, random)

  const slope =
    (ribbonAt(coin.x + 2, shape).y - ribbonAt(coin.x - 2, shape).y) / 4
  const downhill = (GRAVITY * slope) / Math.sqrt(1 + slope * slope)
  const acceleration = downhill - coin.velocity * FRICTION + PUSH
  const velocity = coin.velocity + acceleration * dt
  const distance = velocity * dt

  return {
    x: coin.x + distance,
    velocity,
    roll: coin.roll + distance / radius,
  }
}

/** Where to draw the coin: its contact point, centre and tilt. */
export function coinPlacement(x: number, shape: RibbonShape, radius: number) {
  const before = ribbonMidpoint(x - 3, shape)
  const after = ribbonMidpoint(x + 3, shape)
  const tangentX = after.x - before.x
  const tangentY = after.y - before.y
  const length = Math.hypot(tangentX, tangentY) || 1
  const contact = ribbonMidpoint(x, shape)
  return {
    contact,
    center: {
      x: contact.x + (tangentY / length) * radius,
      y: contact.y - (tangentX / length) * radius,
    },
    angle: Math.atan2(tangentY, tangentX),
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
