export interface ColorGrading {
  shadows?: {
    hue?: number
    saturation?: number
    luminance?: number
  }
  midtones?: {
    hue?: number
    saturation?: number
    luminance?: number
  }
  highlights?: {
    hue?: number
    saturation?: number
    luminance?: number
  }
  color_mixer?: {
    red?: {
      hue?: number
      saturation?: number
      luminance?: number
    }
    green?: {
      hue?: number
      saturation?: number
      luminance?: number
    }
    blue?: {
      hue?: number
      saturation?: number
      luminance?: number
    }
  }
}

export interface Adjustments {
  contrast?: number
  clarity?: number
  saturation?: number
  vibrance?: number
  sharpness?: number
  grain?: number
  vignette?: {
    amount?: number
    midpoint?: number
    roundness?: number
  }
  dehaze?: number
}

export interface SplitToning {
  shadows?: {
    hue?: number
    saturation?: number
  }
  highlights?: {
    hue?: number
    saturation?: number
  }
}

export interface ToneCurve {
  points?: Array<{
    x: number
    y: number
  }>
}

export interface HSL {
  red?: { hue?: number; saturation?: number; luminance?: number }
  orange?: { hue?: number; saturation?: number; luminance?: number }
  yellow?: { hue?: number; saturation?: number; luminance?: number }
  green?: { hue?: number; saturation?: number; luminance?: number }
  aqua?: { hue?: number; saturation?: number; luminance?: number }
  blue?: { hue?: number; saturation?: number; luminance?: number }
  purple?: { hue?: number; saturation?: number; luminance?: number }
}

export interface PresetAPIResponse {
  preset_name: string
  description?: string
  white_balance?: number
  color_grading?: ColorGrading
  adjustments?: Adjustments
  split_toning?: SplitToning
  tone_curve?: ToneCurve
  hsl?: HSL
  [key: string]: any // Allow for additional fields
}

export interface PresetResult {
  presetUrl?: string
  presetType?: "xmp" | "cube" | null
  presetName: string
  description?: string
  color_grading?: ColorGrading
  effects?: Record<string, number>
  lightroom_adjustments?: Record<string, number>
  rawData?: PresetAPIResponse
}
