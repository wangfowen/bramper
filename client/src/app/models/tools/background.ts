import {ToolCategory, ToolId} from "./tools";

export const BackgroundCategory: ToolCategory = {
  id: "1",
  name: "Background",
  icon: "TODO(menu)"
};

export const ColoredBackgroundId: ToolId = "1";
export const GradientBackgroundId: ToolId = "2";

export interface ColoredBackgroundProperty {
  color: string
}

export interface GradientBackgroundProperty {
  startColor: string,
  endColor: string
}

