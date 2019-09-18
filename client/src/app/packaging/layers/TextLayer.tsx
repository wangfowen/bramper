import React from 'react';

import {Layer} from "./Layer";
import {CanvasCoords, LayerId, LayerType, TextJson} from "app/models/layer";
import {TextField} from "app/common/ReduxForm/TextField";

export class TextLayer implements Layer {
  constructor(
    readonly text: string,
    readonly fontSize: number,
    readonly fontFamily: string,
    readonly origin: CanvasCoords,
    readonly id: LayerId,
    readonly name: string = "Text Layer"
  ) {}

  static fromJson(json: TextJson, id: LayerId) {
    return new TextLayer(json.text, json.fontSize, json.fontFamily, json.origin, id)
  }

  draw(context: CanvasRenderingContext2D) {
    context.textAlign = "center";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillStyle = "black";
    context.fillText(this.text, this.origin.x, this.origin.y)
  }

  editForm() {
    return <>
      <TextField name="text" label="Text" isRequired />
    </>
  }

  toJson(): TextJson {
    return {
      type: LayerType.Text,
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      origin: this.origin
    }
  }
}
