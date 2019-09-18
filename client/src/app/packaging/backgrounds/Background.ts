import {GradientBackground} from "./GradientBackground";
import {ColoredBackground} from "./ColoredBackground";
import {BackgroundJson, BackgroundType} from "app/models/background";

export interface Background {
  draw: (context: CanvasRenderingContext2D) => void,
  toJson: () => BackgroundJson,
  editForm: () => React.ReactNode
}

export const BackgroundHelper = {
  newBackground: (backgroundJson: BackgroundJson): Background => {
    switch (backgroundJson.type) {
      case BackgroundType.ColoredBackground:
        return ColoredBackground.fromJson(backgroundJson);
      case BackgroundType.GradientBackground:
        return GradientBackground.fromJson(backgroundJson);
    }
  }
};
