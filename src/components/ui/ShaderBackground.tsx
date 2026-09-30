import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

/**
 * O WebGL não lê CSS custom properties, então os tokens do acento lime são
 * repetidos aqui em hex — é o único lugar do app onde isso acontece.
 */
const GRADIENT_COLORS = {
  bgColor1: '#080908',
  bgColor2: '#080908',
  color1: '#D6FA8E',
  color2: '#B8F24B',
  color3: '#7FB02F',
} as const

type ShaderBackgroundProps = {
  className?: string
}

/** Preenche o ancestral posicionado mais próximo — quem define o tamanho é o pai. */
export function ShaderBackground({ className = '' }: ShaderBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <ShaderGradientCanvas lazyLoad={false} pointerEvents="none">
        <ShaderGradient
          {...GRADIENT_COLORS}
          animate="on"
          type="plane"
          shader="defaults"
          brightness={1.2}
          cAzimuthAngle={180}
          cDistance={3.61}
          cPolarAngle={90}
          cameraZoom={1}
          envPreset="city"
          grain="on"
          lightType="3d"
          positionX={-1.4}
          positionY={0}
          positionZ={0}
          reflection={0.1}
          rotationX={0}
          rotationY={10}
          rotationZ={50}
          uAmplitude={1}
          uDensity={1.3}
          uFrequency={5.5}
          uSpeed={0.4}
          uStrength={4}
        />
      </ShaderGradientCanvas>
    </div>
  )
}
