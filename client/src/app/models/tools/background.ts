import {ToolCategory} from "./tools";

export const BackgroundCategory: ToolCategory = {
  id: "1",
  name: "Background",
  icon: "TODO(menu)"
};

export const ColoredBackgroundType = "ColoredBackgroundType";
export interface ColoredBackgroundJson {
  type: typeof ColoredBackgroundType,
  color: string
}

export const GradientBackgroundType = "GradientBackgroundType";
export interface GradientBackgroundJson {
  type: typeof GradientBackgroundType,
  startColor: string,
  endColor: string
}

