export type Color = string;

export enum BackgroundType {
  ColoredBackground = "ColoredBackground",
  GradientBackground = "GradientBackground"
}
export interface ColoredBackgroundJson {
  type: BackgroundType.ColoredBackground,
  color: Color
}

export interface GradientBackgroundJson {
  type: BackgroundType.GradientBackground,
  startColor: Color,
  endColor: Color
}

export type BackgroundJson = ColoredBackgroundJson | GradientBackgroundJson
