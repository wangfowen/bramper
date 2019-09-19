import React from 'react';

import {BackgroundLayer} from "./BackgroundLayer";
import {BackgroundType, Color, ColoredBackgroundJson} from "app/models/designer/background";
import {ColorPickerField} from "app/common/ReduxForm/ColorPickerField";
import {PackageSide} from "app/models/designer/packaging";
import {LayerType} from "app/models/designer/layer";

export class ColoredBackground implements BackgroundLayer {
  constructor(readonly color: Color, readonly id: PackageSide, readonly type: LayerType.Background) {}

  static fromJson(json: ColoredBackgroundJson, side: PackageSide) {
    return new ColoredBackground(json.color, side, LayerType.Background)
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
