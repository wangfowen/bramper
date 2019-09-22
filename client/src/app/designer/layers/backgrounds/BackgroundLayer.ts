import {GradientBackground} from "./GradientBackground";
import {ColoredBackground} from "./ColoredBackground";
import {BackgroundJson, BackgroundType} from "app/models/designer/background";
import {Layer} from "../Layer";
import {Packaging} from "../../packaging/Packaging";
import {DielineCoords, FullDieline, PackageSide} from "app/models/designer/packaging";

export interface BackgroundLayer extends Layer {
  styleDraw: (context: CanvasRenderingContext2D) => void,
}

export type BackgroundMap = {[side: string]: BackgroundLayer}

export const BackgroundHelper = {
  newBackground: (backgroundJson: BackgroundJson): BackgroundLayer => {
    switch (backgroundJson.type) {
      case BackgroundType.ColoredBackground:
        return ColoredBackground.fromJson(backgroundJson);
      case BackgroundType.GradientBackground:
        return GradientBackground.fromJson(backgroundJson);
    }
  },

  getBackgroundAt: (backgroundLayers: BackgroundMap, coord: DielineCoords, packaging: Packaging): {layer: BackgroundLayer, side: PackageSide} | undefined => {
    const sideAtIntersection = packaging.sideAtCoords(coord);
    if (sideAtIntersection) {
      if (backgroundLayers[sideAtIntersection] !== undefined) {
        return {
          layer: backgroundLayers[sideAtIntersection],
          side: sideAtIntersection
        };
      }
    }

    if (backgroundLayers[FullDieline]) {
      return {
        layer: backgroundLayers[FullDieline],
        side: FullDieline
      }
    }

    return undefined;
  }
};
