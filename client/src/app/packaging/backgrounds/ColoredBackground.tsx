import React from 'react';

import {Background} from "./Background";
import {BackgroundType, Color, ColoredBackgroundJson} from "app/models/background";
import {ColorPickerField} from "app/common/ReduxForm/ColorPickerField";

export class ColoredBackground implements Background {
  constructor(readonly color: Color) {}

  static fromJson(json: ColoredBackgroundJson) {
    return new ColoredBackground(json.color)
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
  }

  editForm() {
    return <>
      <ColorPickerField name="color" label="Color" isRequired />
    </>
  }

  toJson(): ColoredBackgroundJson {
    return {
      type: BackgroundType.ColoredBackground,
      color: this.color
    }
  }
}
