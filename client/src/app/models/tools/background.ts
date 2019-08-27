import {ToolCategory} from "./tools";

//this should be moved to a json file as well
export const BackgroundCategory: ToolCategory = {
  id: "1",
  name: "Background",
  icon: "TODO(image)"
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

