import {CanvasCoords, ContentJson} from "./content";
import {BackgroundJson} from "./background";
import {LayerType} from "./layer";

export type CategoryId = string;

export interface ToolCategoryJson {
  id: CategoryId,
  name: string,
  icon: string,
}

export interface ContentTool {
  name: string,
  image: string,
  type: LayerType.Content,
  props: ContentJson,
  relativeOrigin: CanvasCoords,
  boundary: CanvasCoords
}

export interface BackgroundTool {
  name: string,
  image: string,
  type: LayerType.Background,
  props: BackgroundJson
}

export type ToolJson = ContentTool | BackgroundTool;
