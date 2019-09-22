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

  getTextSize(context: CanvasRenderingContext2D): {width: number, height: number} {
    return {
      width: context.measureText(this.text).width,
      //close approximation
      height: context.measureText("M").width
    }
  }

  draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, selected?: boolean) {
    this.setFont(context);
    //x and y for fillText defined from top left
    const y = canvas.height - this.origin.y;
    context.fillText(this.text, this.origin.x, y);

    if (selected) {
      const {width, height} = this.getTextSize(context);
      context.lineWidth = 1;
      context.strokeStyle = "blue";
      context.strokeRect(this.origin.x - width / 2.0, y - height, width, height);
    }
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

  collides(coord: DielineCoords, context: CanvasRenderingContext2D) {
    this.setFont(context);
    const {width, height} = this.getTextSize(context);
    return coord.x >= this.origin.x - width / 2.0 &&
      coord.x <= this.origin.x + width / 2.0 &&
      coord.y >= this.origin.y - height / 2.0 &&
      coord.y <= this.origin.y + height / 2.0;
  }
}
