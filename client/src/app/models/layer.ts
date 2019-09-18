import {BackgroundJson} from "./background";

export type CategoryId = string;
export type LayerId = string;

export enum LayerType {
  Text = "Text"
}
export interface TextJson {
  type: LayerType.Text,
  text: string
  fontFamily: string,
  fontSize: number,
  origin: {x: number, y: number}
}

export type LayerJson = TextJson

export interface LayerData {
  id: LayerId,
  json: LayerJson
}

export enum ToolType {
  Layer = "Layer",
  Background = "Background"
}

export interface ToolCategoryJson {
  id: CategoryId,
  name: string,
  icon: string,
}

export interface ToolJson {
  name: string,
  image: string,
  type: ToolType,
  props: LayerJson | BackgroundJson
}

export type CanvasCoords = {
  x: number,
  y: number
}
