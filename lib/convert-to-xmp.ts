import type { PresetAPIResponse } from "./types/preset"

/**
 * Converts preset data to XMP format for Adobe Lightroom
 */
export function convertToXMP(presetData: any): string {
  // Handle both the custom API format and our internal format
  const data = presetData.preset_data || presetData

  // Default values for required fields
  const defaults = {
    white_balance: 5500,
    adjustments: {
      contrast: 0,
      clarity: 0,
      saturation: 0,
      vibrance: 0,
      sharpness: 25,
      grain: 0,
      vignette: {
        amount: 0,
        midpoint: 50,
        roundness: 0
      },
      dehaze: 0
    },
    hsl: {
      red: { hue: 0, saturation: 0, luminance: 0 },
      orange: { hue: 0, saturation: 0, luminance: 0 },
      yellow: { hue: 0, saturation: 0, luminance: 0 },
      green: { hue: 0, saturation: 0, luminance: 0 },
      aqua: { hue: 0, saturation: 0, luminance: 0 },
      blue: { hue: 0, saturation: 0, luminance: 0 },
      purple: { hue: 0, saturation: 0, luminance: 0 }
    },
    split_toning: {
      shadows: { hue: 0, saturation: 0 },
      highlights: { hue: 0, saturation: 0 }
    },
    color_grading: {
      shadows: { hue: 0, saturation: 0, luminance: 0 },
      midtones: { hue: 0, saturation: 0, luminance: 0 },
      highlights: { hue: 0, saturation: 0, luminance: 0 },
      color_mixer: {
        red: { hue: 0, saturation: 0 },
        green: { hue: 0, saturation: 0 },
        blue: { hue: 0, saturation: 0 }
      }
    },
    tone_curve: {
      points: [
        { x: 0, y: 0 },
        { x: 0.25, y: 0.25 },
        { x: 0.5, y: 0.5 },
        { x: 0.75, y: 0.75 },
        { x: 1, y: 1 }
      ]
    }
  }

  // Merge the data with defaults
  const mergedData = {
    white_balance: data.white_balance || defaults.white_balance,
    adjustments: { ...defaults.adjustments, ...(data.adjustments || {}) },
    hsl: { ...defaults.hsl, ...(data.hsl || {}) },
    split_toning: { ...defaults.split_toning, ...(data.split_toning || {}) },
    color_grading: { ...defaults.color_grading, ...(data.color_grading || {}) },
    tone_curve: data.tone_curve || defaults.tone_curve
  }

  // Ensure vignette object exists
  if (!mergedData.adjustments.vignette) {
    mergedData.adjustments.vignette = defaults.adjustments.vignette
  }

  const xmpTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        ">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      crs:Version="15.4"
      crs:ProcessVersion="11.0"
      crs:WhiteBalance="Custom"
      crs:Temperature="${mergedData.white_balance}"
      crs:Tint="0"
      crs:Exposure2012="${data.exposure || 0.00}"
      crs:Contrast2012="${mergedData.adjustments.contrast}"
      crs:Highlights2012="${data.highlights || 0}"
      crs:Shadows2012="${data.shadows || 0}"
      crs:Whites2012="${data.whites || 0}"
      crs:Blacks2012="${data.blacks || 0}"
      crs:Texture="${data.texture || 0}"
      crs:Clarity2012="${mergedData.adjustments.clarity}"
      crs:Dehaze="${mergedData.adjustments.dehaze}"
      crs:Vibrance="${mergedData.adjustments.vibrance}"
      crs:Saturation="${mergedData.adjustments.saturation}"
      crs:ParametricShadows="0"
      crs:ParametricDarks="0"
      crs:ParametricLights="0"
      crs:ParametricHighlights="0"
      crs:ParametricShadowSplit="25"
      crs:ParametricMidtoneSplit="50"
      crs:ParametricHighlightSplit="75"
      crs:Sharpness="${mergedData.adjustments.sharpness}"
      crs:SharpenRadius="1.0"
      crs:SharpenDetail="25"
      crs:SharpenEdgeMasking="0"
      crs:LuminanceSmoothing="0"
      crs:ColorNoiseReduction="25"
      crs:HueAdjustmentRed="${mergedData.hsl.red.hue}"
      crs:HueAdjustmentOrange="${mergedData.hsl.orange.hue}"
      crs:HueAdjustmentYellow="${mergedData.hsl.yellow.hue}"
      crs:HueAdjustmentGreen="${mergedData.hsl.green.hue}"
      crs:HueAdjustmentAqua="${mergedData.hsl.aqua.hue}"
      crs:HueAdjustmentBlue="${mergedData.hsl.blue.hue}"
      crs:HueAdjustmentPurple="${mergedData.hsl.purple.hue}"
      crs:HueAdjustmentMagenta="0"
      crs:SaturationAdjustmentRed="${mergedData.hsl.red.saturation}"
      crs:SaturationAdjustmentOrange="${mergedData.hsl.orange.saturation}"
      crs:SaturationAdjustmentYellow="${mergedData.hsl.yellow.saturation}"
      crs:SaturationAdjustmentGreen="${mergedData.hsl.green.saturation}"
      crs:SaturationAdjustmentAqua="${mergedData.hsl.aqua.saturation}"
      crs:SaturationAdjustmentBlue="${mergedData.hsl.blue.saturation}"
      crs:SaturationAdjustmentPurple="${mergedData.hsl.purple.saturation}"
      crs:SaturationAdjustmentMagenta="0"
      crs:LuminanceAdjustmentRed="${mergedData.hsl.red.luminance}"
      crs:LuminanceAdjustmentOrange="${mergedData.hsl.orange.luminance}"
      crs:LuminanceAdjustmentYellow="${mergedData.hsl.yellow.luminance}"
      crs:LuminanceAdjustmentGreen="${mergedData.hsl.green.luminance}"
      crs:LuminanceAdjustmentAqua="${mergedData.hsl.aqua.luminance}"
      crs:LuminanceAdjustmentBlue="${mergedData.hsl.blue.luminance}"
      crs:LuminanceAdjustmentPurple="${mergedData.hsl.purple.luminance}"
      crs:LuminanceAdjustmentMagenta="0"
      crs:SplitToningShadowHue="${mergedData.split_toning.shadows.hue}"
      crs:SplitToningShadowSaturation="${mergedData.split_toning.shadows.saturation}"
      crs:SplitToningHighlightHue="${mergedData.split_toning.highlights.hue}"
      crs:SplitToningHighlightSaturation="${mergedData.split_toning.highlights.saturation}"
      crs:SplitToningBalance="0"
      crs:ColorGradeMidtoneHue="${mergedData.color_grading.midtones.hue}"
      crs:ColorGradeMidtoneSat="${mergedData.color_grading.midtones.saturation}"
      crs:ColorGradeMidtoneLum="${mergedData.color_grading.midtones.luminance}"
      crs:ColorGradeShadowLum="${mergedData.color_grading.shadows.luminance}"
      crs:ColorGradeHighlightLum="${mergedData.color_grading.highlights.luminance}"
      crs:ColorGradeBlending="50"
      crs:ColorGradeGlobalHue="0"
      crs:ColorGradeGlobalSat="0"
      crs:ColorGradeGlobalLum="0"
      crs:AutoLateralCA="0"
      crs:LensProfileEnable="0"
      crs:LensManualDistortionAmount="0"
      crs:VignetteAmount="${mergedData.adjustments.vignette.amount}"
      crs:VignetteMidpoint="${mergedData.adjustments.vignette.midpoint}"
      crs:VignetteRoundness="${mergedData.adjustments.vignette.roundness}"
      crs:VignetteFeather="50"
      crs:VignetteHighlightContrast="0"
      crs:GrainAmount="${mergedData.adjustments.grain}"
      crs:GrainSize="25"
      crs:GrainFrequency="50"
      crs:PostCropVignetteAmount="0"
      crs:ShadowTint="0"
      crs:RedHue="${mergedData.color_grading.color_mixer.red.hue}"
      crs:RedSaturation="${mergedData.color_grading.color_mixer.red.saturation}"
      crs:GreenHue="${mergedData.color_grading.color_mixer.green.hue}"
      crs:GreenSaturation="${mergedData.color_grading.color_mixer.green.saturation}"
      crs:BlueHue="${mergedData.color_grading.color_mixer.blue.hue}"
      crs:BlueSaturation="${mergedData.color_grading.color_mixer.blue.saturation}"
      crs:ConvertToGrayscale="False"
      crs:OverrideLookVignette="False"
      crs:ToneCurveName2012="Custom"
      crs:CameraProfile="Adobe Standard"
      crs:CameraProfileDigest="9B7500593B80F53EC60CBB8FACBCF944"
      crs:HasSettings="True"
      crs:CropTop="0"
      crs:CropLeft="0"
      crs:CropBottom="1"
      crs:CropRight="1"
      crs:CropAngle="0"
      crs:CropConstrainToWarp="0"
      crs:HasCrop="False"
      crs:AlreadyApplied="False"
      crs:ToneCurvePV2012="${generateToneCurveString(mergedData.tone_curve)}"
      crs:ToneCurvePV2012Red="${generateToneCurveString(mergedData.tone_curve)}"
      crs:ToneCurvePV2012Green="${generateToneCurveString(mergedData.tone_curve)}"
      crs:ToneCurvePV2012Blue="${generateToneCurveString(mergedData.tone_curve)}"
      xmp:CreatorTool="PresetLab AI"
      xmp:MetadataDate="2024-01-01T00:00:00Z"
      xmp:ModifyDate="2024-01-01T00:00:00Z"/>
  </rdf:RDF>
</x:xmpmeta>`

  return xmpTemplate
}

/**
 * Generate tone curve string from points array
 */
function generateToneCurveString(toneCurve: { points: Array<{ x: number; y: number }> }): string {
  if (!toneCurve || !toneCurve.points || !Array.isArray(toneCurve.points)) {
    // Default tone curve if none provided
    return "0, 0, 64, 64, 128, 128, 192, 192, 255, 255"
  }
  return toneCurve.points.map((point) => `${Math.round(point.x * 255)}, ${Math.round(point.y * 255)}`).join(", ")
}