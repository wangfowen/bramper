import {ToolCategory} from "./tools";

//this should be moved to a json file as well
export const BackgroundCategory: ToolCategory = {
  id: "1",
  name: "Background",
  icon: "TODO(image)"
};

export type Color = string;

export const ColoredBackgroundType = "ColoredBackgroundType";
export interface ColoredBackgroundJson {
  type: typeof ColoredBackgroundType,
  color: Color
}

export const GradientBackgroundType = "GradientBackgroundType";
export interface GradientBackgroundJson {
  type: typeof GradientBackgroundType,
  startColor: Color,
  endColor: Color
}

