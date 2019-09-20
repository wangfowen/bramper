import React from 'react';

import {ColorPickerField} from "app/common/ReduxForm/ColorPickerField";
import {BackgroundLayer} from "./BackgroundLayer";
import {BackgroundType, Color, GradientBackgroundJson} from "app/models/designer/background";

export class GradientBackground implements BackgroundLayer {
  constructor(readonly startColor: Color, readonly endColor: Color) {}

  static fromJson(json: GradientBackgroundJson): GradientBackground {
    const startColor = json.startColor;
    const endColor = json.endColor;
    return new GradientBackground(startColor, endColor)
  }

  draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
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
