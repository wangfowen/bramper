import {GradientBackground} from "./GradientBackground";
import {ColoredBackground} from "./ColoredBackground";
import {BackgroundJson, BackgroundType} from "app/models/designer/background";
import {PackageSide} from "app/models/designer/packaging";
import {LayerType} from "app/models/designer/layer";

export interface BackgroundLayer {
  type: LayerType.Background,
  id: PackageSide,
  draw: (context: CanvasRenderingContext2D) => void,
  toJson: () => BackgroundJson,
  editForm: () => React.ReactNode
}

export const BackgroundHelper = {
  newBackground: (backgroundJson: BackgroundJson, side: PackageSide): BackgroundLayer => {
    switch (backgroundJson.type) {
      case BackgroundType.ColoredBackground:
        return ColoredBackground.fromJson(backgroundJson, side);
      case BackgroundType.GradientBackground:
        return GradientBackground.fromJson(backgroundJson, side);
    }
  }
};
