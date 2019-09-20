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
    readonly name: string,
    readonly id: LayerId
  ) {}

  static fromJson(json: TextJson, id: LayerId) {
    return new Text(json.text, json.fontSize, json.fontFamily, json.origin, json.name, id)
  }

  setFont(context: CanvasRenderingContext2D) {
    context.textAlign = "center";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillStyle = "black";
  }

  draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.setFont(context);
    //x and y for fillText defined from top left
    const y = canvas.height - this.origin.y;
    context.fillText(this.text, this.origin.x, y)
  }

  editForm() {
    return <>
      <TextField name="text" label="Text" isRequired />
      <TextField name="fontSize" label="Font Size" isRequired />
    </>
  }

  toJson(): TextJson {
    return {
      type: ContentType.Text,
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      name: this.name,
      origin: this.origin
    }
  }

  //TODO: need to convert origin from canvas coord to not
  collides(coord: DielineCoords, context: CanvasRenderingContext2D) {
    this.setFont(context);
    const width = context.measureText(this.text).width;
    //close approximation
    const height = context.measureText("M").width;
    console.log(`width: ${width} height: ${height} coord: ${coord.x} ${coord.y} origin: ${this.origin.x} ${this.origin.y}`);
    return coord.x >= this.origin.x - width / 2.0 &&
      coord.x <= this.origin.x + width / 2.0 &&
      coord.y >= this.origin.y - height / 2.0 &&
      coord.y <= this.origin.y + height / 2.0;
  }
}
