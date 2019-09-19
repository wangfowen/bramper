import React from 'react';

import {ContentLayer} from "./ContentLayer";
import {ContentType, TextJson} from "app/models/designer/content";
import {TextField} from "app/common/ReduxForm/TextField";
import {LayerId} from "app/models/designer/layer";
import {DielineCoords} from "app/models/designer/packaging";

export class Text implements ContentLayer {
  constructor(
    readonly text: string,
    readonly fontSize: number,
    readonly fontFamily: string,
    readonly origin: DielineCoords,
    readonly id: LayerId,
    readonly name: string = "Text Layer"
  ) {}

  static fromJson(json: TextJson, id: LayerId) {
    return new Text(json.text, json.fontSize, json.fontFamily, json.origin, id)
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
      type: ContentType.Text,
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      origin: this.origin
    }
  }
}
