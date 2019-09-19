import {GradientBackground} from "./GradientBackground";
import {ColoredBackground} from "./ColoredBackground";
import {BackgroundJson, BackgroundType} from "app/models/designer/background";
import {Layer} from "../Layer";

export interface BackgroundLayer extends Layer {}

export type BackgroundMap = {[side: string]: BackgroundLayer}

export const BackgroundHelper = {
  newBackground: (backgroundJson: BackgroundJson): BackgroundLayer => {
    switch (backgroundJson.type) {
      case BackgroundType.ColoredBackground:
        return ColoredBackground.fromJson(backgroundJson);
      case BackgroundType.GradientBackground:
        return GradientBackground.fromJson(backgroundJson);
    }
  }
};
