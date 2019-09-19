import React from 'react';

import {ColorPickerField} from "app/common/ReduxForm/ColorPickerField";
import {BackgroundLayer} from "./BackgroundLayer";
import {BackgroundType, Color, GradientBackgroundJson} from "app/models/designer/background";
import {PackageSide} from "app/models/designer/packaging";
import {LayerType} from "app/models/designer/layer";

export class GradientBackground implements BackgroundLayer {
  constructor(readonly startColor: Color, readonly endColor: Color, readonly id: PackageSide, readonly type: LayerType.Background) {}

  static fromJson(json: GradientBackgroundJson, side: PackageSide): GradientBackground {
    const startColor = json.startColor;
    const endColor = json.endColor;
    return new GradientBackground(startColor, endColor, side, LayerType.Background)
  }

  draw(context: CanvasRenderingContext2D) {
    //TODO: set gradient direction correctly
    const gradient = context.createLinearGradient(0,0, 220,0);

    gradient.addColorStop(0, this.startColor);
    gradient.addColorStop(1, this.endColor);

    context.fillStyle = gradient;
  }

  editForm() {
    return <>
      <ColorPickerField name="startColor" label="Start Color" isRequired />
      <ColorPickerField name="endColor" label="End Color" isRequired />
    </>
  }

  toJson(): GradientBackgroundJson {
    return {
      type: BackgroundType.GradientBackground,
      startColor: this.startColor,
      endColor: this.endColor
    }
  }
}
