// Gera o favicon e os ícones do app a partir da geometria do logo da Kora.
// Sem dependências: desenha os pixels e codifica PNG/ICO com o zlib do Node.
//   node scripts/generate-icons.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

// Logo no espaço 1024×1024 do arquivo original.
const OUTER = [
  [512, 255],
  [737, 383],
  [737, 641],
  [512, 769],
  [287, 641],
  [287, 383],
]
const INNER = [
  [512, 356],
  [646, 434],
  [646, 590],
  [512, 667],
  [378, 590],
  [378, 434],
]
const DOT = { cx: 512, cy: 512, r: 38 }

// Recorte quadrado em volta do hexágono, com cantos arredondados.
const VIEW = { x: 212, y: 212, size: 600, radius: 132 }

const COLORS = {
  background: [0x0e, 0x11, 0x0e], // --kora-bg
  lime: [0xb8, 0xf2, 0x4b], // --kora-lime-400
  dot: [0xec, 0xf2, 0xea], // --kora-text
}

const hex = (rgb) =>
  `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`
const points = (poly) => poly.map(([x, y]) => `${x},${y}`).join(' ')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW.x} ${VIEW.y} ${VIEW.size} ${VIEW.size}">
  <rect x="${VIEW.x}" y="${VIEW.y}" width="${VIEW.size}" height="${VIEW.size}" rx="${VIEW.radius}" fill="${hex(COLORS.background)}"/>
  <path fill="${hex(COLORS.lime)}" fill-rule="evenodd" d="M${points(OUTER)}Z M${points(INNER)}Z"/>
  <circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${hex(COLORS.dot)}"/>
</svg>
`

function inside([px, py], poly) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      hit = !hit
  }
  return hit
}

function insideRoundedSquare(px, py, radius) {
  const { x, y, size } = VIEW
  const cx = Math.min(Math.max(px, x + radius), x + size - radius)
  const cy = Math.min(Math.max(py, y + radius), y + size - radius)
  return (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2
}

/** Cor do ponto no espaço do logo, ou null (transparente). */
function colorAt(px, py, radius) {
  if (!insideRoundedSquare(px, py, radius)) return null
  if ((px - DOT.cx) ** 2 + (py - DOT.cy) ** 2 <= DOT.r ** 2) return COLORS.dot
  if (inside([px, py], OUTER) && !inside([px, py], INNER)) return COLORS.lime
  return COLORS.background
}

/**
 * Desenha em `size`×`size` com 4×4 amostras por pixel (bordas suaves).
 * `square`: sem cantos arredondados (o iOS arredonda sozinho).
 */
function render(size, square = false) {
  const radius = square ? 0 : VIEW.radius
  const samples = 4
  const rgba = Buffer.alloc(size * size * 4)
  const scale = VIEW.size / size
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const px = VIEW.x + (x + (sx + 0.5) / samples) * scale
          const py = VIEW.y + (y + (sy + 0.5) / samples) * scale
          const color = colorAt(px, py, radius)
          if (!color) continue
          r += color[0]
          g += color[1]
          b += color[2]
          a += 1
        }
      }
      const i = (y * size + x) * 4
      if (a > 0) {
        rgba[i] = Math.round(r / a)
        rgba[i + 1] = Math.round(g / a)
        rgba[i + 2] = Math.round(b / a)
        rgba[i + 3] = Math.round((a / samples ** 2) * 255)
      }
    }
  }
  return rgba
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

function png(size, square = false) {
  const rgba = render(size, square)
  const rows = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    rgba.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8 // 8 bits por canal
  header[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** ICO com PNGs dentro (aceito por todos os navegadores atuais). */
function ico(sizes) {
  const images = sizes.map(png)
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // tipo: ícone
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map((image, index) => {
    const entry = Buffer.alloc(16)
    entry[0] = sizes[index] % 256 // 256 é gravado como 0
    entry[1] = sizes[index] % 256
    entry.writeUInt16LE(1, 4) // planos
    entry.writeUInt16LE(32, 6) // bits por pixel
    entry.writeUInt32LE(image.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += image.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images])
}

const out = new URL('../public/', import.meta.url)
writeFileSync(new URL('favicon.svg', out), svg)
writeFileSync(new URL('favicon.ico', out), ico([16, 32, 48]))
writeFileSync(new URL('apple-touch-icon.png', out), png(180, true))
writeFileSync(new URL('icon-192.png', out), png(192))
writeFileSync(new URL('icon-512.png', out), png(512))
if (process.argv.includes('--preview')) {
  // Prévia ampliada do tamanho de aba, para conferir a legibilidade.
  writeFileSync(new URL('../favicon-32-preview.png', out), png(32))
}
console.log('Ícones gerados em public/')
